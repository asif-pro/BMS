import { useQuery } from '@tanstack/react-query';

import { _contacts } from '@/mock_data/contacts.mock';

export const CONTACTS_QUERY_KEY = ['contacts'] as const;

export function useGetContacts() {
  return useQuery({
    queryKey: CONTACTS_QUERY_KEY,
    queryFn: async () => _contacts,
  });
}
