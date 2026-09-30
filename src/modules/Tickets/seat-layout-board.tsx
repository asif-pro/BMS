import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Iconify from '@/components/iconify';

import {
  DOOR_ICON,
  DRIVER_ICON,
  getLayoutDecks,
  seatIdForDeck,
  type DeckConfig,
  type LayoutConfig,
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
  deck,
  showEndCaps,
  showLabel,
  interactive,
  selectedId,
  onSelect,
}: {
  deck: DeckConfig;
  showEndCaps: boolean;
  showLabel: boolean;
  interactive: boolean;
  selectedId: string | null;
  onSelect?: (id: string | null) => void;
}) {
  return (
    <Stack spacing={1}>
      {showLabel && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
          {deck.label}
        </Typography>
      )}

      {showEndCaps && (
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <EndCap icon={DRIVER_ICON} label="Driver" />
          <EndCap icon={DOOR_ICON} label="Door" />
        </Stack>
      )}

      <Stack spacing={1}>
        {Array.from({ length: deck.rows }, (_, index) => index + 1).map((row) => (
          <Stack key={row} direction="row" spacing={1} alignItems="center" justifyContent="center">
            {deck.left.map((column) => {
              const id = seatIdForDeck(deck, column, row);
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
              sx={{ width: 36, textAlign: 'center', color: 'text.disabled', fontWeight: 600 }}
            >
              {row === 1 ? 'Aisle' : ''}
            </Typography>
            {deck.right.map((column: TicketSeatColumn) => {
              const id = seatIdForDeck(deck, column, row);
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
    </Stack>
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
        width: 48,
        height: 36,
        p: 0,
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
