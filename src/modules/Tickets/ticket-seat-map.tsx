import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ToggleButton from '@mui/material/ToggleButton';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { fDateTime } from '@/utils/format-time';

import { useMockedUser } from '@/hooks/use-mocked-user';

import Label from '@/components/label';
import Iconify from '@/components/iconify';

import type { TicketItem, TicketSeat, TicketSeatColumn } from './types';

// ----------------------------------------------------------------------

const EMPTY = '—';

type DiscountMode = 'percent' | 'amount';

type BuyForm = {
  passenger: string;
  phoneNumber: string;
  note: string;
  boarding: string;
  luggage: string;
  discount: string;
  discountMode: DiscountMode;
};

const EMPTY_BUY_FORM: BuyForm = {
  passenger: '',
  phoneNumber: '',
  note: '',
  boarding: '',
  luggage: '',
  discount: '',
  discountMode: 'percent',
};

type Props = {
  ticket: TicketItem;
};

export default function TicketSeatMap({ ticket }: Props) {
  const { t } = useTranslation('index');
  const [seats, setSeats] = useState(ticket.seats);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [buyOpen, setBuyOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);

  const selectedSeats = useMemo(
    () =>
      selectedIds
        .map((id) => seats.find((seat) => seat.id === id))
        .filter((seat): seat is TicketSeat => !!seat),
    [selectedIds, seats]
  );
  const selected = selectedSeats.length === 1 ? selectedSeats[0] : null;
  const multiAvailable =
    selectedSeats.length > 1 && selectedSeats.every((seat) => seat.status === 'available');
  const actionableSeats = multiAvailable
    ? selectedSeats
    : selected?.status === 'available'
      ? [selected]
      : [];
  const selectedTotal = actionableSeats.reduce((sum, seat) => sum + seat.price, 0);
  const boardingOptions = [ticket.origin, ...ticket.stops];

  const clearSelection = () => {
    setSelectedIds([]);
    setBuyOpen(false);
    setHoldOpen(false);
  };

  const handleSelect = (seat: TicketSeat) => {
    setBuyOpen(false);
    setHoldOpen(false);

    if (seat.status !== 'available') {
      setSelectedIds((current) => (current.length === 1 && current[0] === seat.id ? [] : [seat.id]));
      return;
    }

    setSelectedIds((current) => {
      const currentSeats = current
        .map((id) => seats.find((item) => item.id === id))
        .filter((item): item is TicketSeat => !!item);
      const onlyAvailable = currentSeats.every((item) => item.status === 'available');

      if (!onlyAvailable || !current.length) {
        return [seat.id];
      }

      return current.includes(seat.id) ? current.filter((id) => id !== seat.id) : [...current, seat.id];
    });
  };

  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        display: 'grid',
        gap: 3,
        alignItems: 'start',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 380px' },
      }}
    >
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {t('LOWER_DECK_2_2')}
            </Typography>
            <Typography variant="h6">{t('SEAT_LAYOUT')}</Typography>
          </Box>
          <Tooltip title={t('REFRESH')}>
            <IconButton aria-label={t('REFRESH')} onClick={clearSelection}>
              <Iconify icon="solar:restart-bold" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Legend swatch="background.paper" label={t('AVAILABLE')} />
          <Legend swatch="action.hover" label={t('BOOKED')} />
          <Legend swatch="warning.main" label={t('HELD')} />
          <Legend swatch="primary.main" label={t('SELECTED')} />
        </Stack>

        <Box
          sx={{
            maxWidth: 420,
            mx: 'auto',
            p: 2,
            borderRadius: 2,
            border: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <EndCap icon="mdi:steering" label={t('DRIVER')} />
            <EndCap icon="solar:login-3-linear" label={t('DOOR')} />
          </Stack>

          <Stack spacing={1}>
            {Array.from({ length: 10 }, (_, index) => index + 1).map((row) => (
              <Stack key={row} direction="row" spacing={1} alignItems="center" justifyContent="center">
                <SeatButton seat={seatAt(seats, 'A', row)} selectedIds={selectedIds} onSelect={handleSelect} />
                <SeatButton seat={seatAt(seats, 'B', row)} selectedIds={selectedIds} onSelect={handleSelect} />
                <Typography
                  variant="caption"
                  sx={{ width: 36, textAlign: 'center', color: 'text.disabled', fontWeight: 600 }}
                >
                  {row === 1 ? t('AISLE') : ''}
                </Typography>
                <SeatButton seat={seatAt(seats, 'C', row)} selectedIds={selectedIds} onSelect={handleSelect} />
                <SeatButton seat={seatAt(seats, 'D', row)} selectedIds={selectedIds} onSelect={handleSelect} />
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary', fontWeight: 600 }}>
          {t('SEAT_MAP_HINT')}
        </Typography>
      </Card>

      <Card sx={{ p: 3, position: { md: 'sticky' }, top: { md: 96 } }}>
        {multiAvailable ? (
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography variant="h6">
                {selectedSeats.length} {t('SEATS_SELECTED')}
              </Typography>
              <Label variant="soft" color="success">
                {t('AVAILABLE')}
              </Label>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {selectedSeats.map((seat) => (
                <Chip
                  key={seat.id}
                  size="small"
                  label={seat.id}
                  color="primary"
                  variant="outlined"
                  onDelete={() => handleSelect(seat)}
                />
              ))}
            </Stack>

            <SeatField label={t('TOTAL')} value={`৳${selectedTotal.toLocaleString('en-BD')}`} />
            <SeatField label={t('DEPARTURE')} value={ticket.origin} />
            <SeatField label={t('DESTINATION')} value={ticket.destination} />

            <Stack spacing={1.25} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                fullWidth
                startIcon={<Iconify icon="solar:ticket-bold" />}
                sx={{ fontWeight: 700 }}
                onClick={() => setBuyOpen(true)}
              >
                {t('BOOK')}
              </Button>
              <Button
                variant="contained"
                color="warning"
                size="large"
                fullWidth
                startIcon={<Iconify icon="solar:hourglass-bold" />}
                sx={{ fontWeight: 700 }}
                onClick={() => setHoldOpen(true)}
              >
                {t('HOLD_TICKET')}
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
              <Typography variant="h6">{selected ? `${t('SEAT')} ${selected.id}` : t('SEAT_DETAILS')}</Typography>
              {selected ? (
                <Label
                  variant="soft"
                  color={
                    selected.status === 'available' ? 'success' : selected.status === 'held' ? 'warning' : 'default'
                  }
                >
                  {selected.status === 'available' ? t('AVAILABLE') : selected.status === 'held' ? t('HELD') : t('BOOKED')}
                </Label>
              ) : (
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                  {t('SELECT_A_SEAT')}
                </Typography>
              )}
            </Stack>

            <Box
              display="grid"
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              columnGap={2}
              rowGap={1.75}
            >
              <SeatField
                label={t('PRICE')}
                value={selected ? `৳${selected.price.toLocaleString('en-BD')}` : undefined}
              />
              <SeatField label={t('ROW')} value={selected ? String(selected.row) : undefined} />
              <SeatField label={t('SIDE')} value={selected?.side} />
              <SeatField label={t('POSITION')} value={selected?.position} />
              <Divider sx={{ gridColumn: '1 / -1' }} />
              {selected?.status === 'held' ? (
                <>
                  <HoldByField name={selected.holdBy} avatarUrl={selected.holdByAvatar} />
                  <SeatField
                    label={t('HELD_ON')}
                    value={selected.heldAt ? fDateTime(selected.heldAt) : undefined}
                  />
                  <Divider sx={{ gridColumn: '1 / -1' }} />
                  <Box sx={{ gridColumn: '1 / -1', minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {t('HELD_NOTE')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 0.5, color: selected.holdNote ? 'text.primary' : 'text.disabled' }}
                    >
                      {selected.holdNote || EMPTY}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <PersonField label={t('BOOKED_BY')} name={selected?.bookedBy} />
                  <SeatField
                    label={t('BOOKING_TIME')}
                    value={selected?.bookedAt ? fDateTime(selected.bookedAt) : undefined}
                  />
                  <PersonField
                    label={t('PASSENGER')}
                    name={selected?.passenger}
                    phone={selected?.passengerPhone}
                  />
                  <SeatField label={t('LUGGAGE')} value={formatLuggage(selected?.luggage, t)} />
                  <Divider sx={{ gridColumn: '1 / -1' }} />
                  <SeatField label={t('BOARDING')} value={selected?.boarding} />
                  <Box />
                  {selected?.status === 'booked' && (
                    <>
                      <Divider sx={{ gridColumn: '1 / -1' }} />
                      <Box sx={{ gridColumn: '1 / -1', minWidth: 0 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {t('NOTE')}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.5, color: selected.note ? 'text.primary' : 'text.disabled' }}
                        >
                          {selected.note || EMPTY}
                        </Typography>
                      </Box>
                    </>
                  )}
                </>
              )}
              <SeatField label={t('DEPARTURE')} value={selected ? ticket.origin : undefined} />
              <SeatField label={t('DESTINATION')} value={selected ? ticket.destination : undefined} />
            </Box>
            {selected?.status === 'available' && (
              <Stack spacing={1.25} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  startIcon={<Iconify icon="solar:ticket-bold" />}
                  sx={{ fontWeight: 700 }}
                  onClick={() => setBuyOpen(true)}
                >
                  {t('BOOK')}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  fullWidth
                  startIcon={<Iconify icon="solar:hourglass-bold" />}
                  sx={{ fontWeight: 700 }}
                  onClick={() => setHoldOpen(true)}
                >
                  {t('HOLD_TICKET')}
                </Button>
              </Stack>
            )}
            {selected?.status === 'held' && (
              <Button variant="outlined" color="warning" size="large" fullWidth sx={{ mt: 3, fontWeight: 700 }}>
                {t('CANCEL_HOLD')}
              </Button>
            )}
            {selected?.status === 'booked' && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Iconify icon="solar:printer-bold" />}
                sx={{ mt: 3, fontWeight: 700 }}
              >
                {t('PRINT_TICKET')}
              </Button>
            )}
          </>
        )}
      </Card>

      <BuyTicketDialog
        open={buyOpen && actionableSeats.length > 0}
        seats={actionableSeats}
        boardingOptions={boardingOptions}
        onClose={() => setBuyOpen(false)}
        onBuy={(form) => {
          const luggage = form.luggage === '' ? undefined : Math.max(0, Number(form.luggage));
          const ids = new Set(actionableSeats.map((seat) => seat.id));
          const priced = applySeatDiscounts(actionableSeats, form.discount, form.discountMode);
          const priceById = new Map(priced.map((item) => [item.id, item.price]));

          setSeats((current) =>
            current.map((seat) => {
              if (!ids.has(seat.id)) {
                return seat;
              }

              return {
                ...seat,
                status: 'booked',
                passenger: form.passenger.trim() || undefined,
                passengerPhone: form.phoneNumber.trim() || undefined,
                note: form.note.trim() || undefined,
                boarding: form.boarding || undefined,
                luggage: luggage !== undefined && Number.isFinite(luggage) ? luggage : undefined,
                bookedAt: new Date(),
                price: priceById.get(seat.id) ?? seat.price,
                holdBy: undefined,
                holdByAvatar: undefined,
                holdNote: undefined,
                heldAt: undefined,
              };
            })
          );
          clearSelection();
        }}
      />

      <HoldTicketDialog
        open={holdOpen && actionableSeats.length > 0}
        seatIds={actionableSeats.map((seat) => seat.id)}
        onClose={() => setHoldOpen(false)}
        onHold={({ name, avatarUrl, note }) => {
          const ids = new Set(actionableSeats.map((seat) => seat.id));

          setSeats((current) =>
            current.map((seat) =>
              ids.has(seat.id)
                ? {
                    ...seat,
                    status: 'held',
                    holdBy: name,
                    holdByAvatar: avatarUrl,
                    holdNote: note.trim() || undefined,
                    heldAt: new Date(),
                  }
                : seat
            )
          );
          clearSelection();
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

function BuyTicketDialog({
  open,
  seats,
  boardingOptions,
  onClose,
  onBuy,
}: {
  open: boolean;
  seats: TicketSeat[];
  boardingOptions: string[];
  onClose: () => void;
  onBuy: (form: BuyForm) => void;
}) {
  const { t } = useTranslation('index');
  const [form, setForm] = useState(EMPTY_BUY_FORM);
  const seatIds = seats.map((seat) => seat.id);
  const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
  const total = applySeatDiscounts(seats, form.discount, form.discountMode).reduce(
    (sum, seat) => sum + seat.price,
    0
  );
  const title =
    seats.length > 1 ? t('BUY_SEATS', { count: seats.length }) : t('BUY_SEAT', { seat: seatIds[0] ?? '' });

  useEffect(() => {
    if (open) {
      setForm(EMPTY_BUY_FORM);
    }
  }, [open]);

  const setField = (field: keyof BuyForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {seats.length > 1 && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('SEATS')}: {seatIds.join(', ')} · {t('SUBTOTAL')} ৳{subtotal.toLocaleString('en-BD')}
            </Typography>
          )}
          <TextField
            fullWidth
            label={t('PASSENGER_NAME')}
            placeholder={t('ENTER_PASSENGER_NAME')}
            value={form.passenger}
            onChange={setField('passenger')}
            InputProps={fieldIcon('solar:user-rounded-bold')}
          />
          <TextField
            fullWidth
            label={t('PHONE_NUMBER')}
            placeholder={t('ENTER_PHONE_NUMBER')}
            value={form.phoneNumber}
            onChange={setField('phoneNumber')}
            InputProps={fieldIcon('solar:phone-bold')}
          />
          <TextField
            select
            fullWidth
            label={t('BOARDING')}
            value={form.boarding}
            onChange={setField('boarding')}
            InputProps={fieldIcon('solar:map-point-bold')}
            SelectProps={{
              displayEmpty: true,
              renderValue: (value) =>
                value ? (
                  String(value)
                ) : (
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    {t('SELECT_BOARDING')}
                  </Box>
                ),
            }}
          >
            {boardingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label={t('NUMBER_OF_LUGGAGE')}
            placeholder={t('ENTER_NUMBER_OF_BAGS')}
            value={form.luggage}
            onChange={setField('luggage')}
            inputProps={{ min: 0 }}
            InputProps={fieldIcon('solar:suitcase-bold')}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label={t('NOTE')}
            placeholder={t('ADD_A_NOTE')}
            value={form.note}
            onChange={setField('note')}
            InputProps={{
              ...fieldIcon('solar:notes-bold'),
              sx: { alignItems: 'flex-start', '& .MuiInputAdornment-root': { mt: 1.5 } },
            }}
          />
          <TextField
            fullWidth
            type="number"
            label={t('DISCOUNT')}
            placeholder={t('ENTER_PERCENTAGE_OR_AMOUNT')}
            value={form.discount}
            onChange={setField('discount')}
            inputProps={{ min: 0, max: form.discountMode === 'percent' ? 100 : undefined }}
            InputProps={{
              ...fieldIcon('solar:sale-bold'),
              endAdornment: (
                <InputAdornment position="end">
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={form.discountMode}
                    onChange={(_, mode: DiscountMode | null) => {
                      if (mode) {
                        setForm((current) => ({ ...current, discountMode: mode }));
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
            value={`৳${total.toLocaleString('en-BD')}`}
            InputProps={{ ...fieldIcon('solar:tag-price-bold'), readOnly: true }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('CANCEL')}
        </Button>
        <Button variant="contained" color="success" onClick={() => onBuy(form)} sx={{ fontWeight: 700 }}>
          {t('BUY')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function HoldTicketDialog({
  open,
  seatIds,
  onClose,
  onHold,
}: {
  open: boolean;
  seatIds: string[];
  onClose: () => void;
  onHold: (value: { name: string; avatarUrl: string; note: string }) => void;
}) {
  const { t } = useTranslation('index');
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
            value={user?.displayName ?? ''}
            placeholder={t('HELD_BY')}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 28, height: 28 }}>
                    {user?.displayName?.charAt(0).toUpperCase()}
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
              ...fieldIcon('solar:notes-bold'),
              sx: { alignItems: 'flex-start', '& .MuiInputAdornment-root': { mt: 1.5 } },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('CANCEL')}
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ fontWeight: 700 }}
          onClick={() => onHold({ name: user?.displayName ?? '', avatarUrl: user?.photoURL ?? '', note })}
        >
          {t('HOLD_TICKET')}
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

function applySeatDiscounts(seats: TicketSeat[], discount: string, mode: DiscountMode) {
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

function fieldIcon(icon: string) {
  return {
    startAdornment: (
      <InputAdornment position="start">
        <Iconify icon={icon} width={20} sx={{ color: 'text.disabled' }} />
      </InputAdornment>
    ),
  };
}

function seatAt(seats: TicketSeat[], column: TicketSeatColumn, row: number) {
  const seat = seats.find((item) => item.column === column && item.row === row);
  if (!seat) {
    throw new Error(`Missing seat ${column}${row}`);
  }
  return seat;
}

function formatLuggage(count?: number, t?: (key: string, options?: Record<string, unknown>) => string) {
  if (count === undefined) {
    return undefined;
  }
  if (t) {
    return count === 1 ? t('BAG_SINGLE') : t('BAG_PLURAL', { count });
  }
  return count === 1 ? '1 bag' : `${count} bags`;
}

function SeatButton({
  seat,
  selectedIds,
  onSelect,
}: {
  seat: TicketSeat;
  selectedIds: string[];
  onSelect: (seat: TicketSeat) => void;
}) {
  const selected = selectedIds.includes(seat.id);
  const booked = seat.status === 'booked';
  const held = seat.status === 'held';

  return (
    <Box
      component="button"
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(seat)}
      sx={{
        width: 48,
        height: 36,
        p: 0,
        borderRadius: 1,
        typography: 'caption',
        fontWeight: 700,
        cursor: 'pointer',
        border: (theme) =>
          `solid 1px ${
            selected ? theme.palette.primary.main : held ? theme.palette.warning.main : theme.palette.divider
          }`,
        bgcolor: selected && !held ? 'primary.main' : held ? 'warning.main' : booked ? 'action.hover' : 'background.paper',
        color: selected && !held ? 'primary.contrastText' : held ? 'warning.contrastText' : booked ? 'text.disabled' : 'text.primary',
      }}
    >
      {seat.id}
    </Box>
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

function HoldByField({ name, avatarUrl }: { name?: string; avatarUrl?: string }) {
  const { t } = useTranslation();

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {t('HELD_BY')}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
        <Avatar src={avatarUrl} alt={name} sx={{ width: 32, height: 32 }}>
          {name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle2" noWrap sx={{ color: name ? 'text.primary' : 'text.disabled' }}>
          {name || EMPTY}
        </Typography>
      </Stack>
    </Box>
  );
}

function PersonField({ label, name, phone }: { label: string; name?: string; phone?: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: name ? 'text.primary' : 'text.disabled' }}>
        {name || EMPTY}
      </Typography>
      {phone && (
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.5 }}>
          <Iconify icon="solar:phone-bold" width={16} sx={{ color: 'text.disabled', flexShrink: 0 }} />
          <Typography variant="body2">{phone}</Typography>
        </Stack>
      )}
    </Box>
  );
}

function SeatField({ label, value }: { label: string; value?: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: value ? 'text.primary' : 'text.disabled' }}>
        {value || EMPTY}
      </Typography>
    </Box>
  );
}
