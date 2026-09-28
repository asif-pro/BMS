import { forwardRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { paths } from '@/routes/paths';

import { fDate, fDateTime, fTime } from '@/utils/format-time';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import EmptyContent from '@/components/empty-content';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import { ticketPaths } from './paths';
import { _tickets } from './_mock';
import TicketSeatMap from './ticket-seat-map';
import type { TicketItem, TicketStatus } from './types';

// ----------------------------------------------------------------------

const STATUS_LABEL: Record<TicketStatus, string> = {
  upcoming: 'Upcoming',
  active: 'Active',
  routing: 'Routing',
  canceled: 'Cancelled',
  completed: 'Completed',
};

const STATUS_COLOR: Record<TicketStatus, 'info' | 'success' | 'warning' | 'error' | 'default'> = {
  upcoming: 'info',
  active: 'success',
  routing: 'warning',
  canceled: 'error',
  completed: 'default',
};

const STOPPAGES_MAX_HEIGHT = 520;

const STOP_DOT_COLORS = ['success.main', 'info.main', 'warning.main', 'error.main', 'primary.main'];

const AMENITIES: { label: string; service: string; icon: string }[] = [
  { label: 'Wi-Fi', service: 'Wi-Fi', icon: 'solar:wi-fi-bold' },
  { label: 'AC', service: 'Air conditioned', icon: 'solar:snowflake-bold' },
  { label: 'Food', service: 'Snacks', icon: 'solar:chef-hat-bold' },
  { label: 'Toilet', service: 'Onboard toilet', icon: 'ph:toilet-bold' },
  { label: 'Extra luggage', service: 'Extra luggage', icon: 'solar:suitcase-bold' },
];

// ----------------------------------------------------------------------

export default function TicketDetails() {
  const { id } = useParams();
  const ticket = _tickets.find((item) => item.id === id);
  const { ref, height } = useElementHeight<HTMLDivElement>();

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Trips', href: ticketPaths.root },
          { name: ticket?.name ?? 'Ticket details' },
        ]}
        sx={{ mb: 3 }}
      />

      {ticket ? (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 380px' },
          }}
        >
          <DetailsCard ref={ref} ticket={ticket} />
          <StoppagesCard ticket={ticket} matchHeight={height} />
          <TicketSeatMap key={ticket.id} ticket={ticket} />
        </Box>
      ) : (
        <EmptyContent title="No Data" filled sx={{ py: 10 }} />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

const DetailsCard = forwardRef<HTMLDivElement, { ticket: TicketItem }>(function DetailsCard({ ticket }, ref) {
  const ticketsBooked = ticket.bookers.length;
  const ticketsRemaining = Math.max(ticket.seatCapacity - ticketsBooked, 0);

  return (
    <Card ref={ref} sx={{ p: 3 }}>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
        sx={{
          pb: 2.5,
          mb: 2.5,
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
          <Iconify icon="solar:routing-2-bold" width={22} sx={{ color: 'info.main', mt: 0.25 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Route
            </Typography>
            <Typography variant="h6" noWrap>
              {ticket.name}
            </Typography>
          </Box>
        </Stack>

        <Label
          variant="soft"
          color={STATUS_COLOR[ticket.status]}
          startIcon={<Iconify icon="solar:flag-bold" />}
        >
          {STATUS_LABEL[ticket.status]}
        </Label>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
          <Avatar alt={ticket.driverName} src={ticket.driverAvatarUrl} sx={{ width: 48, height: 48 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>
              {ticket.driverName}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ mt: 0.25, color: 'text.disabled', typography: 'caption', fontWeight: 600 }}
            >
              <Iconify icon="solar:user-rounded-bold" width={16} />
              Driver
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ flexShrink: 0 }}>
          <DetailItem
            icon="solar:bus-bold"
            color="info.main"
            label={ticket.busModel}
            value={ticket.busNumber}
            align="right"
          />
        </Box>
      </Stack>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
        gap={2.75}
      >
        <DetailItem
          icon="solar:clock-circle-bold"
          color="info.main"
          label="Departure"
          value={fDate(ticket.available.startDate)}
          sub={fTime(ticket.available.startDate, 'h:mm a')}
        />
        <DetailItem
          icon="solar:clock-circle-bold"
          color="success.main"
          label="Arrival"
          value={fDate(ticket.available.endDate)}
          sub={fTime(ticket.available.endDate, 'h:mm a')}
        />
        <DetailItem icon="solar:map-point-bold" color="info.main" label="From" value={ticket.origin} />
        <DetailItem
          icon="mingcute:location-fill"
          color="error.main"
          label="Destination"
          value={ticket.destination}
        />
        <DetailItem
          icon="solar:users-group-rounded-bold"
          color="primary.main"
          label="Tickets booked"
          value={String(ticketsBooked)}
        />
        <DetailItem
          icon="solar:ticket-bold"
          color="warning.main"
          label="Tickets remaining"
          value={String(ticketsRemaining)}
        />
      </Box>

      <TripAmenities services={ticket.services} />
    </Card>
  );
});

// ----------------------------------------------------------------------

function TripAmenities({ services }: { services: string[] }) {
  return (
    <Stack
      component="ul"
      direction="row"
      spacing={1}
      aria-label="On board"
      sx={{
        listStyle: 'none',
        p: 0,
        m: 0,
        mt: 2.75,
        pt: 2.5,
        flexWrap: 'wrap',
        borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
      }}
    >
      {AMENITIES.map((amenity) => {
        const available = services.includes(amenity.service);
        const title = available ? amenity.label : `${amenity.label} unavailable`;

        return (
          <Box component="li" key={amenity.service} sx={{ display: 'flex' }}>
            <Tooltip title={title} arrow>
              <IconButton
                aria-label={title}
                sx={{
                  position: 'relative',
                  width: 40,
                  height: 40,
                  color: (theme) => {
                    if (!available) {
                      return theme.palette.text.disabled;
                    }

                    return theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark;
                  },
                  bgcolor: (theme) =>
                    available
                      ? alpha(theme.palette.info.main, 0.16)
                      : alpha(theme.palette.grey[500], 0.16),
                  '&:hover': {
                    bgcolor: (theme) =>
                      available
                        ? alpha(theme.palette.info.main, 0.24)
                        : alpha(theme.palette.grey[500], 0.24),
                  },
                  ...(!available && {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: 22,
                      height: '1.5px',
                      borderRadius: 1,
                      bgcolor: 'currentColor',
                      transform: 'translate(-50%, -50%) rotate(-45deg)',
                    },
                  }),
                }}
              >
                <Iconify icon={amenity.icon} width={20} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      })}
    </Stack>
  );
}

function DetailItem({
  icon,
  color,
  label,
  value,
  sub,
  align = 'left',
}: {
  icon: string;
  color: string;
  label: string;
  value: string;
  sub?: string;
  align?: 'left' | 'right';
}) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
      <Iconify icon={icon} width={20} sx={{ color, mt: 0.25, flexShrink: 0 }} />
      <Box sx={{ minWidth: 0, textAlign: align }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="subtitle2">{value}</Typography>
        {sub && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {sub}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type StopEntry = {
  key: string;
  name: string;
  kind: 'from' | 'stop' | 'destination';
  time?: string;
  color: string;
};

function StoppagesCard({ ticket, matchHeight }: { ticket: TicketItem; matchHeight?: number }) {
  const stops: StopEntry[] = [
    {
      key: 'from',
      name: ticket.origin,
      kind: 'from',
      time: fDateTime(ticket.available.startDate),
      color: 'info.main',
    },
    ...ticket.stops.map((name, index) => ({
      key: `stop-${name}`,
      name,
      kind: 'stop' as const,
      color: STOP_DOT_COLORS[index % STOP_DOT_COLORS.length],
    })),
    {
      key: 'destination',
      name: ticket.destination,
      kind: 'destination',
      time: fDateTime(ticket.available.endDate),
      color: 'error.main',
    },
  ];

  const height = matchHeight ? Math.min(matchHeight, STOPPAGES_MAX_HEIGHT) : undefined;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        maxHeight: STOPPAGES_MAX_HEIGHT,
        height: { md: height },
      }}
    >
      <Typography variant="h6" sx={{ px: 3, pt: 3, pb: 1 }}>
        Stoppages
      </Typography>

      <Box sx={{ px: 3, pt: 1, pb: 3, overflow: 'auto', flex: 1, minHeight: 0 }}>
        {stops.map((stop, index) => (
          <StopRow key={stop.key} stop={stop} last={index === stops.length - 1} />
        ))}
      </Box>
    </Card>
  );
}

function StopRow({ stop, last }: { stop: StopEntry; last: boolean }) {
  return (
    <Stack direction="row" spacing={2}>
      <Box sx={{ width: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <StopMarker stop={stop} />
        {!last && <Box sx={{ width: 2, flexGrow: 1, bgcolor: 'divider', minHeight: 28, my: 0.5 }} />}
      </Box>

      <Box sx={{ pb: last ? 0 : 2.5, minWidth: 0 }}>
        <Typography variant="subtitle2">{stop.name}</Typography>
        {stop.time && (
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {stop.time}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function StopMarker({ stop }: { stop: StopEntry }) {
  if (stop.kind === 'stop') {
    return <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stop.color, my: '4px' }} />;
  }

  return (
    <Iconify
      icon={stop.kind === 'from' ? 'solar:map-point-bold' : 'mingcute:location-fill'}
      width={20}
      sx={{ color: stop.color }}
    />
  );
}

function useElementHeight<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    if (!node) {
      return undefined;
    }

    const update = () => setHeight(node.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, [node]);

  return { ref: setNode, height };
}
