import { useQuery } from '@tanstack/react-query';

import { _notifications } from '@/mock_data/notifications.mock';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;

export function useGetNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => _notifications,
  });
}
