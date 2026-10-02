import { useQuery } from '@tanstack/react-query';

import { _incomeTrend, DASHBOARD_SUMMARY } from '@/mock_data/dashboard.mock';
import { _fleetByBrand, _topDrivers, _topStaff } from '@/mock_data/analytics.mock';
import { _vehicles } from '@/mock_data/vehicles.mock';

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const;

export function useGetDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: async () => ({
      incomeTrend: _incomeTrend,
      summary: DASHBOARD_SUMMARY,
      topDrivers: _topDrivers,
      topStaff: _topStaff,
      fleetByBrand: _fleetByBrand,
      vehicles: _vehicles,
    }),
  });
}
