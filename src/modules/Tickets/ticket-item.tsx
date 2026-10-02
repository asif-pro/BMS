import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';

import { RouterLink } from '@/routes/components';

import { fDate, fTime } from '@/utils/format-time';

import Image from '@/components/image';
import Iconify from '@/components/iconify';

import { ticketPaths } from './paths';
import type { TicketItem } from '@/interfaces/ticket.interface';

// ----------------------------------------------------------------------

type Props = {
  ticket: TicketItem;
};

function ticketDistance(id: string) {
  const index = Number(id.replace(/\D/g, '')) || 1;
  const kilometers = ((((index * 37) % 220) + 35) / 10).toFixed(1);

  return `${kilometers} KM`;
}

export default function TicketItem({ ticket }: Props) {
  const { t } = useTranslation('index');
  const { id, name, images, bookers, available, status, busNumber, driverName, seatCapacity } = ticket;

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
      primary={
        <Stack
          component="span"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Box component="span" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {busNumber} · {driverName}
          </Box>
          <Box component="span" sx={{ flexShrink: 0, color: 'text.secondary', fontWeight: 700 }}>
            {ticketDistance(id)}
          </Box>
        </Stack>
      }
      secondary={name}
      primaryTypographyProps={{
        typography: 'caption',
        color: 'text.disabled',
        component: 'div',
        width: 1,
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
        <Iconify icon="solar:ticket-bold" sx={{ color: 'primary.main', flexShrink: 0 }} />
        {bookers.length}/{seatCapacity}
      </Stack>

      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        sx={{ typography: 'body2', minWidth: 0, textTransform: 'capitalize' }}
      >
        <Iconify icon="solar:flag-bold" sx={{ color: 'warning.main', flexShrink: 0 }} />
        {status === 'active' ? t('ACTIVE') : status === 'routing' ? t('ROUTING') : status === 'upcoming' ? t('UPCOMING') : status === 'canceled' ? t('CANCELLED') : status === 'completed' ? t('COMPLETED') : status}
      </Stack>
    </Box>
  );

  return (
    <Link
      component={RouterLink}
      href={ticketPaths.details(id)}
      underline="none"
      color="inherit"
      sx={{ display: 'block', height: 1 }}
    >
      <Card
        sx={{
          height: 1,
          cursor: 'pointer',
          transition: (theme) => theme.transitions.create('box-shadow'),
          '&:hover': {
            boxShadow: (theme) => theme.shadows[8],
          },
        }}
      >
        {renderImages}
        {renderTexts}
        {renderInfo}
      </Card>
    </Link>
  );
}
