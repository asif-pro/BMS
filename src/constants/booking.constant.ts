import type { IBookingTripStatus } from '@/interfaces/booking.interface';

export const BOOKING_STATUS_COLOR: Record<
  IBookingTripStatus,
  'info' | 'success' | 'warning' | 'error' | 'default'
> = {
  taken: 'success',
  travelling: 'info',
  returned: 'warning',
  cancelled: 'error',
};
