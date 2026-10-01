export type TicketFilterValue = string | string[] | Date | TicketOperator[] | null;

export type TicketFilters = {
  operators: TicketOperator[];
  destination: string[];
  services: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type TicketOperator = {
  id: string;
  name: string;
  avatarUrl: string;
  phoneNumber: string;
};

export type TicketPassenger = {
  id: string;
  name: string;
  avatarUrl: string;
  guests: number;
  phoneNumber: string;
};

export type TicketStatus = 'upcoming' | 'completed' | 'routing' | 'canceled' | 'active';

export type TicketSeatColumn = 'A' | 'B' | 'C' | 'D';

export type TicketSeat = {
  id: string;
  row: number;
  column: TicketSeatColumn;
  side: 'Left' | 'Right';
  position: 'Window' | 'Aisle';
  status: 'available' | 'booked' | 'held';
  price: number;
  bookedBy?: string;
  passenger?: string;
  passengerPhone?: string;
  boarding?: string;
  bookedAt?: Date;
  luggage?: number;
  note?: string;
  holdBy?: string;
  holdByAvatar?: string;
  holdNote?: string;
  heldAt?: Date;
};

export type TicketItem = {
  id: string;
  name: string;
  price: number;
  totalViews: number;
  images: string[];
  priceSale: number;
  services: string[];
  origin: string;
  destination: string;
  stops: string[];
  ratingNumber: number;
  bookers: TicketPassenger[];
  operators: TicketOperator[];
  status: TicketStatus;
  busModel: string;
  busNumber: string;
  vehicleId: string;
  driverName: string;
  driverAvatarUrl: string;
  seatCapacity: number;
  seats: TicketSeat[];
  createdAt: Date;
  available: {
    startDate: Date;
    endDate: Date;
  };
};
