import type { TicketSeatColumn } from './types';

// ----------------------------------------------------------------------

export type LayoutId = '2+2' | '2+1' | '1+1' | '2+2-deluxe' | 'double-decker';

export type DeckId = 'lower' | 'upper';

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
};

export const DRIVER_ICON = 'mdi:steering';
export const DOOR_ICON = 'solar:login-3-linear';

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

export function seatIdForDeck(deck: DeckConfig, column: TicketSeatColumn, row: number) {
  const base = `${column}${row}`;
  return deck.id === 'upper' ? `U${base}` : base;
}

export function layoutSeatSummary(layout: LayoutConfig) {
  const decks = getLayoutDecks(layout);

  if (decks.length > 1) {
    const deckParts = decks.map((deck) => `${deck.label.split(' ')[0]} ${deck.rows}`).join(' + ');
    return `${deckParts} rows · ${layout.left.join(' ')} | ${layout.right.join(' ')}`;
  }

  return `${layout.rows} rows · ${layout.left.join(' ')} | ${layout.right.join(' ')}`;
}

export function layoutSeatCount(layout: LayoutConfig) {
  return getLayoutDecks(layout).reduce(
    (total, deck) => total + deck.rows * (deck.left.length + deck.right.length),
    0
  );
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

export function buildLayoutSeats(layout: LayoutConfig): LayoutSeatInfo[] {
  return getLayoutDecks(layout).flatMap((deck) => {
    const columns = [...deck.left, ...deck.right];

    return columns.flatMap((column) =>
      Array.from({ length: deck.rows }, (_, index) => {
        const row = index + 1;
        const leftSide = deck.left.includes(column);
        const position = leftSide
          ? column === deck.left[0]
            ? 'Window'
            : 'Aisle'
          : column === deck.right[deck.right.length - 1]
            ? 'Window'
            : 'Aisle';

        return {
          id: seatIdForDeck(deck, column, row),
          row,
          column,
          deckId: deck.id,
          deckLabel: deck.label,
          side: leftSide ? 'Left' : 'Right',
          position,
          defaultPrice: position === 'Window' ? 1350 : 1200,
        } satisfies LayoutSeatInfo;
      })
    );
  });
}
