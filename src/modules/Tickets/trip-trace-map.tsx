import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from '@/components/iconify';

import type { TicketItem } from '@/interfaces/ticket.interface';

// ----------------------------------------------------------------------

type Point = { x: number; y: number; label: string };

type TripTraceMapProps = {
  ticket: TicketItem;
  onBack: () => void;
  fullscreen?: boolean;
  onRequestFullscreen?: () => void;
  onCloseFullscreen?: () => void;
};

const VIEW_W = 360;
const VIEW_H = 420;

function buildRoutePoints(ticket: TicketItem): Point[] {
  const labels = [ticket.origin, ...ticket.stops, ticket.destination];
  const count = Math.max(labels.length, 2);

  return labels.map((label, index) => {
    const t = index / (count - 1);
    const wave = Math.sin(t * Math.PI) * 48;
    return {
      x: 48 + t * (VIEW_W - 96),
      y: 72 + t * (VIEW_H - 140) + (index % 2 === 0 ? -wave * 0.35 : wave * 0.35),
      label,
    };
  });
}

function polylineLength(points: Point[]) {
  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    length += Math.hypot(dx, dy);
  }
  return length;
}

function pointAlong(points: Point[], progress: number) {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }

  const total = polylineLength(points);
  let remaining = total * Math.min(Math.max(progress, 0), 1);

  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const segment = Math.hypot(b.x - a.x, b.y - a.y);
    if (remaining <= segment || i === points.length - 1) {
      const ratio = segment === 0 ? 0 : remaining / segment;
      return {
        x: a.x + (b.x - a.x) * ratio,
        y: a.y + (b.y - a.y) * ratio,
      };
    }
    remaining -= segment;
  }

  return points[points.length - 1];
}

// ----------------------------------------------------------------------

export default function TripTraceMap({
  ticket,
  onBack,
  fullscreen = false,
  onRequestFullscreen,
  onCloseFullscreen,
}: TripTraceMapProps) {
  const theme = useTheme();
  const { t } = useTranslation('index');
  const points = useMemo(() => buildRoutePoints(ticket), [ticket]);
  const [progress, setProgress] = useState(0.18);
  const bus = pointAlong(points, progress);
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.004;
        return next >= 0.92 ? 0.12 : next;
      });
    }, 80);

    return () => window.clearInterval(id);
  }, []);

  const road = theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.grey[500], 0.16);
  const water = theme.palette.mode === 'dark' ? alpha(theme.palette.info.main, 0.18) : alpha(theme.palette.info.main, 0.12);
  const park = theme.palette.mode === 'dark' ? alpha(theme.palette.success.main, 0.16) : alpha(theme.palette.success.main, 0.14);
  const route = theme.palette.info.main;
  const trail = alpha(theme.palette.info.main, 0.28);

  const mapBody = (
    <Box
      role="button"
      tabIndex={0}
      aria-label={fullscreen ? t('TRACE_MAP') : t('EXPAND_MAP')}
      onClick={() => {
        if (!fullscreen) {
          onRequestFullscreen?.();
        }
      }}
      onKeyDown={(event) => {
        if (!fullscreen && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onRequestFullscreen?.();
        }
      }}
      sx={{
        position: 'relative',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        cursor: fullscreen ? 'default' : 'pointer',
        bgcolor: (muiTheme) =>
          muiTheme.palette.mode === 'dark' ? alpha(muiTheme.palette.grey[800], 0.9) : alpha(muiTheme.palette.grey[200], 0.9),
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.info.main}`,
          outlineOffset: -2,
        },
      }}
    >
      <Box
        component="svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        sx={{ width: '100%', height: '100%', display: 'block' }}
      >
        <rect width={VIEW_W} height={VIEW_H} fill="transparent" />

        {/* Terrain blocks */}
        <rect x="18" y="28" width="110" height="78" rx="14" fill={park} />
        <rect x="210" y="40" width="120" height="64" rx="14" fill={water} />
        <rect x="40" y="250" width="96" height="70" rx="14" fill={water} />
        <rect x="220" y="280" width="110" height="78" rx="14" fill={park} />

        {/* Grid roads */}
        {[90, 150, 210, 270, 330].map((y) => (
          <line key={`h-${y}`} x1="0" y1={y} x2={VIEW_W} y2={y} stroke={road} strokeWidth="8" />
        ))}
        {[60, 140, 220, 300].map((x) => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2={VIEW_H} stroke={road} strokeWidth="8" />
        ))}

        {/* Route trail + active path */}
        <path d={pathD} fill="none" stroke={trail} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathD} fill="none" stroke={route} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 8" />

        {points.map((point, index) => {
          const isEnd = index === 0 || index === points.length - 1;
          return (
            <g key={`${point.label}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={isEnd ? 8 : 5}
                fill={index === 0 ? theme.palette.info.main : index === points.length - 1 ? theme.palette.error.main : theme.palette.warning.main}
                stroke={theme.palette.background.paper}
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y - 14}
                textAnchor="middle"
                fill={theme.palette.text.primary}
                fontSize="10"
                fontWeight="600"
              >
                {point.label.length > 14 ? `${point.label.slice(0, 12)}…` : point.label}
              </text>
            </g>
          );
        })}

        {/* Bus marker */}
        <g transform={`translate(${bus.x}, ${bus.y})`}>
          <circle r="18" fill={alpha(theme.palette.primary.main, 0.22)} />
          <circle r="11" fill={theme.palette.primary.main} stroke={theme.palette.background.paper} strokeWidth="2" />
          <rect x="-7" y="-3.5" width="14" height="7" rx="2" fill={theme.palette.primary.contrastText} />
          <circle cx="-4" cy="4.5" r="1.6" fill={theme.palette.primary.contrastText} />
          <circle cx="4" cy="4.5" r="1.6" fill={theme.palette.primary.contrastText} />
        </g>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute',
          left: 12,
          bottom: 12,
          px: 1.25,
          py: 0.75,
          borderRadius: 1.5,
          bgcolor: (muiTheme) => alpha(muiTheme.palette.background.paper, 0.92),
          boxShadow: (muiTheme) => muiTheme.shadows[4],
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'success.main',
            alignSelf: 'center',
            animation: 'tracePulse 1.2s ease-in-out infinite',
            '@keyframes tracePulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.45, transform: 'scale(0.85)' },
            },
          }}
        />
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
            {t('LIVE_TRACKING')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {t('DUMMY_GPS_HINT')}
          </Typography>
        </Box>
      </Stack>

      {!fullscreen && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: (muiTheme) => alpha(muiTheme.palette.background.paper, 0.92),
            color: 'text.secondary',
            typography: 'caption',
            fontWeight: 600,
            pointerEvents: 'none',
          }}
        >
          <Iconify icon="solar:full-screen-bold" width={14} />
          {t('EXPAND_MAP')}
        </Stack>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 1.25, flexShrink: 0 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <Iconify icon="solar:map-point-wave-bold" width={20} sx={{ color: 'info.main' }} />
          <Typography variant="subtitle1" noWrap>
            {t('LIVE_TRACE')}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          {fullscreen ? (
            <IconButton aria-label={t('CLOSE')} onClick={onCloseFullscreen} size="small">
              <Iconify icon="mingcute:close-line" width={18} />
            </IconButton>
          ) : (
            <Button
              size="small"
              color="inherit"
              variant="soft"
              onClick={(event) => {
                event.stopPropagation();
                onBack();
              }}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            >
              {t('STOPPAGES')}
            </Button>
          )}
        </Stack>
      </Stack>

      {mapBody}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function TripTraceFullscreen({
  open,
  ticket,
  onClose,
}: {
  open: boolean;
  ticket: TicketItem;
  onClose: () => void;
}) {
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <TripTraceMap ticket={ticket} onBack={onClose} fullscreen onCloseFullscreen={onClose} />
      </Box>
    </Dialog>
  );
}
