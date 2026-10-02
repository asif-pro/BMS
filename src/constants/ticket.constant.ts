import type { TicketStatus } from '@/interfaces/ticket.interface';

export const TICKET_SERVICE_OPTIONS = [
  { value: 'Air conditioned', label: 'Air conditioned' },
  { value: 'Wi-Fi', label: 'Wi-Fi' },
  { value: 'Snacks', label: 'Snacks' },
  { value: 'Recliner seats', label: 'Recliner seats' },
  { value: 'USB charging', label: 'USB charging' },
  { value: 'Onboard toilet', label: 'Onboard toilet' },
  { value: 'Priority boarding', label: 'Priority boarding' },
  { value: 'Extra luggage', label: 'Extra luggage' },
];

export const DESTINATIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  "Cox's Bazar",
  'Comilla',
  'Bogura',
  'Jessore',
  'Mymensingh',
];

export const STOPPAGE_CITIES = Array.from(
  new Set([
    ...DESTINATIONS,
    'Narsingdi',
    'Bhairab',
    'Brahmanbaria',
    'Cumilla',
    'Feni',
    'Mirsharai',
    'Tangail',
    'Sirajganj',
    'Gazipur',
    'Uttara',
    'Faridpur',
    'Jashore',
    'Mawa',
    'Madaripur',
    'Satkania',
    'Lohagara',
    'Chakaria',
    'Trishal',
  ])
).sort((a, b) => a.localeCompare(b));

export const TICKET_STATUS_COLOR: Record<
  TicketStatus,
  'info' | 'success' | 'warning' | 'error' | 'default'
> = {
  upcoming: 'info',
  active: 'success',
  routing: 'warning',
  canceled: 'error',
  completed: 'default',
};

export const TICKET_AMENITIES: { key: string; service: string; icon: string }[] = [
  { key: 'AMENITY_WIFI', service: 'Wi-Fi', icon: 'solar:wi-fi-bold' },
  { key: 'AMENITY_AC', service: 'Air conditioned', icon: 'solar:snowflake-bold' },
  { key: 'AMENITY_FOOD', service: 'Snacks', icon: 'solar:chef-hat-bold' },
  { key: 'AMENITY_TOILET', service: 'Onboard toilet', icon: 'ph:toilet-bold' },
  { key: 'AMENITY_EXTRA_LUGGAGE', service: 'Extra luggage', icon: 'solar:suitcase-bold' },
];
