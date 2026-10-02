import { useQuery } from '@tanstack/react-query';

import { _customerList, getCustomerTripHistory } from '@/mock_data/customers.mock';

export const CUSTOMERS_QUERY_KEY = ['customers'] as const;

export function useGetCustomers() {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: async () => _customerList,
  });
}

export function useGetCustomerById(id: string | undefined) {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, id],
    queryFn: async () => _customerList.find((customer) => customer.id === id) ?? null,
    enabled: Boolean(id),
  });
}

export function useGetCustomerTripHistory(customerId: string | undefined) {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, customerId, 'trip-history'],
    queryFn: async () => (customerId ? getCustomerTripHistory(customerId) : []),
    enabled: Boolean(customerId),
  });
}
