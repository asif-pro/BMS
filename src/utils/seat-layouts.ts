import { SEAT_LAYOUTS } from '@/constants/seat-layout.constant';
import type {
  DeckConfig,
  LayoutConfig,
  LayoutSeatInfo,
  SeatIdFormat,
  TicketSeatColumn,
} from '@/interfaces/seat-layout.interface';

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const COLUMN_NUMBER: Record<TicketSeatColumn, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
};

export function getLayoutDecks(layout: LayoutConfig): DeckConfig[] {
  if (layout.decks?.length) {
    return layout.decks;
  }

  return [
    {
      id: 'lower',
      label: 'Lower deck',
      rows: layout.rows,
      left: layout.left,
      right: layout.right,
    },
  ];
}

export function getSeatIdFormat(layout: LayoutConfig): SeatIdFormat {
  return layout.seatIdFormat ?? 'column-row';
}

export function rowLetter(row: number) {
  return ROW_LETTERS[row - 1] ?? String(row);
}

export function seatIdForDeck(
  deck: DeckConfig,
  column: TicketSeatColumn,
  row: number,
  format: SeatIdFormat = 'column-row'
) {
  if (format === 'row-hyphen-col') {
    const base = `${rowLetter(row)}-${COLUMN_NUMBER[column]}`;
    return deck.id === 'upper' ? `U${base}` : base;
  }

  const base = `${column}${row}`;
  return deck.id === 'upper' ? `U${base}` : base;
}

export function aisleLabelForRow(layout: LayoutConfig, row: number) {
  if (layout.showAisleLabels === false) {
    return '';
  }

  if (getSeatIdFormat(layout) === 'row-hyphen-col') {
    return rowLetter(row);
  }

  return row === 1 ? 'Aisle' : '';
}

export function isSeatBlockedBySideBlock(
  layout: LayoutConfig,
  deck: DeckConfig,
  column: TicketSeatColumn,
  row: number
) {
  if (deck.id !== 'lower' || !layout.sideBlocks?.length) {
    return false;
  }

  const leftSide = deck.left.includes(column);

  return layout.sideBlocks.some((block) => {
    if (!block.rows.includes(row)) {
      return false;
    }

    return block.side === 'Left' ? leftSide : !leftSide;
  });
}

/** @deprecated use isSeatBlockedBySideBlock */
export const isSeatBlockedBySideDoor = isSeatBlockedBySideBlock;

export function getSideBlocks(layout: LayoutConfig, side: 'Left' | 'Right') {
  return (layout.sideBlocks ?? [])
    .filter((block) => block.side === side && block.rows.length)
    .map((block) => {
      const rows = [...block.rows].sort((a, b) => a - b);
      return {
        ...block,
        rows,
        startRow: rows[0],
        endRow: rows[rows.length - 1],
      };
    });
}

export function getSideBlockAtRow(layout: LayoutConfig, side: 'Left' | 'Right', row: number) {
  const block = getSideBlocks(layout, side).find((item) => item.startRow === row);
  return block ?? null;
}

/** @deprecated use getSideBlocks / getSideBlockAtRow */
export function getSideDoorBlock(layout: LayoutConfig, side: 'Left' | 'Right') {
  const door = getSideBlocks(layout, side).find((block) => block.kind === 'door');
  return door ?? null;
}

export function layoutSeatSummary(layout: LayoutConfig) {
  const decks = getLayoutDecks(layout);
  const format = getSeatIdFormat(layout);

  if (format === 'row-hyphen-col') {
    const last = rowLetter(layout.rows);
    return `Rows A–${last} · 1 2 | 3 4 · mid door`;
  }

  if (decks.length > 1) {
    const deckParts = decks.map((deck) => `${deck.label.split(' ')[0]} ${deck.rows}`).join(' + ');
    return `${deckParts} rows · ${layout.left.join(' ')} | ${layout.right.join(' ')}`;
  }

  return `${layout.rows} rows · ${layout.left.join(' ')} | ${layout.right.join(' ')}`;
}

export function layoutSeatCount(layout: LayoutConfig) {
  return buildLayoutSeats(layout).length;
}

export function findSeatLayout(slug: string | undefined) {
  if (!slug) {
    return null;
  }

  return SEAT_LAYOUTS.find((layout) => layout.slug === slug) ?? null;
}

function seatPosition(
  deck: DeckConfig,
  column: TicketSeatColumn
): { side: 'Left' | 'Right'; position: 'Window' | 'Aisle' } {
  const leftSide = deck.left.includes(column);

  return {
    side: leftSide ? 'Left' : 'Right',
    position: leftSide
      ? column === deck.left[0]
        ? 'Window'
        : 'Aisle'
      : column === deck.right[deck.right.length - 1]
        ? 'Window'
        : 'Aisle',
  };
}

export function buildLayoutSeats(layout: LayoutConfig): LayoutSeatInfo[] {
  const format = getSeatIdFormat(layout);
  const decks = getLayoutDecks(layout);
  const lower = decks.find((deck) => deck.id === 'lower') ?? decks[0];

  const frontSeats =
    layout.frontSeats?.map((front) => {
      const { side, position } = seatPosition(lower, front.column);

      return {
        id: front.id,
        row: 0,
        column: front.column,
        deckId: lower.id,
        deckLabel: lower.label,
        side: front.side ?? side,
        position,
        defaultPrice: 1350,
      } satisfies LayoutSeatInfo;
    }) ?? [];

  const deckSeats = decks.flatMap((deck) => {
    const columns = [...deck.left, ...deck.right];

    return columns.flatMap((column) =>
      Array.from({ length: deck.rows }, (_, index) => {
        const row = index + 1;
        if (isSeatBlockedBySideBlock(layout, deck, column, row)) {
          return null;
        }

        const { side, position } = seatPosition(deck, column);

        return {
          id: seatIdForDeck(deck, column, row, format),
          row,
          column,
          deckId: deck.id,
          deckLabel: deck.label,
          side,
          position,
          defaultPrice: position === 'Window' ? 1350 : 1200,
        } satisfies LayoutSeatInfo;
      }).filter((seat): seat is LayoutSeatInfo => !!seat)
    );
  });

  return [...frontSeats, ...deckSeats];
}
