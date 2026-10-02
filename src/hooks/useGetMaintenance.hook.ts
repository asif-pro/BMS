import { useQuery } from '@tanstack/react-query';

import { _maintenanceList } from '@/mock_data/maintenance.mock';

export const MAINTENANCE_QUERY_KEY = ['maintenance'] as const;

export function useGetMaintenance() {
  return useQuery({
    queryKey: MAINTENANCE_QUERY_KEY,
    queryFn: async () => _maintenanceList,
  });
}
