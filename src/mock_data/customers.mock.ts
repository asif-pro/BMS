import type { ICustomerItem, ICustomerTripHistoryItem } from '@/interfaces/customer.interface';

// ----------------------------------------------------------------------

const NAMES = [
  'Jayvion Simon',
  'Lucian Obrien',
  'Deja Brady',
  'Harrison Stein',
  'Reece Chung',
  'Lainey Davidson',
  'Cristopher Cardenas',
  'Melanie Noble',
  'Chase Day',
  'Shawn Manning',
  'Soren Durham',
  'Cortez Herring',
  'Brycen Jimenez',
  'Giana Brandt',
  'Aspen Schmitt',
  'Colten Aguilar',
  'Angelique Morse',
  'Selina Boyer',
  'Thaddeus Sykes',
  'Amiah Pruitt',
];

const ADDRESSES = [
  '12 Gulshan Avenue, Dhaka',
  '45 Agrabad C/A, Chattogram',
  '88 Mirpur Road, Dhaka',
  '21 Kazir Dewri, Sylhet',
  '9 Station Road, Rajshahi',
  '33 Banani Lake Drive, Dhaka',
  '17 Jubilee Road, Khulna',
  '56 Medical College Road, Mymensingh',
  '4 Port Connecting Road, Mongla',
  '72 Zindabazar, Sylhet',
];

const avatar = (index: number) => `/assets/images/avatar/avatar_${(index % 12) + 1}.jpg`;

export const _customerList: ICustomerItem[] = NAMES.map((name, index) => ({
  id: `customer-${index + 1}`,
  name,
  phoneNumber: `+880 17${String(10000000 + index * 137).slice(0, 8)}`,
  address: ADDRESSES[index % ADDRESSES.length],
  avatarUrl: avatar(index),
  ticketsPurchased: 3 + (index % 5),
}));

// ----------------------------------------------------------------------

const ROUTES = [
  { origin: 'Dhaka', destination: 'Chattogram' },
  { origin: 'Dhaka', destination: 'Sylhet' },
  { origin: 'Dhaka', destination: 'Rajshahi' },
  { origin: 'Chattogram', destination: 'Cox\'s Bazar' },
  { origin: 'Dhaka', destination: 'Khulna' },
  { origin: 'Sylhet', destination: 'Dhaka' },
  { origin: 'Rajshahi', destination: 'Dhaka' },
  { origin: 'Khulna', destination: 'Dhaka' },
];

const STATUSES: ICustomerTripHistoryItem['status'][] = ['completed', 'completed', 'upcoming', 'canceled'];

function buildTripHistory(): ICustomerTripHistoryItem[] {
  const trips: ICustomerTripHistoryItem[] = [];

  _customerList.forEach((customer, customerIndex) => {
    const tripCount = 3 + (customerIndex % 5);

    for (let i = 0; i < tripCount; i += 1) {
      const route = ROUTES[(customerIndex + i) % ROUTES.length];
      const status = STATUSES[(customerIndex + i) % STATUSES.length];
      const daysAgo = status === 'upcoming' ? -(i + 1) * 2 : (customerIndex + i + 1) * 7;

      trips.push({
        id: `trip-${customer.id}-${i + 1}`,
        customerId: customer.id,
        origin: route.origin,
        destination: route.destination,
        route: `${route.origin} → ${route.destination}`,
        busNumber: `DHK-${1000 + ((customerIndex * 3 + i) % 90)}`,
        seat: `${(i % 10) + 1}${['A', 'B', 'C', 'D'][i % 4]}`,
        price: 650 + ((customerIndex + i) % 8) * 75,
        status,
        traveledAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      });
    }
  });

  return trips;
}

export const _customerTripHistory: ICustomerTripHistoryItem[] = buildTripHistory();

export function getCustomerTripHistory(customerId: string) {
  return _customerTripHistory
    .filter((trip) => trip.customerId === customerId)
    .sort((a, b) => b.traveledAt.getTime() - a.traveledAt.getTime());
}
