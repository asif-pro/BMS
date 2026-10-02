import { useQuery } from '@tanstack/react-query';

import {
  _brandPerformance,
  _fleetByBrand,
  _fleetHealth,
  _payrollTotal,
  _payrollTrend,
  _revenueByRoute,
  _ridershipChart,
  _routePerformance,
  _salaryByRole,
  _salaryExpenseAmount,
  _salaryExpenseByRole,
  _salaryExpensePercent,
  _sparklines,
  _staffByRole,
  _topDrivers,
  _topStaff,
  _totalExpenseAmount,
} from '@/mock_data/analytics.mock';

export const ANALYTICS_QUERY_KEY = ['analytics'] as const;

export function useGetAnalytics() {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEY,
    queryFn: async () => ({
      ridershipChart: _ridershipChart,
      revenueByRoute: _revenueByRoute,
      routePerformance: _routePerformance,
      fleetHealth: _fleetHealth,
      sparklines: _sparklines,
      fleetByBrand: _fleetByBrand,
      brandPerformance: _brandPerformance,
      topDrivers: _topDrivers,
      topStaff: _topStaff,
      staffByRole: _staffByRole,
      salaryByRole: _salaryByRole,
      payrollTrend: _payrollTrend,
      payrollTotal: _payrollTotal,
      totalExpenseAmount: _totalExpenseAmount,
      salaryExpenseAmount: _salaryExpenseAmount,
      salaryExpensePercent: _salaryExpensePercent,
      salaryExpenseByRole: _salaryExpenseByRole,
    }),
  });
}

export function useGetStaffByRole() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, 'staff-by-role'],
    queryFn: async () => _staffByRole,
  });
}

export function useGetTopDrivers() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, 'top-drivers'],
    queryFn: async () => _topDrivers,
  });
}

export function useGetTopStaff() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, 'top-staff'],
    queryFn: async () => _topStaff,
  });
}

export function useGetFleetByBrand() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, 'fleet-by-brand'],
    queryFn: async () => _fleetByBrand,
  });
}
