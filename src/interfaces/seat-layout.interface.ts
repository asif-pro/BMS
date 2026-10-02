export type TicketSeatColumn = 'A' | 'B' | 'C' | 'D';

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
