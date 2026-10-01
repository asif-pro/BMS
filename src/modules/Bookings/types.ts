// ----------------------------------------------------------------------

export type IBookingTableFilterValue = string;

export type IBookingTableFilters = {
  name: string;
};

export type IBookingDiscountType = 'amount' | 'percent';

export type IBookingTripStatus = 'taken' | 'cancelled' | 'returned' | 'travelling';

export type IBookingItem = {
  id: string;
  tripId: string;
  route: string;
  busNumber: string;
  busModel: string;
  bookedBy: string;
  bookedByRole: string;
  bookedByAvatarUrl: string;
  passengerName: string;
  passengerPhone: string;
  tickets: number;
  discount: number;
  discountType: IBookingDiscountType;
  originalPrice: number;
  price: number;
  bookedAt: Date;
  tripStatus: IBookingTripStatus;
};
