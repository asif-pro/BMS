import { useQuery } from '@tanstack/react-query';

import { _vehicles, getVehicleById } from '@/mock_data/vehicles.mock';

export const VEHICLES_QUERY_KEY = ['vehicles'] as const;

export function useGetVehicles() {
  return useQuery({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: async () => _vehicles,
  });
}

export function useGetVehicleById(id: string | undefined) {
  return useQuery({
    queryKey: [...VEHICLES_QUERY_KEY, id],
    queryFn: async () => getVehicleById(id),
    enabled: Boolean(id),
  });
}
