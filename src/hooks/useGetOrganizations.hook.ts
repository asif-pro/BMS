import { useQuery } from '@tanstack/react-query';

import {
  _organizations,
  _organizationTransactions,
  _organizationUserAccounts,
} from '@/mock_data/organizations.mock';

export const ORGANIZATIONS_QUERY_KEY = ['organizations'] as const;
export const ORGANIZATION_USERS_QUERY_KEY = ['organization-users'] as const;
export const ORGANIZATION_TRANSACTIONS_QUERY_KEY = ['organization-transactions'] as const;

export function useGetOrganizations() {
  return useQuery({
    queryKey: ORGANIZATIONS_QUERY_KEY,
    queryFn: async () => _organizations,
  });
}

export function useGetOrganizationById(id: string | undefined) {
  return useQuery({
    queryKey: [...ORGANIZATIONS_QUERY_KEY, id],
    queryFn: async () => _organizations.find((organization) => organization.id === id) ?? null,
    enabled: Boolean(id),
  });
}

export function useGetOrganizationUsers(organizationId: string | undefined) {
  return useQuery({
    queryKey: [...ORGANIZATION_USERS_QUERY_KEY, organizationId],
    queryFn: async () =>
      _organizationUserAccounts.filter((user) => user.organizationId === organizationId),
    enabled: Boolean(organizationId),
  });
}

export function useGetOrganizationTransactions(organizationId: string | undefined) {
  return useQuery({
    queryKey: [...ORGANIZATION_TRANSACTIONS_QUERY_KEY, organizationId],
    queryFn: async () =>
      _organizationTransactions
        .filter((transaction) => transaction.organizationId === organizationId)
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    enabled: Boolean(organizationId),
  });
}
