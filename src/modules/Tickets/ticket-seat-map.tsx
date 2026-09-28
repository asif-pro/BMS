import { useEffect, useState, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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
  const [seats, setSeats] = useState(ticket.seats);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const selected = seats.find((seat) => seat.id === selectedId);
  const boardingOptions = [ticket.origin, ...ticket.stops];

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
              Lower deck · 2 + 2
            </Typography>
            <Typography variant="h6">Seat layout</Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton aria-label="Refresh" onClick={() => setSelectedId(null)}>
              <Iconify icon="solar:restart-bold" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Legend swatch="background.paper" label="Available" />
          <Legend swatch="action.hover" label="Booked" />
          <Legend swatch="warning.main" label="Held" />
          <Legend swatch="primary.main" label="Selected" />
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
            <EndCap label="Driver" />
            <EndCap label="Door" />
          </Stack>

          <Stack spacing={1}>
            {Array.from({ length: 10 }, (_, index) => index + 1).map((row) => (
              <Stack key={row} direction="row" spacing={1} alignItems="center" justifyContent="center">
                <SeatButton seat={seatAt(seats, 'A', row)} selectedId={selectedId} onSelect={setSelectedId} />
                <SeatButton seat={seatAt(seats, 'B', row)} selectedId={selectedId} onSelect={setSelectedId} />
                <Typography
                  variant="caption"
                  sx={{ width: 36, textAlign: 'center', color: 'text.disabled', fontWeight: 600 }}
                >
                  {row === 1 ? 'Aisle' : ''}
                </Typography>
                <SeatButton seat={seatAt(seats, 'C', row)} selectedId={selectedId} onSelect={setSelectedId} />
                <SeatButton seat={seatAt(seats, 'D', row)} selectedId={selectedId} onSelect={setSelectedId} />
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary', fontWeight: 600 }}>
          A and D are windows. B and C are aisle seats. Rows count from the front.
        </Typography>
      </Card>

      <Card sx={{ p: 3, position: { md: 'sticky' }, top: { md: 96 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h6">{selected ? `Seat ${selected.id}` : 'Seat details'}</Typography>
          {selected ? (
            <Label
              variant="soft"
              color={selected.status === 'available' ? 'success' : selected.status === 'held' ? 'warning' : 'default'}
            >
              {selected.status === 'available' ? 'Available' : selected.status === 'held' ? 'Held' : 'Booked'}
            </Label>
          ) : (
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
              Select a seat
            </Typography>
          )}
        </Stack>

        <Box
          display="grid"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          columnGap={2}
          rowGap={1.75}
        >
          <SeatField label="Price" value={selected ? `৳${selected.price.toLocaleString('en-BD')}` : undefined} />
          <SeatField label="Row" value={selected ? String(selected.row) : undefined} />
          <SeatField label="Side" value={selected?.side} />
          <SeatField label="Position" value={selected?.position} />
          <Divider sx={{ gridColumn: '1 / -1' }} />
          {selected?.status === 'held' ? (
            <>
              <HoldByField name={selected.holdBy} avatarUrl={selected.holdByAvatar} />
              <SeatField label="Held on" value={selected.heldAt ? fDateTime(selected.heldAt) : undefined} />
              <Divider sx={{ gridColumn: '1 / -1' }} />
              <Box sx={{ gridColumn: '1 / -1', minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Held note
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: selected.holdNote ? 'text.primary' : 'text.disabled' }}>
                  {selected.holdNote || EMPTY}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <PersonField label="Booked by" name={selected?.bookedBy} />
              <SeatField label="Booking time" value={selected?.bookedAt ? fDateTime(selected.bookedAt) : undefined} />
              <PersonField label="Passenger" name={selected?.passenger} phone={selected?.passengerPhone} />
              <SeatField label="Luggage" value={formatLuggage(selected?.luggage)} />
              <Divider sx={{ gridColumn: '1 / -1' }} />
              <SeatField label="Boarding" value={selected?.boarding} />
              <Box />
              {selected?.status === 'booked' && (
                <>
                  <Divider sx={{ gridColumn: '1 / -1' }} />
                  <Box sx={{ gridColumn: '1 / -1', minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Note
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: selected.note ? 'text.primary' : 'text.disabled' }}>
                      {selected.note || EMPTY}
                    </Typography>
                  </Box>
                </>
              )}
            </>
          )}
          <SeatField label="Departure" value={selected ? ticket.origin : undefined} />
          <SeatField label="Destination" value={selected ? ticket.destination : undefined} />
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
              Book
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
              Hold ticket
            </Button>
          </Stack>
        )}
        {selected?.status === 'held' && (
          <Button variant="outlined" color="warning" size="large" fullWidth sx={{ mt: 3, fontWeight: 700 }}>
            Cancel hold
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
            Print Ticket
          </Button>
        )}
      </Card>

      <BuyTicketDialog
        open={buyOpen}
        seatId={selected?.id ?? ''}
        price={selected?.price ?? 0}
        boardingOptions={boardingOptions}
        onClose={() => setBuyOpen(false)}
        onBuy={(form) => {
          const luggage = form.luggage === '' ? undefined : Math.max(0, Number(form.luggage));

          setSeats((current) =>
            current.map((seat) =>
              seat.id === selectedId
                ? {
                    ...seat,
                    status: 'booked',
                    passenger: form.passenger.trim() || undefined,
                    passengerPhone: form.phoneNumber.trim() || undefined,
                    note: form.note.trim() || undefined,
                    boarding: form.boarding || undefined,
                    luggage: luggage !== undefined && Number.isFinite(luggage) ? luggage : undefined,
                    bookedAt: new Date(),
                    price: discountTotal(seat.price, form.discount, form.discountMode),
                  }
                : seat
            )
          );
          setBuyOpen(false);
        }}
      />

      <HoldTicketDialog
        open={holdOpen}
        seatId={selected?.id ?? ''}
        onClose={() => setHoldOpen(false)}
        onHold={({ name, avatarUrl, note }) => {
          setSeats((current) =>
            current.map((seat) =>
              seat.id === selectedId
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
          setHoldOpen(false);
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

function BuyTicketDialog({
  open,
  seatId,
  price,
  boardingOptions,
  onClose,
  onBuy,
}: {
  open: boolean;
  seatId: string;
  price: number;
  boardingOptions: string[];
  onClose: () => void;
  onBuy: (form: BuyForm) => void;
}) {
  const [form, setForm] = useState(EMPTY_BUY_FORM);

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
      <DialogTitle>Buy seat {seatId}</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Passenger name"
            placeholder="Enter passenger name"
            value={form.passenger}
            onChange={setField('passenger')}
            InputProps={fieldIcon('solar:user-rounded-bold')}
          />
          <TextField
            fullWidth
            label="Phone number"
            placeholder="Enter phone number"
            value={form.phoneNumber}
            onChange={setField('phoneNumber')}
            InputProps={fieldIcon('solar:phone-bold')}
          />
          <TextField
            select
            fullWidth
            label="Boarding"
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
                    Select boarding
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
            label="Number of luggage"
            placeholder="Enter number of bags"
            value={form.luggage}
            onChange={setField('luggage')}
            inputProps={{ min: 0 }}
            InputProps={fieldIcon('solar:suitcase-bold')}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Note"
            placeholder="Add a note"
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
            label="Discount"
            placeholder="Enter percentage or amount"
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
            label="Total price"
            placeholder="Total price"
            value={`৳${discountTotal(price, form.discount, form.discountMode).toLocaleString('en-BD')}`}
            InputProps={{ ...fieldIcon('solar:tag-price-bold'), readOnly: true }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="success" onClick={() => onBuy(form)} sx={{ fontWeight: 700 }}>
          Buy
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function HoldTicketDialog({
  open,
  seatId,
  onClose,
  onHold,
}: {
  open: boolean;
  seatId: string;
  onClose: () => void;
  onHold: (value: { name: string; avatarUrl: string; note: string }) => void;
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
            value={user?.displayName ?? ''}
            placeholder="Held by"
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
            label="Held note"
            placeholder="Add a held note"
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
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ fontWeight: 700 }}
          onClick={() => onHold({ name: user?.displayName ?? '', avatarUrl: user?.photoURL ?? '', note })}
        >
          Hold ticket
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

function formatLuggage(count?: number) {
  if (count === undefined) {
    return undefined;
  }
  return count === 1 ? '1 bag' : `${count} bags`;
}

function SeatButton({
  seat,
  selectedId,
  onSelect,
}: {
  seat: TicketSeat;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const selected = seat.id === selectedId;
  const booked = seat.status === 'booked';
  const held = seat.status === 'held';

  return (
    <Box
      component="button"
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(selected ? null : seat.id)}
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

function EndCap({ label }: { label: string }) {
  return (
    <Typography
      variant="caption"
      sx={{
        px: 1.25,
        py: 0.75,
        borderRadius: 1,
        fontWeight: 700,
        color: 'text.secondary',
        bgcolor: 'action.hover',
      }}
    >
      {label}
    </Typography>
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
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        Held by
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
