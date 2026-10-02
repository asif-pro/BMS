import type { TicketVehicleOption } from '@/interfaces/ticket.interface';

export function formatTicketVehicleOption(option: TicketVehicleOption) {
  return `${option.busNumber} · ${option.busModel}`;
}
