import { useQuery } from '@tanstack/react-query';

import { _userList } from '@/mock_data/users.mock';

export const USERS_QUERY_KEY = ['users'] as const;

export function useGetUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => _userList,
  });
}

export function useGetUserById(id: string | undefined) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: async () => _userList.find((user) => user.id === id) ?? null,
    enabled: Boolean(id),
  });
}
