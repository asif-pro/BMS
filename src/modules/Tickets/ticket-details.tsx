import { forwardRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { paths } from '@/routes/paths';

import { fDate, fDateTime, fTime } from '@/utils/format-time';

import Label from '@/components/label';
import Image from '@/components/image';
import Iconify from '@/components/iconify';
import EmptyContent from '@/components/empty-content';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { RouterLink } from '@/routes/components';

import { ticketPaths } from './paths';
import { _tickets } from './_mock';
import TicketSeatMap from './ticket-seat-map';
import TripTraceMap, { TripTraceFullscreen } from './trip-trace-map';
import type { TicketItem, TicketStatus } from './types';
import { getVehicleById } from '@/modules/Vehicles/_mock';

// ----------------------------------------------------------------------

const STATUS_COLOR: Record<TicketStatus, 'info' | 'success' | 'warning' | 'error' | 'default'> = {
  upcoming: 'info',
  active: 'success',
  routing: 'warning',
  canceled: 'error',
  completed: 'default',
};

const STOPPAGES_MAX_HEIGHT = 520;

const STOP_DOT_COLORS = ['success.main', 'info.main', 'warning.main', 'error.main', 'primary.main'];

function legKilometers(ticketId: string, legIndex: number) {
  const seed = Number(ticketId.replace(/\D/g, '')) || 1;
  return (((seed * 17 + (legIndex + 1) * 53) % 1400) + 120) / 10;
}

function formatKilometers(value: number) {
  return `${(Math.round(value * 10) / 10).toFixed(1)} KM`;
}

const AMENITIES: { key: string; service: string; icon: string }[] = [
  { key: 'AMENITY_WIFI', service: 'Wi-Fi', icon: 'solar:wi-fi-bold' },
  { key: 'AMENITY_AC', service: 'Air conditioned', icon: 'solar:snowflake-bold' },
  { key: 'AMENITY_FOOD', service: 'Snacks', icon: 'solar:chef-hat-bold' },
  { key: 'AMENITY_TOILET', service: 'Onboard toilet', icon: 'ph:toilet-bold' },
  { key: 'AMENITY_EXTRA_LUGGAGE', service: 'Extra luggage', icon: 'solar:suitcase-bold' },
];

// ----------------------------------------------------------------------

export default function TicketDetails() {
  const { t } = useTranslation('index');
  const { id } = useParams();
  const ticket = _tickets.find((item) => item.id === id);
  const { ref, height } = useElementHeight<HTMLDivElement>();

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_TRIPS', href: ticketPaths.root },
          { name: ticket?.name ?? t('TICKET_DETAILS') },
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
        <EmptyContent title="NO_DATA" filled sx={{ py: 10 }} />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

const DetailsCard = forwardRef<HTMLDivElement, { ticket: TicketItem }>(function DetailsCard({ ticket }, ref) {
  const { t } = useTranslation('index');
  const ticketsBooked = ticket.bookers.length;
  const ticketsRemaining = Math.max(ticket.seatCapacity - ticketsBooked, 0);
  const totalEarnings = ticket.seats
    .filter((seat) => seat.status === 'booked')
    .reduce((sum, seat) => sum + seat.price, 0);

  const statusLabel: Record<TicketStatus, string> = {
    upcoming: t('UPCOMING'),
    active: t('ACTIVE'),
    routing: t('ROUTING'),
    canceled: t('CANCELLED'),
    completed: t('COMPLETED'),
  };

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
              {t('ROUTE')}
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
          {statusLabel[ticket.status]}
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
              {t('DRIVER')}
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ flexShrink: 0 }}>
          <Tooltip
            arrow
            placement="top-end"
            enterDelay={200}
            leaveDelay={100}
            title={
              <Box sx={{ p: 0.5, width: 220 }}>
                <Image
                  alt={ticket.busModel}
                  src={getVehicleById(ticket.vehicleId)?.coverUrl || ticket.images[0]}
                  ratio="16/10"
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            }
            componentsProps={{
              tooltip: {
                sx: {
                  p: 0,
                  bgcolor: 'background.paper',
                  boxShadow: (theme: any) => theme.customShadows.dropdown,
                  maxWidth: 'none',
                },
              },
              arrow: {
                sx: {
                  color: 'background.paper',
                },
              },
            }}
          >
            <Box component="span" sx={{ display: 'inline-flex' }}>
              <DetailItem
                icon="solar:bus-bold"
                color="info.main"
                label={ticket.busModel}
                value={ticket.busNumber}
                align="right"
                href={paths.dashboard.vehicles.details(ticket.vehicleId)}
              />
            </Box>
          </Tooltip>
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
          label={t('DEPARTURE')}
          value={fDate(ticket.available.startDate)}
          sub={fTime(ticket.available.startDate, 'h:mm a')}
        />
        <DetailItem
          icon="solar:clock-circle-bold"
          color="success.main"
          label={t('ARRIVAL')}
          value={fDate(ticket.available.endDate)}
          sub={fTime(ticket.available.endDate, 'h:mm a')}
        />
        <DetailItem icon="solar:map-point-bold" color="info.main" label={t('FROM')} value={ticket.origin} />
        <DetailItem
          icon="mingcute:location-fill"
          color="error.main"
          label={t('DESTINATION')}
          value={ticket.destination}
        />
        <DetailItem
          icon="solar:users-group-rounded-bold"
          color="primary.main"
          label={t('TICKETS_BOOKED')}
          value={String(ticketsBooked)}
        />
        <DetailItem
          icon="solar:ticket-bold"
          color="warning.main"
          label={t('TICKETS_REMAINING')}
          value={String(ticketsRemaining)}
        />
        <DetailItem
          icon="solar:wad-of-money-bold"
          color="success.main"
          label={t('TOTAL_EARNINGS')}
          value={`৳${totalEarnings.toLocaleString('en-BD')}`}
        />
      </Box>

      <TripAmenities services={ticket.services} />
    </Card>
  );
});

// ----------------------------------------------------------------------

function TripAmenities({ services }: { services: string[] }) {
  const { t } = useTranslation('index');

  return (
    <Stack
      component="ul"
      direction="row"
      spacing={1}
      aria-label={t('ON_BOARD')}
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
        const label = t(amenity.key);
        const title = available ? label : `${label} ${t('UNAVAILABLE')}`;

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
  href,
}: {
  icon: string;
  color: string;
  label: string;
  value: string;
  sub?: string;
  align?: 'left' | 'right';
  href?: string;
}) {
  const content = (
    <>
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
    </>
  );

  if (href) {
    return (
      <Stack
        component={RouterLink}
        href={href}
        direction="row"
        spacing={1.25}
        alignItems="flex-start"
        sx={{
          minWidth: 0,
          color: 'inherit',
          textDecoration: 'none',
          cursor: 'pointer',
          borderRadius: 1,
          transition: (theme) => theme.transitions.create(['color', 'opacity']),
          '&:hover': {
            color: 'primary.main',
            '& .MuiTypography-caption': { color: 'primary.main' },
          },
        }}
      >
        {content}
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
      {content}
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
  const { t } = useTranslation('index');
  const [flipped, setFlipped] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false);

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
  const legs = stops.slice(0, -1).map((_, index) => legKilometers(ticket.id, index));
  const totalKilometers = legs.reduce((sum, kilometers) => sum + kilometers, 0);

  return (
    <>
      <Box
        sx={{
          perspective: 1400,
          maxHeight: STOPPAGES_MAX_HEIGHT,
          height: { xs: 420, md: height ?? 420 },
          minHeight: { md: height },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <Card
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{ px: 3, pt: 3, pb: 1 }}
            >
              <Typography variant="h6">{t('STOPPAGES')}</Typography>

              <Button
                size="small"
                variant="soft"
                color="info"
                onClick={() => setFlipped(true)}
                startIcon={<Iconify icon="solar:map-point-wave-bold" width={16} />}
              >
                {t('TRACE')}
              </Button>
            </Stack>

            <Box sx={{ px: 3, pt: 1, overflow: 'auto', flex: 1, minHeight: 0 }}>
              {stops.map((stop, index) => (
                <StopRow
                  key={stop.key}
                  stop={stop}
                  last={index === stops.length - 1}
                  distance={index < legs.length ? formatKilometers(legs[index]) : undefined}
                />
              ))}
            </Box>

            <Stack
              direction="row"
              alignItems="baseline"
              justifyContent="space-between"
              sx={{
                mx: 3,
                mt: 2,
                pt: 1.75,
                pb: 2.5,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {t('TOTAL')}
              </Typography>
              <Typography variant="subtitle2">{formatKilometers(totalKilometers)}</Typography>
            </Stack>
          </Card>

          <Card
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {flipped && (
              <TripTraceMap
                ticket={ticket}
                onBack={() => setFlipped(false)}
                onRequestFullscreen={() => setMapFullscreen(true)}
              />
            )}
          </Card>
        </Box>
      </Box>

      <TripTraceFullscreen
        open={mapFullscreen}
        ticket={ticket}
        onClose={() => setMapFullscreen(false)}
      />
    </>
  );
}

function StopRow({
  stop,
  last,
  distance,
}: {
  stop: StopEntry;
  last: boolean;
  distance?: string;
}) {
  return (
    <Stack direction="row" spacing={2} alignItems="stretch">
      <Box sx={{ width: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <StopMarker stop={stop} />
        {!last && <Box sx={{ width: 2, flexGrow: 1, bgcolor: 'divider', minHeight: 16, my: 0.75 }} />}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle2">{stop.name}</Typography>
        {stop.time && (
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {stop.time}
          </Typography>
        )}
        {distance && (
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: 1.75, mb: 2.25 }}
          >
            {distance}
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
