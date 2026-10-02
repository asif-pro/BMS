export type ICustomerTableFilterValue = string;

export type ICustomerTableFilters = {
  name: string;
};

export type ICustomerItem = {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
  ticketsPurchased: number;
};

export type ICustomerTripStatus = 'completed' | 'upcoming' | 'canceled';

export type ICustomerTripHistoryItem = {
  id: string;
  customerId: string;
  route: string;
  origin: string;
  destination: string;
  busNumber: string;
  seat: string;
  price: number;
  status: ICustomerTripStatus;
  traveledAt: Date;
};
