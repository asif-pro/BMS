import { useQuery } from '@tanstack/react-query';

import { _bookingList } from '@/mock_data/bookings.mock';

export const BOOKINGS_QUERY_KEY = ['bookings'] as const;

export function useGetBookings() {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: async () => _bookingList,
  });
}
