import type { TicketSeatColumn } from './types';

// ----------------------------------------------------------------------

export type LayoutId = '2+2' | '2+1' | '1+1' | '2+2-deluxe' | 'double-decker' | '2+2-classic';

export type DeckId = 'lower' | 'upper';

export type SeatIdFormat = 'column-row' | 'row-hyphen-col';

export type EndCapOrder = 'driver-door' | 'door-driver' | 'driver-only';

export type FrontSeatConfig = {
  id: string;
  side: 'Left' | 'Right';
  column: TicketSeatColumn;
};

export type SideBlockKind = 'door' | 'driver';

export type SideBlockConfig = {
  side: 'Left' | 'Right';
  rows: number[];
  kind: SideBlockKind;
};

export type DeckConfig = {
  id: DeckId;
  label: string;
  rows: number;
  left: TicketSeatColumn[];
  right: TicketSeatColumn[];
};

export type LayoutConfig = {
  id: LayoutId;
  slug: string;
  label: string;
  caption: string;
  rows: number;
  left: TicketSeatColumn[];
  right: TicketSeatColumn[];
  coverUrl: string;
  decks?: DeckConfig[];
  seatIdFormat?: SeatIdFormat;
  endCapOrder?: EndCapOrder;
  showEngine?: boolean;
  showAisleLabels?: boolean;
  frontSeats?: FrontSeatConfig[];
  sideBlocks?: SideBlockConfig[];
};

export const DRIVER_ICON = 'mdi:steering';
export const DOOR_ICON = 'solar:login-3-linear';
export const ENGINE_ICON = 'mdi:engine';

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const COLUMN_NUMBER: Record<TicketSeatColumn, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
};

export const SEAT_LAYOUTS: LayoutConfig[] = [
  {
    id: '2+2',
    slug: 'l-220',
    label: '2 + 2 Coach',
    caption: 'Lower deck · 2 + 2',
    rows: 10,
    left: ['A', 'B'],
    right: ['C', 'D'],
    coverUrl: '/assets/images/buses/highway-coach.jpg',
  },
  {
    id: '2+2-classic',
    slug: 'l-241',
    label: '2 + 2 Classic',
    caption: 'Classic · Mid door · A–J',
    rows: 10,
    left: ['A', 'B'],
    right: ['C', 'D'],
    coverUrl: '/assets/images/buses/highway-coach.jpg',
    seatIdFormat: 'row-hyphen-col',
    showAisleLabels: false,
    sideBlocks: [
      { side: 'Right', rows: [1], kind: 'driver' },
      { side: 'Left', rows: [6, 7], kind: 'door' },
    ],
  },
  {
    id: '2+1',
    slug: 'l-321',
    label: '2 + 1 Executive',
    caption: 'Lower deck · 2 + 1',
    rows: 12,
    left: ['A', 'B'],
    right: ['C'],
    coverUrl: '/assets/images/buses/ac-coach.jpg',
  },
  {
    id: '1+1',
    slug: 'l-111',
    label: '1 + 1 Sleeper',
    caption: 'Sleeper · 1 + 1',
    rows: 14,
    left: ['A'],
    right: ['B'],
    coverUrl: '/assets/images/buses/sleeper.jpg',
  },
  {
    id: '2+2-deluxe',
    slug: 'l-228',
    label: '2 + 2 Deluxe',
    caption: 'Deluxe · 2 + 2 · 8 rows',
    rows: 8,
    left: ['A', 'B'],
    right: ['C', 'D'],
    coverUrl: '/assets/images/buses/night-bus.jpg',
  },
  {
    id: 'double-decker',
    slug: 'l-326',
    label: 'Double Decker',
    caption: 'Upper + Lower · 2 + 2',
    rows: 16,
    left: ['A', 'B'],
    right: ['C', 'D'],
    coverUrl: '/assets/images/buses/double-decker.jpg',
    decks: [
      {
        id: 'lower',
        label: 'Lower deck',
        rows: 6,
        left: ['A', 'B'],
        right: ['C', 'D'],
      },
      {
        id: 'upper',
        label: 'Upper deck',
        rows: 10,
        left: ['A', 'B'],
        right: ['C', 'D'],
      },
    ],
  },
];

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

export type LayoutSeatInfo = {
  id: string;
  row: number;
  column: TicketSeatColumn;
  deckId: DeckId;
  deckLabel: string;
  side: 'Left' | 'Right';
  position: 'Window' | 'Aisle';
  defaultPrice: number;
};

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
