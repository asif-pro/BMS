import { useTranslation } from 'react-i18next';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from '@/utils/format-time';

import Label from '@/components/label';

import { TICKET_STATUS_COLOR } from '@/constants/ticket.constant';
import type { TicketItem, TicketStatus } from '@/interfaces/ticket.interface';

// ----------------------------------------------------------------------

type Props = {
  row: TicketItem;
  onViewRow: VoidFunction;
};

export default function TicketTableRow({ row, onViewRow }: Props) {
  const { t } = useTranslation('index');

  const {
    name,
    busNumber,
    busModel,
    driverName,
    driverAvatarUrl,
    available,
    bookers,
    seatCapacity,
    status,
  } = row;

  const statusLabel: Record<TicketStatus, string> = {
    upcoming: t('UPCOMING'),
    active: t('ACTIVE'),
    routing: t('ROUTING'),
    canceled: t('CANCELLED'),
    completed: t('COMPLETED'),
  };

  const totalEarnings = row.seats
    .filter((seat) => seat.status === 'booked')
    .reduce((sum, seat) => sum + seat.price, 0);

  return (
    <TableRow
      hover
      onClick={onViewRow}
      sx={{
        cursor: 'pointer',
        '& td': { cursor: 'pointer' },
      }}
    >
      <TableCell>
        <ListItemText
          primary={name}
          secondary={`${busNumber} · ${busModel}`}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
            noWrap: true,
          }}
        />
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar alt={driverName} src={driverAvatarUrl} sx={{ width: 36, height: 36 }} />
          <ListItemText
            primary={driverName}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </Stack>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(available.startDate)}
          secondary={fTime(available.startDate, 'h:mm a')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(available.endDate)}
          secondary={fTime(available.endDate, 'h:mm a')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {bookers.length}/{seatCapacity}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', color: 'success.main', fontWeight: 600 }}>
        ৳{totalEarnings.toLocaleString('en-BD')}
      </TableCell>

      <TableCell>
        <Label variant="soft" color={TICKET_STATUS_COLOR[status]}>
          {statusLabel[status]}
        </Label>
      </TableCell>
    </TableRow>
  );
}
