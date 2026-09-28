import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from '@/routes/components';

import { fDate, fTime } from '@/utils/format-time';

import Image from '@/components/image';
import Iconify from '@/components/iconify';

import { ticketPaths } from './paths';
import type { TicketItem } from './types';

// ----------------------------------------------------------------------

type Props = {
  ticket: TicketItem;
};

export default function TicketItem({ ticket }: Props) {
  const { id, name, images, bookers, available, status, busNumber, driverName } = ticket;

  const renderImages = (
    <Stack
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 1),
      }}
    >
      <Image alt={name} src={images[0]} sx={{ borderRadius: 1, height: 164, width: 1 }} />
    </Stack>
  );

  const renderTexts = (
    <ListItemText
      sx={{
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary={`${busNumber} · ${driverName}`}
      secondary={
        <Link component={RouterLink} href={ticketPaths.details(id)} color="inherit">
          {name}
        </Link>
      }
      primaryTypographyProps={{
        typography: 'caption',
        color: 'text.disabled',
      }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: 'span',
        color: 'text.primary',
        typography: 'subtitle1',
      }}
    />
  );

  const renderSchedule = (icon: string, color: string, date: Date) => (
    <Stack spacing={1} direction="row" alignItems="flex-start" sx={{ minWidth: 0 }}>
      <Iconify icon={icon} sx={{ color, mt: 0.25, flexShrink: 0 }} />
      <Stack spacing={0.25}>
        <Stack component="span" sx={{ typography: 'body2' }}>
          {fDate(date)}
        </Stack>
        <Stack component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
          {fTime(date, 'h:mm a')}
        </Stack>
      </Stack>
    </Stack>
  );

  const renderInfo = (
    <Box
      sx={{
        p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5),
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: 2,
        rowGap: 1.5,
        alignItems: 'start',
      }}
    >
      {renderSchedule('solar:bus-bold', 'info.main', available.startDate)}
      {renderSchedule('solar:map-point-bold', 'success.main', available.endDate)}

      <Stack spacing={1} direction="row" alignItems="center" sx={{ typography: 'body2', minWidth: 0 }}>
        <Iconify icon="solar:users-group-rounded-bold" sx={{ color: 'primary.main', flexShrink: 0 }} />
        {bookers.length} Booked
      </Stack>

      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        sx={{ typography: 'body2', minWidth: 0, textTransform: 'capitalize' }}
      >
        <Iconify icon="solar:flag-bold" sx={{ color: 'warning.main', flexShrink: 0 }} />
        {status}
      </Stack>

      <Button
        component={RouterLink}
        href={ticketPaths.details(id)}
        variant="contained"
        size="small"
        sx={{ gridColumn: '1 / -1', justifySelf: 'end' }}
      >
        View
      </Button>
    </Box>
  );

  return (
    <Card>
      {renderImages}
      {renderTexts}
      {renderInfo}
    </Card>
  );
}
