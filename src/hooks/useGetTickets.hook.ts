import { useQuery } from '@tanstack/react-query';

import { _operators, _ticketVehicles, _tickets } from '@/mock_data/tickets.mock';

export const TICKETS_QUERY_KEY = ['tickets'] as const;
export const OPERATORS_QUERY_KEY = ['operators'] as const;
export const TICKET_VEHICLES_QUERY_KEY = ['ticket-vehicles'] as const;

export function useGetTickets() {
  return useQuery({
    queryKey: TICKETS_QUERY_KEY,
    queryFn: async () => _tickets,
  });
}

export function useGetTicketById(id: string | undefined) {
  return useQuery({
    queryKey: [...TICKETS_QUERY_KEY, id],
    queryFn: async () => _tickets.find((ticket) => ticket.id === id) ?? null,
    enabled: Boolean(id),
  });
}

export function useGetOperators() {
  return useQuery({
    queryKey: OPERATORS_QUERY_KEY,
    queryFn: async () => _operators,
  });
}

export function useGetTicketVehicles() {
  return useQuery({
    queryKey: TICKET_VEHICLES_QUERY_KEY,
    queryFn: async () => _ticketVehicles,
  });
}
