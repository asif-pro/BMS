import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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
  DOOR_ICON,
  DRIVER_ICON,
  getLayoutDecks,
  seatIdForDeck,
  SEAT_LAYOUTS,
  type DeckConfig,
  type LayoutConfig,
  type LayoutId,
} from './seat-layouts';
import type { TicketSeat } from './types';

// ----------------------------------------------------------------------

const SEED_TICKET = _tickets.find((ticket) => ticket.id === 'trip-1') ?? _tickets[0];

const SEED_COACH: TicketVehicleOption = {
  busNumber: SEED_TICKET.busNumber,
  busModel: SEED_TICKET.busModel,
};

const EMPTY = '—';

type DiscountMode = 'percent' | 'amount';

type QuickSeat = TicketSeat & {
  bookingTerminal?: string;
};

// ----------------------------------------------------------------------

export default function QuickTicketView() {
  const { user } = useMockedUser();

  const [tripName, setTripName] = useState(SEED_TICKET.name);
  const [coach, setCoach] = useState<TicketVehicleOption | null>(SEED_COACH);
  const [departAt, setDepartAt] = useState<Dayjs | null>(null);
  const [from, setFrom] = useState<string | null>(SEED_TICKET.origin);
  const [to, setTo] = useState<string | null>(SEED_TICKET.destination);
  const [layoutId, setLayoutId] = useState<LayoutId | null>(null);
  const [seats, setSeats] = useState<QuickSeat[]>([]);
  const [actionSeatId, setActionSeatId] = useState<string | null>(null);
  const [holdOpen, setHoldOpen] = useState(false);
  const [formLocked, setFormLocked] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const layout = SEAT_LAYOUTS.find((item) => item.id === layoutId) ?? null;
  const actionSeat = useMemo(
    () => seats.find((seat) => seat.id === actionSeatId) ?? null,
    [actionSeatId, seats]
  );

  const soldCount = seats.filter((seat) => seat.status === 'booked').length;
  const remainingCount = seats.filter((seat) => seat.status === 'available').length;

  const handleRefresh = () => {
    if (!layoutId) {
      return;
    }

    setSeats(seedSeatsForLayout(layoutId));
    setActionSeatId(null);
    setHoldOpen(false);
  };

  const handleLayoutChange = (nextLayout: LayoutId) => {
    setLayoutId(nextLayout);
    setSeats(seedSeatsForLayout(nextLayout));
    setActionSeatId(null);
    setHoldOpen(false);
  };

  const handleCreateTrip = () => {
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
    setActionSeatId(null);
    setHoldOpen(false);
    setFormLocked(false);
    setCancelConfirmOpen(false);
  };

  const handleSeatClick = (seat: QuickSeat) => {
    if (!formLocked || seat.status !== 'available') {
      return;
    }

    setHoldOpen(false);
    setActionSeatId(seat.id);
  };

  const handlePurchase = (price: number) => {
    if (!actionSeatId) {
      return;
    }

    setSeats((current) =>
      current.map((seat) =>
        seat.id === actionSeatId
          ? {
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
            }
          : seat
      )
    );
    setActionSeatId(null);
  };

  const handleHold = (note: string) => {
    if (!actionSeatId) {
      return;
    }

    setSeats((current) =>
      current.map((seat) =>
        seat.id === actionSeatId
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
    setHoldOpen(false);
    setActionSeatId(null);
  };

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="Quick Ticket"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Tickets', href: paths.dashboard.tickets.root },
          { name: 'Quick Ticket' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={1.5} sx={{ mb: 3, maxWidth: 320 }}>
            <Typography variant="h6">Seat layout</Typography>
            <TextField
              select
              fullWidth
              size="small"
              label="Layout"
              value={layoutId ?? ''}
              disabled={formLocked}
              onChange={(event) => handleLayoutChange(event.target.value as LayoutId)}
              SelectProps={{
                displayEmpty: true,
                renderValue: (value) => {
                  if (!value) {
                    return (
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        Select layout
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
              <Field label="Trip name">
                <TextField
                  fullWidth
                  value={tripName}
                  placeholder="Ex: Dhaka — Sylhet Night Coach"
                  disabled={formLocked}
                  onChange={(event) => setTripName(event.target.value)}
                  InputProps={{
                    startAdornment: <FieldIcon icon="solar:document-text-bold" />,
                  }}
                />
              </Field>

              <Field label="Coach">
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
                      placeholder="Select coach"
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

              <Field label="Date and time">
                <DateTimePicker
                  ampm
                  format="DD/MM/YYYY hh:mm A"
                  value={departAt}
                  onChange={setDepartAt}
                  disabled={formLocked}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: 'Select date and time',
                      InputProps: {
                        startAdornment: <FieldIcon icon="solar:calendar-bold" />,
                      },
                    },
                  }}
                />
              </Field>

              <Field label="From">
                <Autocomplete
                  options={DESTINATIONS}
                  value={from}
                  disabled={formLocked}
                  onChange={(_, value) => setFrom(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select from"
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

              <Field label="To">
                <Autocomplete
                  options={DESTINATIONS}
                  value={to}
                  disabled={formLocked}
                  onChange={(_, value) => setTo(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select destination"
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
                Cancel trip
              </Button>
            ) : (
              <Button
                size="large"
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleCreateTrip}
              >
                Create trip
              </Button>
            )}
          </Stack>
        </Card>

        {layout && (
          <QuickSeatMap
            layout={layout}
            seats={seats}
            soldCount={soldCount}
            remainingCount={remainingCount}
            readOnly={!formLocked}
            onSelect={handleSeatClick}
            onRefresh={handleRefresh}
          />
        )}
      </Stack>

      <PurchaseDialog
        open={!!actionSeat && !holdOpen}
        seat={actionSeat}
        onClose={() => setActionSeatId(null)}
        onPurchase={handlePurchase}
        onHold={() => setHoldOpen(true)}
      />

      <HoldDialog
        open={holdOpen && !!actionSeat}
        seatId={actionSeat?.id ?? ''}
        onClose={() => setHoldOpen(false)}
        onHold={handleHold}
      />

      <Dialog open={cancelConfirmOpen} onClose={() => setCancelConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Cancel trip?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This will clear all fields and hide the seat layout. You can start a new trip after that.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => setCancelConfirmOpen(false)}
            startIcon={<Iconify icon="mingcute:close-line" />}
          >
            Keep trip
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancelTrip}
            startIcon={<Iconify icon="solar:close-circle-bold" />}
          >
            Cancel trip
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
  soldCount,
  remainingCount,
  readOnly,
  onSelect,
  onRefresh,
}: {
  layout: LayoutConfig;
  seats: QuickSeat[];
  soldCount: number;
  remainingCount: number;
  readOnly: boolean;
  onSelect: (seat: QuickSeat) => void;
  onRefresh: () => void;
}) {
  const decks = getLayoutDecks(layout);
  const multiDeck = decks.length > 1;

  return (
    <Card sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {layout.caption}
          </Typography>
          <Typography variant="h6">{layout.label}</Typography>
        </Box>

        <IconButton aria-label="Refresh" disabled={readOnly} onClick={onRefresh}>
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
          label="Sold"
          value={String(soldCount)}
        />
        <StatChip
          icon="solar:users-group-rounded-bold"
          color="success.main"
          label="Remaining"
          value={String(remainingCount)}
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }} justifyContent="center" flexWrap="wrap" useFlexGap>
        <Legend swatch="background.paper" label="Available" />
        <Legend swatch="action.hover" label="Booked" />
        <Legend swatch="warning.main" label="Held" />
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
              deck={deck}
              showLabel={multiDeck}
              seats={seats}
              readOnly={readOnly}
              onSelect={onSelect}
            />
          ))}
        </Stack>
      </Box>

      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary', fontWeight: 600 }}>
        {readOnly
          ? 'Preview only. Create the trip to book or hold seats.'
          : 'Hover a booked or held seat for details. Click an available seat to purchase or hold.'}
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
  );
}

function SeatButton({
  seat,
  readOnly,
  onSelect,
}: {
  seat: QuickSeat;
  readOnly?: boolean;
  onSelect: (seat: QuickSeat) => void;
}) {
  const booked = seat.status === 'booked';
  const held = seat.status === 'held';
  const locked = booked || !!readOnly;

  const button = (
    <Box
      component="button"
      type="button"
      aria-disabled={locked}
      onClick={() => {
        if (!locked) {
          onSelect(seat);
        }
      }}
      sx={{
        width: 48,
        height: 36,
        p: 0,
        borderRadius: 1,
        typography: 'caption',
        fontWeight: 700,
        cursor: locked || held ? 'default' : 'pointer',
        pointerEvents: readOnly ? 'none' : 'auto',
        border: (theme) =>
          `solid 1px ${held ? theme.palette.warning.main : theme.palette.divider}`,
        bgcolor: held ? 'warning.main' : booked ? 'action.hover' : 'background.paper',
        color: held ? 'warning.contrastText' : booked ? 'text.disabled' : 'text.primary',
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
  if (seat.status === 'booked') {
    return (
      <Stack spacing={1}>
        <Typography variant="subtitle2">Seat {seat.id}</Typography>
        <InfoRow icon="solar:user-rounded-bold" label="Booked by" value={seat.bookedBy || EMPTY} />
        <InfoRow
          icon="solar:clock-circle-bold"
          label="Time"
          value={seat.bookedAt ? fDateTime(seat.bookedAt) : EMPTY}
        />
        <InfoRow
          icon="solar:tag-price-bold"
          label="Price"
          value={`৳${seat.price.toLocaleString('en-BD')}`}
        />
        <InfoRow
          icon="solar:buildings-2-bold"
          label="Booking terminal"
          value={seat.bookingTerminal || EMPTY}
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Seat {seat.id}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar src={seat.holdByAvatar} alt={seat.holdBy} sx={{ width: 28, height: 28 }}>
          {seat.holdBy?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Held by
          </Typography>
          <Typography variant="body2" noWrap>
            {seat.holdBy || EMPTY}
          </Typography>
        </Box>
      </Stack>
      <InfoRow icon="solar:notes-bold" label="Hold note" value={seat.holdNote || EMPTY} />
    </Stack>
  );
}

function PurchaseDialog({
  open,
  seat,
  onClose,
  onPurchase,
  onHold,
}: {
  open: boolean;
  seat: QuickSeat | null;
  onClose: () => void;
  onPurchase: (price: number) => void;
  onHold: () => void;
}) {
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discount, setDiscount] = useState('');
  const [discountMode, setDiscountMode] = useState<DiscountMode>('percent');
  const seatPrice = seat?.price ?? 0;
  const totalPrice = discountEnabled
    ? discountTotal(seatPrice, discount, discountMode)
    : seatPrice;

  useEffect(() => {
    if (open) {
      setDiscountEnabled(false);
      setDiscount('');
      setDiscountMode('percent');
    }
  }, [open, seat?.id]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Confirm seat</DialogTitle>
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
              Seat
            </Typography>
            <Typography variant="h3" sx={{ my: 0.5 }}>
              {seat?.id}
            </Typography>
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
            label="Apply discount"
            sx={{ mx: 0, justifyContent: 'space-between', width: 1 }}
            labelPlacement="start"
          />

          {discountEnabled && (
            <>
              <TextField
                fullWidth
                type="number"
                label="Discount"
                placeholder="Enter percentage or amount"
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
                label="Total price"
                placeholder="Total price"
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
            Purchase this seat now, or hold it for a passenger.
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
          Cancel
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="warning"
          onClick={onHold}
          startIcon={<Iconify icon="solar:hourglass-bold" />}
          sx={{ fontWeight: 700 }}
        >
          Hold
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => onPurchase(totalPrice)}
          startIcon={<Iconify icon="solar:ticket-bold" />}
          sx={{ fontWeight: 700 }}
        >
          Purchase
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

function HoldDialog({
  open,
  seatId,
  onClose,
  onHold,
}: {
  open: boolean;
  seatId: string;
  onClose: () => void;
  onHold: (note: string) => void;
}) {
  const { user } = useMockedUser();
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setNote('');
    }
  }, [open]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Hold seat {seatId}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Held by"
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
            label="Held note"
            placeholder="Add a held note"
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
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ fontWeight: 700 }}
          startIcon={<Iconify icon="solar:hourglass-bold" />}
          onClick={() => onHold(note)}
        >
          Hold ticket
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

  return getLayoutDecks(layout).flatMap((deck) => {
    const columns = [...deck.left, ...deck.right];

    return columns.flatMap((column) =>
      Array.from({ length: deck.rows }, (_, index) => {
        const row = index + 1;
        const id = seatIdForDeck(deck, column, row);
        const seed = seedById.get(id);
        const leftSide = deck.left.includes(column);

        if (seed) {
          return {
            ...seed,
            bookingTerminal:
              seed.status === 'booked' ? seed.boarding || SEED_TICKET.origin || 'Counter desk' : undefined,
          };
        }

        return {
          id,
          row,
          column,
          side: leftSide ? 'Left' : 'Right',
          position: leftSide
            ? column === deck.left[0]
              ? 'Window'
              : 'Aisle'
            : column === deck.right[deck.right.length - 1]
              ? 'Window'
              : 'Aisle',
          status: 'available',
          price: SEED_TICKET.price || 850,
        } satisfies QuickSeat;
      })
    );
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
  deck,
  showLabel,
  seats,
  readOnly,
  onSelect,
}: {
  deck: DeckConfig;
  showLabel: boolean;
  seats: QuickSeat[];
  readOnly: boolean;
  onSelect: (seat: QuickSeat) => void;
}) {
  return (
    <Stack spacing={1}>
      {showLabel && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
          {deck.label}
        </Typography>
      )}

      {deck.id === 'lower' && (
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <EndCap icon={DRIVER_ICON} label="Driver" />
          <EndCap icon={DOOR_ICON} label="Door" />
        </Stack>
      )}

      <Stack spacing={1}>
        {Array.from({ length: deck.rows }, (_, index) => index + 1).map((row) => (
          <Stack key={row} direction="row" spacing={1} alignItems="center" justifyContent="center">
            {deck.left.map((column) => {
              const id = seatIdForDeck(deck, column, row);
              return (
                <SeatButton key={id} seat={seatAt(seats, id)} readOnly={readOnly} onSelect={onSelect} />
              );
            })}
            <Typography
              variant="caption"
              sx={{ width: 36, textAlign: 'center', color: 'text.disabled', fontWeight: 600 }}
            >
              {row === 1 ? 'Aisle' : ''}
            </Typography>
            {deck.right.map((column) => {
              const id = seatIdForDeck(deck, column, row);
              return (
                <SeatButton key={id} seat={seatAt(seats, id)} readOnly={readOnly} onSelect={onSelect} />
              );
            })}
          </Stack>
        ))}
      </Stack>
    </Stack>
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

function EndCap({ icon, label }: { icon: string; label: string }) {
  return (
    <Tooltip title={label} arrow placement="top">
      <Box
        aria-label={label}
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          bgcolor: 'action.hover',
        }}
      >
        <Iconify icon={icon} width={20} />
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
