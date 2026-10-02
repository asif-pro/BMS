import type { LayoutConfig } from '@/interfaces/seat-layout.interface';

export const DRIVER_ICON = 'mdi:steering';
export const DOOR_ICON = 'solar:login-3-linear';
export const ENGINE_ICON = 'mdi:engine';

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
