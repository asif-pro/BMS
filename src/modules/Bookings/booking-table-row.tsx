import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { fDate, fTime } from '@/utils/format-time';

import Label from '@/components/label';

import type { IBookingItem, IBookingTripStatus } from './types';

// ----------------------------------------------------------------------

const STATUS_COLOR: Record<
  IBookingTripStatus,
  'info' | 'success' | 'warning' | 'error' | 'default'
> = {
  taken: 'success',
  travelling: 'info',
  returned: 'warning',
  cancelled: 'error',
};

type Props = {
  row: IBookingItem;
};

function formatDiscount(discount: number, discountType: IBookingItem['discountType']) {
  if (!discount) {
    return '—';
  }

  if (discountType === 'percent') {
    return `${discount}%`;
  }

  return `৳${discount.toLocaleString('en-BD')}`;
}

export default function BookingTableRow({ row }: Props) {
  const { t } = useTranslation('index');

  const {
    tripId,
    route,
    busNumber,
    busModel,
    bookedBy,
    bookedByRole,
    bookedByAvatarUrl,
    passengerName,
    passengerPhone,
    tickets,
    seatNumbers,
    discount,
    discountType,
    originalPrice,
    price,
    bookedAt,
    tripStatus,
  } = row;

  const statusLabel: Record<IBookingTripStatus, string> = {
    taken: t('TAKEN'),
    cancelled: t('CANCELLED'),
    returned: t('RETURNED'),
    travelling: t('TRAVELLING'),
  };

  return (
    <TableRow hover>
      <TableCell>
        <ListItemText
          primary={
            <Link
              component={RouterLink}
              href={`${paths.dashboard.trips.root}/${tripId}`}
              color="inherit"
              underline="hover"
              sx={{ typography: 'body2' }}
            >
              {route}
            </Link>
          }
          secondary={`${busNumber} · ${busModel}`}
          primaryTypographyProps={{ component: 'div', noWrap: true }}
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
          <Avatar alt={bookedBy} src={bookedByAvatarUrl} sx={{ width: 36, height: 36 }} />
          <ListItemText
            primary={bookedBy}
            secondary={bookedByRole}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
              noWrap: true,
            }}
          />
        </Stack>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={passengerName}
          secondary={passengerPhone}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
            noWrap: true,
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Tooltip title={seatNumbers.join(', ')} arrow placement="top">
          <Box
            component="span"
            sx={{
              cursor: 'default',
              borderBottom: (theme) => `1px dashed ${theme.palette.text.disabled}`,
            }}
          >
            {tickets}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell
        sx={{
          whiteSpace: 'nowrap',
          color: discount ? 'warning.main' : 'text.secondary',
          fontWeight: discount ? 600 : 400,
        }}
      >
        {formatDiscount(discount, discountType)}
      </TableCell>

      <TableCell>
        {discount ? (
          <ListItemText
            primary={
              <Box
                component="span"
                sx={{
                  display: 'block',
                  typography: 'caption',
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                }}
              >
                ৳{originalPrice.toLocaleString('en-BD')}
              </Box>
            }
            secondary={`৳${price.toLocaleString('en-BD')}`}
            primaryTypographyProps={{ component: 'div' }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'body2',
              color: 'text.primary',
              fontWeight: 600,
            }}
          />
        ) : (
          <Box sx={{ typography: 'body2', fontWeight: 600, whiteSpace: 'nowrap' }}>
            ৳{price.toLocaleString('en-BD')}
          </Box>
        )}
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(bookedAt)}
          secondary={fTime(bookedAt, 'h:mm a')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <Label variant="soft" color={STATUS_COLOR[tripStatus]}>
          {statusLabel[tripStatus]}
        </Label>
      </TableCell>
    </TableRow>
  );
}
