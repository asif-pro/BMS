import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { paths } from '@/routes/paths';

import { fDateTime } from '@/utils/format-time';

import { useMockedUser } from '@/hooks/use-mocked-user';

import Iconify from '@/components/iconify';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import {
  DESTINATIONS,
  _tickets,
  _ticketVehicles,
  formatTicketVehicleOption,
  type TicketVehicleOption,
} from './_mock';
import VehicleOptionLabel from './vehicle-option-label';
import {
  aisleLabelForRow,
  buildLayoutSeats,
  DOOR_ICON,
  DRIVER_ICON,
  ENGINE_ICON,
  getLayoutDecks,
  getSeatIdFormat,
  getSideBlockAtRow,
  isSeatBlockedBySideBlock,
  seatIdForDeck,
  type SideBlockKind,
  SEAT_LAYOUTS,
  type DeckConfig,
  type LayoutConfig,
  type LayoutId,
} from './seat-layouts';
import type { TicketSeat } from './types';

// ----------------------------------------------------------------------

const SEED_TICKET = _tickets.find((ticket) => ticket.id === 'trip-1') ?? _tickets[0];

const SEED_COACH: TicketVehicleOption =
  _ticketVehicles.find((option) => option.busNumber === SEED_TICKET.busNumber) ?? _ticketVehicles[0];

const EMPTY = '—';

type DiscountMode = 'percent' | 'amount';

type QuickSeat = TicketSeat & {
  bookingTerminal?: string;
};

// ----------------------------------------------------------------------

export default function QuickTicketView() {
  const { t } = useTranslation();
  const { user } = useMockedUser();

  const [tripName, setTripName] = useState(SEED_TICKET.name);
  const [coach, setCoach] = useState<TicketVehicleOption | null>(SEED_COACH);
  const [departAt, setDepartAt] = useState<Dayjs | null>(null);
  const [from, setFrom] = useState<string | null>(SEED_TICKET.origin);
  const [to, setTo] = useState<string | null>(SEED_TICKET.destination);
  const [layoutId, setLayoutId] = useState<LayoutId | null>(null);
  const [seats, setSeats] = useState<QuickSeat[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [formLocked, setFormLocked] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const layout = SEAT_LAYOUTS.find((item) => item.id === layoutId) ?? null;
  const selectedSeats = useMemo(
    () =>
      selectedIds
        .map((id) => seats.find((seat) => seat.id === id))
        .filter((seat): seat is QuickSeat => !!seat && seat.status === 'available'),
    [selectedIds, seats]
  );

  const soldCount = seats.filter((seat) => seat.status === 'booked').length;
  const remainingCount = seats.filter((seat) => seat.status === 'available').length;

  const clearSelection = () => {
    setSelectedIds([]);
    setPurchaseOpen(false);
    setHoldOpen(false);
  };

  const handleRefresh = () => {
    if (!layoutId) {
      return;
    }

    setSeats(seedSeatsForLayout(layoutId));
    clearSelection();
  };

  const handleLayoutChange = (nextLayout: LayoutId) => {
    setLayoutId(nextLayout);
    setSeats(seedSeatsForLayout(nextLayout));
    clearSelection();
  };

  const handleCreateTrip = () => {
    if (!layoutId) {
      return;
    }

    setFormLocked(true);
  };

  const handleCancelTrip = () => {
    setCancelConfirmOpen(true);
  };

  const handleConfirmCancelTrip = () => {
    setTripName('');
    setCoach(null);
    setDepartAt(null);
    setFrom(null);
    setTo(null);
    setLayoutId(null);
    setSeats([]);
    clearSelection();
    setFormLocked(false);
    setCancelConfirmOpen(false);
  };

  const handleSeatClick = (seat: QuickSeat) => {
    if (!formLocked || seat.status !== 'available') {
      return;
    }

    setHoldOpen(false);
    setPurchaseOpen(false);
    setSelectedIds((current) =>
      current.includes(seat.id) ? current.filter((id) => id !== seat.id) : [...current, seat.id]
    );
  };

  const handlePurchase = (pricedSeats: { id: string; price: number }[]) => {
    if (!pricedSeats.length) {
      return;
    }

    const priceById = new Map(pricedSeats.map((item) => [item.id, item.price]));

    setSeats((current) =>
      current.map((seat) => {
        const price = priceById.get(seat.id);
        if (price === undefined) {
          return seat;
        }

        return {
          ...seat,
          status: 'booked',
          price,
          bookedBy: user.displayName,
          bookedAt: new Date(),
          bookingTerminal: from || 'Counter desk',
          holdBy: undefined,
          holdByAvatar: undefined,
          holdNote: undefined,
          heldAt: undefined,
        };
      })
    );
    clearSelection();
  };

  const handleHold = (note: string) => {
    if (!selectedSeats.length) {
      return;
    }

    const holdIds = new Set(selectedSeats.map((seat) => seat.id));

    setSeats((current) =>
      current.map((seat) =>
        holdIds.has(seat.id)
          ? {
              ...seat,
              status: 'held',
              holdBy: user.displayName,
              holdByAvatar: user.photoURL,
              holdNote: note.trim() || undefined,
              heldAt: new Date(),
            }
          : seat
      )
    );
    clearSelection();
  };

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="QUICK_TICKET"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_TICKETS', href: paths.dashboard.tickets.root },
          { name: 'QUICK_TICKET' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={1.5} sx={{ mb: 3, maxWidth: 320 }}>
            <Typography variant="h6">{t('SEAT_LAYOUT')}</Typography>
            <TextField
              select
              required
              fullWidth
              size="small"
              label={t('LAYOUT')}
              value={layoutId ?? ''}
              disabled={formLocked}
              onChange={(event) => handleLayoutChange(event.target.value as LayoutId)}
              SelectProps={{
                displayEmpty: true,
                renderValue: (value) => {
                  if (!value) {
                    return (
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        {t('LAYOUT_SELECT')}
                      </Box>
                    );
                  }

                  return SEAT_LAYOUTS.find((item) => item.id === value)?.label ?? String(value);
                },
              }}
              InputProps={{
                startAdornment: <FieldIcon icon="solar:widget-4-bold" />,
              }}
            >
              {SEAT_LAYOUTS.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              display="grid"
              gap={2.5}
              gridTemplateColumns={{
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: '1.4fr 1fr 1.2fr 1fr 1fr',
              }}
            >
              <Field label={t('TRIP_NAME')}>
                <TextField
                  fullWidth
                  value={tripName}
                  placeholder={t('TRIP_NAME_PLACEHOLDER')}
                  disabled={formLocked}
                  onChange={(event) => setTripName(event.target.value)}
                  InputProps={{
                    startAdornment: <FieldIcon icon="solar:document-text-bold" />,
                  }}
                />
              </Field>

              <Field label={t('COACH')}>
                <Autocomplete
                  options={_ticketVehicles}
                  value={coach}
                  disabled={formLocked}
                  onChange={(_, value) => setCoach(value)}
                  getOptionLabel={(option) => option.busNumber}
                  filterOptions={(options, state) => {
                    const query = state.inputValue.trim().toLowerCase();
                    if (!query) {
                      return options;
                    }

                    return options.filter((option) =>
                      formatTicketVehicleOption(option).toLowerCase().includes(query)
                    );
                  }}
                  isOptionEqualToValue={(option, selected) =>
                    option.busNumber === selected.busNumber
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.busNumber}>
                      <VehicleOptionLabel option={option} />
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('SELECT_COACH')}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FieldIcon icon="solar:bus-bold" />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                        endAdornment: (
                          <>
                            {coach && (
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.disabled', mr: 0.5, whiteSpace: 'nowrap' }}
                              >
                                {coach.busModel}
                              </Typography>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Field>

              <Field label={t('DATE_AND_TIME')}>
                <DateTimePicker
                  ampm
                  format="DD/MM/YYYY hh:mm A"
                  value={departAt}
                  onChange={setDepartAt}
                  disabled={formLocked}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: t('SELECT_DATE_AND_TIME'),
                      InputProps: {
                        startAdornment: <FieldIcon icon="solar:calendar-bold" />,
                      },
                    },
                  }}
                />
              </Field>

              <Field label={t('FROM')}>
                <Autocomplete
                  options={DESTINATIONS}
                  value={from}
                  disabled={formLocked}
                  onChange={(_, value) => setFrom(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('SELECT_FROM')}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FieldIcon icon="solar:map-point-bold" />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Field>

              <Field label={t('TO')}>
                <Autocomplete
                  options={DESTINATIONS}
                  value={to}
                  disabled={formLocked}
                  onChange={(_, value) => setTo(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('SELECT_DESTINATION')}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FieldIcon icon="mingcute:location-fill" />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Field>
            </Box>
          </LocalizationProvider>

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            {formLocked ? (
              <Button
                size="large"
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="solar:close-circle-bold" />}
                onClick={handleCancelTrip}
              >
                {t('CANCEL_TRIP')}
              </Button>
            ) : (
              <Button
                size="large"
                variant="contained"
                disabled={!layoutId}
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleCreateTrip}
              >
                {t('CREATE_TRIP')}
              </Button>
            )}
          </Stack>
        </Card>

        {layout && (
          <QuickSeatMap
            layout={layout}
            seats={seats}
            selectedIds={selectedIds}
            soldCount={soldCount}
            remainingCount={remainingCount}
            readOnly={!formLocked}
            onSelect={handleSeatClick}
            onRefresh={handleRefresh}
            onClearSelection={clearSelection}
            onOpenPurchase={() => {
              setHoldOpen(false);
              setPurchaseOpen(true);
            }}
            onOpenHold={() => {
              setPurchaseOpen(false);
              setHoldOpen(true);
            }}
          />
        )}
      </Stack>

      <PurchaseDialog
        open={purchaseOpen && selectedSeats.length > 0 && !holdOpen}
        seats={selectedSeats}
        onClose={() => setPurchaseOpen(false)}
        onPurchase={handlePurchase}
      />

      <HoldDialog
        open={holdOpen && selectedSeats.length > 0}
        seatIds={selectedSeats.map((seat) => seat.id)}
        onClose={() => setHoldOpen(false)}
        onHold={handleHold}
      />

      <Dialog open={cancelConfirmOpen} onClose={() => setCancelConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('CANCEL_TRIP_QUESTION')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('CANCEL_TRIP_CONFIRM_DESC')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => setCancelConfirmOpen(false)}
            startIcon={<Iconify icon="mingcute:close-line" />}
          >
            {t('KEEP_TRIP')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancelTrip}
            startIcon={<Iconify icon="solar:close-circle-bold" />}
          >
            {t('CANCEL_TRIP')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// ----------------------------------------------------------------------

function QuickSeatMap({
  layout,
  seats,
  selectedIds,
  soldCount,
  remainingCount,
  readOnly,
  onSelect,
  onRefresh,
  onClearSelection,
  onOpenPurchase,
  onOpenHold,
}: {
  layout: LayoutConfig;
  seats: QuickSeat[];
  selectedIds: string[];
  soldCount: number;
  remainingCount: number;
  readOnly: boolean;
  onSelect: (seat: QuickSeat) => void;
  onRefresh: () => void;
  onClearSelection: () => void;
  onOpenPurchase: () => void;
  onOpenHold: () => void;
}) {
  const { t } = useTranslation();
  const decks = getLayoutDecks(layout);
  const multiDeck = decks.length > 1;
  const selectedSeats = selectedIds
    .map((id) => seats.find((seat) => seat.id === id))
    .filter((seat): seat is QuickSeat => !!seat);
  const selectedTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'grid',
        gap: 3,
        alignItems: 'center',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 320px' },
      }}
    >
      <Card sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {layout.caption}
            </Typography>
            <Typography variant="h6">{layout.label}</Typography>
          </Box>

          <IconButton aria-label={t('REFRESH')} disabled={readOnly} onClick={onRefresh}>
            <Iconify icon="solar:restart-bold" />
          </IconButton>
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 2.5 }}
        >
          <StatChip
            icon="solar:ticket-bold"
            color="warning.main"
            label={t('SOLD')}
            value={String(soldCount)}
          />
          <StatChip
            icon="solar:users-group-rounded-bold"
            color="success.main"
            label={t('REMAINING')}
            value={String(remainingCount)}
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }} justifyContent="center" flexWrap="wrap" useFlexGap>
          <Legend swatch="background.paper" label={t('AVAILABLE')} />
          <Legend swatch="primary.main" label={t('SELECTED')} />
          <Legend swatch="action.hover" label={t('BOOKED')} />
          <Legend swatch="warning.main" label={t('HELD')} />
        </Stack>

        <Box
          sx={{
            maxWidth: layout.id === '1+1' ? 280 : 420,
            mx: 'auto',
            p: 2,
            borderRadius: 2,
            border: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          <Stack spacing={multiDeck ? 2.5 : 0}>
            {decks.map((deck) => (
              <QuickDeckBoard
                key={deck.id}
                layout={layout}
                deck={deck}
                showLabel={multiDeck}
                seats={seats}
                selectedIds={selectedIds}
                readOnly={readOnly}
                onSelect={onSelect}
              />
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary', fontWeight: 600 }}>
          {readOnly
            ? t('PREVIEW_ONLY_HINT')
            : t('CLICK_AVAILABLE_SEATS_HINT')}
        </Typography>

        {readOnly && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              borderRadius: 'inherit',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(22, 28, 36, 0.45)' : 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(0.5px)',
            }}
          />
        )}
      </Card>

      <Card
        sx={{
          p: 3,
          opacity: readOnly ? 0.55 : 1,
          pointerEvents: readOnly ? 'none' : 'auto',
          borderRadius: 2.5,
          border: 'none',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 12px 40px -8px rgba(0, 0, 0, 0.55), 0 4px 12px rgba(0, 0, 0, 0.35)'
              : '0 16px 40px -12px rgba(145, 158, 171, 0.36), 0 8px 16px -8px rgba(145, 158, 171, 0.24)',
          transform: { md: 'translateY(-4px)' },
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h6">
              {selectedSeats.length
                ? `${selectedSeats.length} ${t('SEATS_SELECTED')}`
                : t('SELECTED_SEATS')}
            </Typography>
            {!selectedSeats.length && (
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                {t('SELECT_SEATS')}
              </Typography>
            )}
          </Stack>

          {selectedSeats.length ? (
            <>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedSeats.map((seat) => (
                  <Chip
                    key={seat.id}
                    size="small"
                    label={seat.id}
                    color="primary"
                    variant="outlined"
                    onDelete={() => onSelect(seat)}
                  />
                ))}
              </Stack>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {t('TOTAL')}
                </Typography>
                <Typography variant="h4" sx={{ color: 'success.main', mt: 0.5 }}>
                  ৳{selectedTotal.toLocaleString('en-BD')}
                </Typography>
              </Box>

              <Stack spacing={1}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="success"
                  onClick={onOpenPurchase}
                  startIcon={<Iconify icon="solar:ticket-bold" />}
                  sx={{ fontWeight: 700, minHeight: 52, mb: 0.75 }}
                >
                  {t('BOOK')}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  onClick={onOpenHold}
                  startIcon={<Iconify icon="solar:hourglass-bold" />}
                  sx={{ fontWeight: 700 }}
                >
                  {t('HOLD')}
                </Button>
                <Button
                  fullWidth
                  color="inherit"
                  variant="outlined"
                  onClick={onClearSelection}
                  startIcon={<Iconify icon="mingcute:close-line" />}
                >
                  {t('CLEAR')}
                </Button>
              </Stack>
            </>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('CLICK_SEATS_HINT')}
            </Typography>
          )}
        </Stack>
      </Card>
    </Box>
  );
}

function SeatButton({
  seat,
  selected,
  readOnly,
  onSelect,
}: {
  seat: QuickSeat;
  selected?: boolean;
  readOnly?: boolean;
  onSelect: (seat: QuickSeat) => void;
}) {
  const booked = seat.status === 'booked';
  const held = seat.status === 'held';
  const locked = booked || held || !!readOnly;

  const button = (
    <Box
      component="button"
      type="button"
      aria-disabled={locked}
      aria-pressed={selected}
      onClick={() => {
        if (!locked) {
          onSelect(seat);
        }
      }}
      sx={{
        minWidth: 48,
        width: seat.id.includes('-') ? 52 : 48,
        height: 36,
        px: 0.25,
        borderRadius: 1,
        typography: 'caption',
        fontWeight: 700,
        cursor: locked ? 'default' : 'pointer',
        pointerEvents: readOnly ? 'none' : 'auto',
        border: (theme) =>
          `solid 1px ${
            held
              ? theme.palette.warning.main
              : selected
                ? theme.palette.primary.main
                : theme.palette.divider
          }`,
        bgcolor: held
          ? 'warning.main'
          : booked
            ? 'action.hover'
            : selected
              ? 'primary.main'
              : 'background.paper',
        color: held
          ? 'warning.contrastText'
          : booked
            ? 'text.disabled'
            : selected
              ? 'primary.contrastText'
              : 'text.primary',
        opacity: booked ? 0.85 : 1,
      }}
    >
      {seat.id}
    </Box>
  );

  if (!booked && !held) {
    return button;
  }

  return (
    <Tooltip
      arrow
      placement="top"
      enterDelay={150}
      leaveDelay={80}
      disableInteractive
      title={<SeatHoverCard seat={seat} />}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: (theme) => theme.shadows[8],
            p: 1.5,
            maxWidth: 260,
            border: (theme) => `solid 1px ${theme.palette.divider}`,
            '& .MuiTooltip-arrow': {
              color: 'background.paper',
              '&::before': {
                border: (theme) => `solid 1px ${theme.palette.divider}`,
              },
            },
          },
        },
      }}
    >
      {button}
    </Tooltip>
  );
}

function SeatHoverCard({ seat }: { seat: QuickSeat }) {
  const { t } = useTranslation();

  if (seat.status === 'booked') {
    return (
      <Stack spacing={1}>
        <Typography variant="subtitle2">{t('SEAT')} {seat.id}</Typography>
        <InfoRow icon="solar:user-rounded-bold" label={t('BOOKED_BY')} value={seat.bookedBy || EMPTY} />
        <InfoRow
          icon="solar:clock-circle-bold"
          label={t('TIME')}
          value={seat.bookedAt ? fDateTime(seat.bookedAt) : EMPTY}
        />
        <InfoRow
          icon="solar:tag-price-bold"
          label={t('PRICE')}
          value={`৳${seat.price.toLocaleString('en-BD')}`}
        />
        <InfoRow
          icon="solar:buildings-2-bold"
          label={t('BOOKING_TERMINAL')}
          value={seat.bookingTerminal || EMPTY}
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t('SEAT')} {seat.id}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar src={seat.holdByAvatar} alt={seat.holdBy} sx={{ width: 28, height: 28 }}>
          {seat.holdBy?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {t('HELD_BY')}
          </Typography>
          <Typography variant="body2" noWrap>
            {seat.holdBy || EMPTY}
          </Typography>
        </Box>
      </Stack>
      <InfoRow icon="solar:notes-bold" label={t('HELD_NOTE')} value={seat.holdNote || EMPTY} />
    </Stack>
  );
}

function PurchaseDialog({
  open,
  seats,
  onClose,
  onPurchase,
}: {
  open: boolean;
  seats: QuickSeat[];
  onClose: () => void;
  onPurchase: (pricedSeats: { id: string; price: number }[]) => void;
}) {
  const { t } = useTranslation();
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discount, setDiscount] = useState('');
  const [discountMode, setDiscountMode] = useState<DiscountMode>('percent');
  const seatKey = seats.map((seat) => seat.id).join(',');
  const pricedSeats = discountEnabled
    ? applySeatDiscounts(seats, discount, discountMode)
    : seats.map((seat) => ({ id: seat.id, price: seat.price }));
  const totalPrice = pricedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const seatLabel = seats.length === 1 ? seats[0]?.id : `${seats.length} ${t('SEATS_SELECTED')}`;

  useEffect(() => {
    if (open) {
      setDiscountEnabled(false);
      setDiscount('');
      setDiscountMode('percent');
    }
  }, [open, seatKey]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        {seats.length > 1 ? t('CONFIRM_SEATS') : t('CONFIRM_SEAT')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: 'background.neutral',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {seats.length > 1 ? t('SEATS') : t('SEAT')}
            </Typography>
            <Typography variant="h3" sx={{ my: 0.5 }}>
              {seatLabel}
            </Typography>
            {seats.length > 1 && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, px: 1 }}>
                {seats.map((seat) => seat.id).join(', ')}
              </Typography>
            )}
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <Iconify icon="solar:tag-price-bold" width={22} sx={{ color: 'success.main' }} />
              <Typography variant="h4" sx={{ color: 'success.main' }}>
                ৳{totalPrice.toLocaleString('en-BD')}
              </Typography>
            </Stack>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={discountEnabled}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setDiscountEnabled(enabled);
                  if (!enabled) {
                    setDiscount('');
                    setDiscountMode('percent');
                  }
                }}
              />
            }
            label={t('APPLY_DISCOUNT')}
            sx={{ mx: 0, justifyContent: 'space-between', width: 1 }}
            labelPlacement="start"
          />

          {discountEnabled && (
            <>
              <TextField
                fullWidth
                type="number"
                label={t('DISCOUNT')}
                placeholder={t('ENTER_PERCENTAGE_OR_AMOUNT')}
                value={discount}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setDiscount(event.target.value)}
                inputProps={{ min: 0, max: discountMode === 'percent' ? 100 : undefined }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:sale-bold" width={20} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={discountMode}
                        onChange={(_, mode: DiscountMode | null) => {
                          if (mode) {
                            setDiscountMode(mode);
                          }
                        }}
                      >
                        <ToggleButton value="percent">%</ToggleButton>
                        <ToggleButton value="amount">৳</ToggleButton>
                      </ToggleButtonGroup>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label={t('TOTAL_PRICE')}
                placeholder={t('TOTAL_PRICE')}
                value={`৳${totalPrice.toLocaleString('en-BD')}`}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="solar:tag-price-bold"
                        width={20}
                        sx={{ color: 'text.disabled' }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            {seats.length > 1 ? t('PURCHASE_NOW_HINT') : t('PURCHASE_NOW_SINGLE_HINT')}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexWrap: 'wrap' }}>
        <Button
          color="inherit"
          variant="outlined"
          onClick={onClose}
          startIcon={<Iconify icon="mingcute:close-line" />}
        >
          {t('CANCEL')}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="success"
          onClick={() => onPurchase(pricedSeats)}
          startIcon={<Iconify icon="solar:ticket-bold" />}
          sx={{ fontWeight: 700 }}
        >
          {t('PURCHASE')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function discountTotal(price: number, discount: string, mode: DiscountMode) {
  const value = Number(discount);
  if (!discount.trim() || !Number.isFinite(value) || value <= 0) {
    return price;
  }

  const off = mode === 'percent' ? (price * Math.min(value, 100)) / 100 : Math.min(value, price);
  return Math.max(0, Math.round(price - off));
}

function applySeatDiscounts(seats: QuickSeat[], discount: string, mode: DiscountMode) {
  if (mode === 'percent') {
    return seats.map((seat) => ({
      id: seat.id,
      price: discountTotal(seat.price, discount, 'percent'),
    }));
  }

  const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
  const discountedTotal = discountTotal(subtotal, discount, 'amount');
  if (!seats.length || subtotal <= 0) {
    return seats.map((seat) => ({ id: seat.id, price: seat.price }));
  }

  let remaining = discountedTotal;
  return seats.map((seat, index) => {
    if (index === seats.length - 1) {
      return { id: seat.id, price: remaining };
    }

    const share = Math.round((seat.price / subtotal) * discountedTotal);
    remaining -= share;
    return { id: seat.id, price: share };
  });
}

function HoldDialog({
  open,
  seatIds,
  onClose,
  onHold,
}: {
  open: boolean;
  seatIds: string[];
  onClose: () => void;
  onHold: (note: string) => void;
}) {
  const { t } = useTranslation();
  const { user } = useMockedUser();
  const [note, setNote] = useState('');
  const title =
    seatIds.length > 1 ? t('HOLD_SEATS', { count: seatIds.length }) : t('HOLD_SEAT', { seat: seatIds[0] ?? '' });

  useEffect(() => {
    if (open) {
      setNote('');
    }
  }, [open]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {seatIds.length > 1 && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('SEATS')}: {seatIds.join(', ')}
            </Typography>
          )}
          <TextField
            fullWidth
            label={t('HELD_BY')}
            value={user.displayName}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 28, height: 28 }}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </Avatar>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label={t('HELD_NOTE')}
            placeholder={t('ADD_A_HELD_NOTE')}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mt: 1.5, alignSelf: 'flex-start' }}>
                  <Iconify icon="solar:notes-bold" width={20} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              sx: { alignItems: 'flex-start' },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose} startIcon={<Iconify icon="mingcute:close-line" />}>
          {t('CANCEL')}
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ fontWeight: 700 }}
          startIcon={<Iconify icon="solar:hourglass-bold" />}
          onClick={() => onHold(note)}
        >
          {t('HOLD_TICKET')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Iconify icon={icon} width={18} sx={{ color: 'text.disabled', mt: 0.25, flexShrink: 0 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Stack>
  );
}

function StatChip({
  icon,
  color,
  label,
  value,
}: {
  icon: string;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{
        px: 1.75,
        py: 1,
        borderRadius: 1.5,
        bgcolor: 'background.neutral',
      }}
    >
      <Iconify icon={icon} width={22} sx={{ color }} />
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="subtitle1">{value}</Typography>
      </Box>
    </Stack>
  );
}

function seedSeatsForLayout(layoutId: LayoutId): QuickSeat[] {
  const layout = SEAT_LAYOUTS.find((item) => item.id === layoutId) ?? SEAT_LAYOUTS[0];
  const seedById = new Map(SEED_TICKET.seats.map((seat) => [seat.id, seat]));

  return buildLayoutSeats(layout).map((info) => {
    const seed = seedById.get(info.id);

    if (seed) {
      return {
        ...seed,
        bookingTerminal:
          seed.status === 'booked' ? seed.boarding || SEED_TICKET.origin || 'Counter desk' : undefined,
      };
    }

    return {
      id: info.id,
      row: info.row,
      column: info.column,
      side: info.side,
      position: info.position,
      status: 'available',
      price: info.defaultPrice || SEED_TICKET.price || 850,
    } satisfies QuickSeat;
  });
}

function seatAt(seats: QuickSeat[], id: string) {
  const seat = seats.find((item) => item.id === id);
  if (!seat) {
    throw new Error(`Missing seat ${id}`);
  }
  return seat;
}

function QuickDeckBoard({
  layout,
  deck,
  showLabel,
  seats,
  selectedIds,
  readOnly,
  onSelect,
}: {
  layout: LayoutConfig;
  deck: DeckConfig;
  showLabel: boolean;
  seats: QuickSeat[];
  selectedIds: string[];
  readOnly: boolean;
  onSelect: (seat: QuickSeat) => void;
}) {
  const { t } = useTranslation();
  const format = getSeatIdFormat(layout);
  const endCapOrder = layout.endCapOrder ?? 'driver-door';
  const showEndCaps = deck.id === 'lower';
  const frontSeats = showEndCaps ? layout.frontSeats ?? [] : [];
  const leftFront = frontSeats.filter((seat) => seat.side === 'Left');
  const rightFront = frontSeats.filter((seat) => seat.side === 'Right');
  const leftWidth = Math.max(deck.left.length, 1) * 48 + Math.max(deck.left.length - 1, 0) * 8;
  const rightWidth = Math.max(deck.right.length, 1) * 48 + Math.max(deck.right.length - 1, 0) * 8;
  const hasSideBlocks = showEndCaps && !!layout.sideBlocks?.length;
  const skippedRows = new Set<number>();

  return (
    <Stack spacing={1}>
      {showLabel && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
          {deck.label}
        </Typography>
      )}

      {showEndCaps && layout.showEngine && (
        <Stack alignItems="center" spacing={0.25} sx={{ mb: 0.5 }}>
          <Iconify icon={ENGINE_ICON} width={22} sx={{ color: 'error.main' }} />
          <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 800, letterSpacing: 1 }}>
            {t('ENGINE')}
          </Typography>
        </Stack>
      )}

      {showEndCaps && endCapOrder === 'driver-only' && !hasSideBlocks && (
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 0.5 }}>
          <Box sx={{ width: leftWidth }} />
          <Box sx={{ width: 36 }} />
          <Box sx={{ width: rightWidth, display: 'flex', justifyContent: 'flex-end' }}>
            <EndCap icon={DRIVER_ICON} label={t('DRIVER')} size={48} iconSize={32} />
          </Box>
        </Stack>
      )}

      {showEndCaps && endCapOrder !== 'driver-only' && !hasSideBlocks && (
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          {endCapOrder === 'door-driver' ? (
            <>
              <EndCap icon={DOOR_ICON} label={t('DOOR')} />
              <EndCap icon={DRIVER_ICON} label={t('DRIVER')} />
            </>
          ) : (
            <>
              <EndCap icon={DRIVER_ICON} label={t('DRIVER')} />
              <EndCap icon={DOOR_ICON} label={t('DOOR')} />
            </>
          )}
        </Stack>
      )}

      {!!frontSeats.length && (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Box
            sx={{
              width: leftWidth,
              display: 'flex',
              justifyContent: leftFront.length ? 'flex-start' : 'center',
              gap: 1,
            }}
          >
            {leftFront.map((seat) => (
              <SeatButton
                key={seat.id}
                seat={seatAt(seats, seat.id)}
                selected={selectedIds.includes(seat.id)}
                readOnly={readOnly}
                onSelect={onSelect}
              />
            ))}
          </Box>
          <Box sx={{ width: 36 }} />
          <Box
            sx={{
              width: rightWidth,
              display: 'flex',
              justifyContent: rightFront.length ? 'flex-end' : 'center',
              gap: 1,
            }}
          >
            {rightFront.map((seat) => (
              <SeatButton
                key={seat.id}
                seat={seatAt(seats, seat.id)}
                selected={selectedIds.includes(seat.id)}
                readOnly={readOnly}
                onSelect={onSelect}
              />
            ))}
          </Box>
        </Stack>
      )}

      <Stack spacing={1}>
        {Array.from({ length: deck.rows }, (_, index) => index + 1).map((row) => {
          if (skippedRows.has(row)) {
            return null;
          }

          const leftStart = showEndCaps ? getSideBlockAtRow(layout, 'Left', row) : null;
          const rightStart = showEndCaps ? getSideBlockAtRow(layout, 'Right', row) : null;

          if (leftStart || rightStart) {
            const spanRows = Array.from(
              new Set([...(leftStart?.rows ?? [row]), ...(rightStart?.rows ?? [row])])
            ).sort((a, b) => a - b);

            spanRows.forEach((spanRow) => {
              if (spanRow !== row) {
                skippedRows.add(spanRow);
              }
            });

            return (
              <Stack key={`block-${row}`} direction="row" spacing={1} alignItems="stretch" justifyContent="center">
                {leftStart ? (
                  <QuickSideFeatureBlock kind={leftStart.kind} rows={leftStart.rows.length} width={leftWidth} />
                ) : (
                  <Stack spacing={1}>
                    {spanRows.map((spanRow) => (
                      <Stack key={spanRow} direction="row" spacing={1}>
                        {deck.left.map((column) => {
                          if (isSeatBlockedBySideBlock(layout, deck, column, spanRow)) {
                            return null;
                          }
                          const id = seatIdForDeck(deck, column, spanRow, format);
                          return (
                            <SeatButton
                              key={id}
                              seat={seatAt(seats, id)}
                              selected={selectedIds.includes(id)}
                              readOnly={readOnly}
                              onSelect={onSelect}
                            />
                          );
                        })}
                      </Stack>
                    ))}
                  </Stack>
                )}

                <Stack spacing={1} justifyContent="center">
                  {spanRows.map((spanRow) => (
                    <Box key={`aisle-${spanRow}`} sx={{ width: 36, height: 36 }} />
                  ))}
                </Stack>

                {rightStart ? (
                  <QuickSideFeatureBlock kind={rightStart.kind} rows={rightStart.rows.length} width={rightWidth} />
                ) : (
                  <Stack spacing={1}>
                    {spanRows.map((spanRow) => (
                      <Stack key={spanRow} direction="row" spacing={1}>
                        {deck.right.map((column) => {
                          if (isSeatBlockedBySideBlock(layout, deck, column, spanRow)) {
                            return null;
                          }
                          const id = seatIdForDeck(deck, column, spanRow, format);
                          return (
                            <SeatButton
                              key={id}
                              seat={seatAt(seats, id)}
                              selected={selectedIds.includes(id)}
                              readOnly={readOnly}
                              onSelect={onSelect}
                            />
                          );
                        })}
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            );
          }

          return (
            <Stack key={row} direction="row" spacing={1} alignItems="center" justifyContent="center">
              {deck.left.map((column) => {
                const id = seatIdForDeck(deck, column, row, format);
                return (
                  <SeatButton
                    key={id}
                    seat={seatAt(seats, id)}
                    selected={selectedIds.includes(id)}
                    readOnly={readOnly}
                    onSelect={onSelect}
                  />
                );
              })}
              <Typography
                variant="caption"
                sx={{
                  width: 36,
                  textAlign: 'center',
                  color: 'text.disabled',
                  fontWeight: 700,
                }}
              >
                {aisleLabelForRow(layout, row)}
              </Typography>
              {deck.right.map((column) => {
                const id = seatIdForDeck(deck, column, row, format);
                return (
                  <SeatButton
                    key={id}
                    seat={seatAt(seats, id)}
                    selected={selectedIds.includes(id)}
                    readOnly={readOnly}
                    onSelect={onSelect}
                  />
                );
              })}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

function QuickSideFeatureBlock({
  kind,
  rows,
  width,
}: {
  kind: SideBlockKind;
  rows: number;
  width: number;
}) {
  const { t } = useTranslation();
  const height = rows * 36 + Math.max(rows - 1, 0) * 8;
  const isDoor = kind === 'door';

  return (
    <Tooltip title={isDoor ? t('DOOR') : t('DRIVER')} arrow placement="left">
      <Box
        aria-label={isDoor ? t('DOOR') : t('DRIVER')}
        sx={{
          width,
          height,
          borderRadius: 1,
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          color: isDoor ? 'primary.dark' : 'text.secondary',
          bgcolor: isDoor ? 'primary.lighter' : 'action.hover',
          border: (theme) =>
            `solid 1px ${isDoor ? theme.palette.primary.main : theme.palette.divider}`,
        }}
      >
        <Iconify icon={isDoor ? DOOR_ICON : DRIVER_ICON} width={isDoor ? 26 : 32} />
        {isDoor && (
          <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 0.6 }}>
            {t('DOOR')}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2">{label}</Typography>
      {children}
    </Stack>
  );
}

function FieldIcon({ icon }: { icon: string }) {
  return (
    <InputAdornment position="start">
      <Iconify icon={icon} sx={{ color: 'text.disabled' }} />
    </InputAdornment>
  );
}

function EndCap({
  icon,
  label,
  size = 36,
  iconSize = 20,
}: {
  icon: string;
  label: string;
  size?: number;
  iconSize?: number;
}) {
  return (
    <Tooltip title={label} arrow placement="top">
      <Box
        aria-label={label}
        sx={{
          width: size,
          height: size,
          borderRadius: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          bgcolor: 'action.hover',
        }}
      >
        <Iconify icon={icon} width={iconSize} />
      </Box>
    </Tooltip>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: 0.5,
          bgcolor: swatch,
          border: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      />
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
    </Stack>
  );
}
