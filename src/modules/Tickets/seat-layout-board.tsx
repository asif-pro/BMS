import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Iconify from '@/components/iconify';

import {
  aisleLabelForRow,
  DOOR_ICON,
  DRIVER_ICON,
  ENGINE_ICON,
  getLayoutDecks,
  getSeatIdFormat,
  getSideBlockAtRow,
  isSeatBlockedBySideBlock,
  seatIdForDeck,
  type DeckConfig,
  type LayoutConfig,
  type SideBlockKind,
} from './seat-layouts';
import type { TicketSeatColumn } from './types';

// ----------------------------------------------------------------------

type Props = {
  layout: LayoutConfig;
  interactive?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
};

export default function SeatLayoutBoard({
  layout,
  interactive = false,
  selectedId = null,
  onSelect,
}: Props) {
  const decks = getLayoutDecks(layout);
  const multiDeck = decks.length > 1;

  return (
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
          <DeckBoard
            key={deck.id}
            layout={layout}
            deck={deck}
            showEndCaps={deck.id === 'lower'}
            showLabel={multiDeck}
            interactive={interactive}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </Stack>
    </Box>
  );
}

function DeckBoard({
  layout,
  deck,
  showEndCaps,
  showLabel,
  interactive,
  selectedId,
  onSelect,
}: {
  layout: LayoutConfig;
  deck: DeckConfig;
  showEndCaps: boolean;
  showLabel: boolean;
  interactive: boolean;
  selectedId: string | null;
  onSelect?: (id: string | null) => void;
}) {
  const format = getSeatIdFormat(layout);
  const endCapOrder = layout.endCapOrder ?? 'driver-door';
  const frontSeats = showEndCaps ? layout.frontSeats ?? [] : [];
  const leftFront = frontSeats.filter((seat) => seat.side === 'Left');
  const rightFront = frontSeats.filter((seat) => seat.side === 'Right');
  const leftWidth = Math.max(deck.left.length, 1) * 48 + Math.max(deck.left.length - 1, 0) * 8;
  const rightWidth = Math.max(deck.right.length, 1) * 48 + Math.max(deck.right.length - 1, 0) * 8;
  const hasSideBlocks = showEndCaps && !!layout.sideBlocks?.length;
  const skippedRows = new Set<number>();

  return (
    <Stack spacing={1}>
      {showLabel && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
          {deck.label}
        </Typography>
      )}

      {showEndCaps && layout.showEngine && (
        <Stack alignItems="center" spacing={0.25} sx={{ mb: 0.5 }}>
          <Iconify icon={ENGINE_ICON} width={22} sx={{ color: 'error.main' }} />
          <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 800, letterSpacing: 1 }}>
            ENGINE
          </Typography>
        </Stack>
      )}

      {showEndCaps && endCapOrder === 'driver-only' && !hasSideBlocks && (
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 0.5 }}>
          <Box sx={{ width: leftWidth }} />
          <Box sx={{ width: 36 }} />
          <Box sx={{ width: rightWidth, display: 'flex', justifyContent: 'flex-end' }}>
            <EndCap icon={DRIVER_ICON} label="Driver" size={48} iconSize={32} />
          </Box>
        </Stack>
      )}

      {showEndCaps && endCapOrder !== 'driver-only' && !hasSideBlocks && (
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          {endCapOrder === 'door-driver' ? (
            <>
              <EndCap icon={DOOR_ICON} label="Door" />
              <EndCap icon={DRIVER_ICON} label="Driver" />
            </>
          ) : (
            <>
              <EndCap icon={DRIVER_ICON} label="Driver" />
              <EndCap icon={DOOR_ICON} label="Door" />
            </>
          )}
        </Stack>
      )}

      {!!frontSeats.length && (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Box
            sx={{
              width: leftWidth,
              display: 'flex',
              justifyContent: leftFront.length ? 'flex-start' : 'center',
              gap: 1,
            }}
          >
            {leftFront.map((seat) => (
              <SeatCell
                key={seat.id}
                id={seat.id}
                interactive={interactive}
                selected={seat.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </Box>
          <Box sx={{ width: 36 }} />
          <Box
            sx={{
              width: rightWidth,
              display: 'flex',
              justifyContent: rightFront.length ? 'flex-end' : 'center',
              gap: 1,
            }}
          >
            {rightFront.map((seat) => (
              <SeatCell
                key={seat.id}
                id={seat.id}
                interactive={interactive}
                selected={seat.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </Box>
        </Stack>
      )}

      <Stack spacing={1}>
        {Array.from({ length: deck.rows }, (_, index) => index + 1).map((row) => {
          if (skippedRows.has(row)) {
            return null;
          }

          const leftStart = showEndCaps ? getSideBlockAtRow(layout, 'Left', row) : null;
          const rightStart = showEndCaps ? getSideBlockAtRow(layout, 'Right', row) : null;

          if (leftStart || rightStart) {
            const spanRows = [
              ...new Set([...(leftStart?.rows ?? [row]), ...(rightStart?.rows ?? [row])]),
            ].sort((a, b) => a - b);

            spanRows.forEach((spanRow) => {
              if (spanRow !== row) {
                skippedRows.add(spanRow);
              }
            });

            return (
              <Stack key={`block-${row}`} direction="row" spacing={1} alignItems="stretch" justifyContent="center">
                {leftStart ? (
                  <SideFeatureBlock kind={leftStart.kind} rows={leftStart.rows.length} width={leftWidth} />
                ) : (
                  <SeatColumnStack
                    columns={deck.left}
                    rows={spanRows}
                    deck={deck}
                    layout={layout}
                    format={format}
                    interactive={interactive}
                    selectedId={selectedId}
                    onSelect={onSelect}
                  />
                )}

                <Stack spacing={1} justifyContent="center">
                  {spanRows.map((spanRow) => (
                    <Typography
                      key={`aisle-${spanRow}`}
                      variant="caption"
                      sx={{
                        width: 36,
                        height: 36,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.disabled',
                        fontWeight: 700,
                      }}
                    >
                      {aisleLabelForRow(layout, spanRow)}
                    </Typography>
                  ))}
                </Stack>

                {rightStart ? (
                  <SideFeatureBlock kind={rightStart.kind} rows={rightStart.rows.length} width={rightWidth} />
                ) : (
                  <SeatColumnStack
                    columns={deck.right}
                    rows={spanRows}
                    deck={deck}
                    layout={layout}
                    format={format}
                    interactive={interactive}
                    selectedId={selectedId}
                    onSelect={onSelect}
                  />
                )}
              </Stack>
            );
          }

          return (
            <Stack key={row} direction="row" spacing={1} alignItems="center" justifyContent="center">
              {deck.left.map((column) => {
                const id = seatIdForDeck(deck, column, row, format);
                return (
                  <SeatCell
                    key={id}
                    id={id}
                    interactive={interactive}
                    selected={id === selectedId}
                    onSelect={onSelect}
                  />
                );
              })}
              <Typography
                variant="caption"
                sx={{
                  width: 36,
                  textAlign: 'center',
                  color: 'text.disabled',
                  fontWeight: 700,
                }}
              >
                {aisleLabelForRow(layout, row)}
              </Typography>
              {deck.right.map((column: TicketSeatColumn) => {
                const id = seatIdForDeck(deck, column, row, format);
                return (
                  <SeatCell
                    key={id}
                    id={id}
                    interactive={interactive}
                    selected={id === selectedId}
                    onSelect={onSelect}
                  />
                );
              })}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

function SeatColumnStack({
  columns,
  rows,
  deck,
  layout,
  format,
  interactive,
  selectedId,
  onSelect,
}: {
  columns: TicketSeatColumn[];
  rows: number[];
  deck: DeckConfig;
  layout: LayoutConfig;
  format: ReturnType<typeof getSeatIdFormat>;
  interactive: boolean;
  selectedId: string | null;
  onSelect?: (id: string | null) => void;
}) {
  return (
    <Stack spacing={1}>
      {rows.map((row) => (
        <Stack key={row} direction="row" spacing={1}>
          {columns.map((column) => {
            if (isSeatBlockedBySideBlock(layout, deck, column, row)) {
              return null;
            }
            const id = seatIdForDeck(deck, column, row, format);
            return (
              <SeatCell
                key={id}
                id={id}
                interactive={interactive}
                selected={id === selectedId}
                onSelect={onSelect}
              />
            );
          })}
        </Stack>
      ))}
    </Stack>
  );
}

function SideFeatureBlock({
  kind,
  rows,
  width,
}: {
  kind: SideBlockKind;
  rows: number;
  width: number;
}) {
  const height = rows * 36 + Math.max(rows - 1, 0) * 8;
  const isDoor = kind === 'door';

  return (
    <Tooltip title={isDoor ? 'Door' : 'Driver'} arrow placement="left">
      <Box
        aria-label={isDoor ? 'Door' : 'Driver'}
        sx={{
          width,
          height,
          borderRadius: 1,
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          color: isDoor ? 'primary.dark' : 'text.secondary',
          bgcolor: isDoor ? 'primary.lighter' : 'action.hover',
          border: (theme) =>
            `solid 1px ${isDoor ? theme.palette.primary.main : theme.palette.divider}`,
        }}
      >
        <Iconify icon={isDoor ? DOOR_ICON : DRIVER_ICON} width={isDoor ? 26 : 32} />
        {isDoor && (
          <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 0.6 }}>
            DOOR
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}

function SeatCell({
  id,
  interactive,
  selected,
  onSelect,
}: {
  id: string;
  interactive: boolean;
  selected: boolean;
  onSelect?: (id: string | null) => void;
}) {
  return (
    <Box
      component={interactive ? 'button' : 'div'}
      type={interactive ? 'button' : undefined}
      aria-pressed={interactive ? selected : undefined}
      onClick={
        interactive
          ? () => {
              onSelect?.(selected ? null : id);
            }
          : undefined
      }
      sx={{
        minWidth: 48,
        width: id.includes('-') ? 52 : 48,
        height: 36,
        px: 0.25,
        borderRadius: 1,
        typography: 'caption',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'pointer' : 'default',
        border: (theme) =>
          `solid 1px ${selected ? theme.palette.primary.main : theme.palette.divider}`,
        bgcolor: selected ? 'primary.main' : 'background.paper',
        color: selected ? 'primary.contrastText' : 'text.primary',
      }}
    >
      {id}
    </Box>
  );
}

function EndCap({
  icon,
  label,
  size = 36,
  iconSize = 20,
}: {
  icon: string;
  label: string;
  size?: number;
  iconSize?: number;
}) {
  return (
    <Tooltip title={label} arrow placement="top">
      <Box
        aria-label={label}
        sx={{
          width: size,
          height: size,
          borderRadius: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          bgcolor: 'action.hover',
        }}
      >
        <Iconify icon={icon} width={iconSize} />
      </Box>
    </Tooltip>
  );
}
