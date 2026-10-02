import { useQuery } from '@tanstack/react-query';

import {
  _balanceStatistics,
  _expenseTrend,
  _incomeTrend,
  _payrollTrend,
  _salaryByRole,
  _staffSalaryList,
  _transactionList,
  _walletCards,
} from '@/mock_data/accounts.mock';

export const ACCOUNTS_QUERY_KEY = ['accounts'] as const;

export function useGetTransactions() {
  return useQuery({
    queryKey: [...ACCOUNTS_QUERY_KEY, 'transactions'],
    queryFn: async () => _transactionList,
  });
}

export function useGetStaffSalaries() {
  return useQuery({
    queryKey: [...ACCOUNTS_QUERY_KEY, 'staff-salaries'],
    queryFn: async () => _staffSalaryList,
  });
}

export function useGetWalletCards() {
  return useQuery({
    queryKey: [...ACCOUNTS_QUERY_KEY, 'wallet-cards'],
    queryFn: async () => _walletCards,
  });
}

export function useGetAccountTrends() {
  return useQuery({
    queryKey: [...ACCOUNTS_QUERY_KEY, 'trends'],
    queryFn: async () => ({
      incomeTrend: _incomeTrend,
      expenseTrend: _expenseTrend,
      balanceStatistics: _balanceStatistics,
      payrollTrend: _payrollTrend,
      salaryByRole: _salaryByRole,
    }),
  });
}
