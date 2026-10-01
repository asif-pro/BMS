import type { IBookingDiscountType, IBookingItem, IBookingTripStatus } from './types';

// ----------------------------------------------------------------------

const ROUTES = [
  'Dhaka → Chattogram',
  'Dhaka → Sylhet',
  'Dhaka → Rajshahi',
  "Chattogram → Cox's Bazar",
  'Dhaka → Khulna',
  'Sylhet → Dhaka',
  'Rajshahi → Dhaka',
  'Khulna → Dhaka',
  "Dhaka → Cox's Bazar",
  'Chattogram → Dhaka',
];

const STAFF = [
  { name: 'Jayvion Simon', role: 'Counter Agent' },
  { name: 'Lucian Obrien', role: 'Supervisor' },
  { name: 'Deja Brady', role: 'Counter Agent' },
  { name: 'Harrison Stein', role: 'Manager' },
  { name: 'Reece Chung', role: 'Online Agent' },
  { name: 'Lainey Davidson', role: 'Counter Agent' },
  { name: 'Cristopher Cardenas', role: 'Supervisor' },
  { name: 'Melanie Noble', role: 'Online Agent' },
];

const PASSENGERS = [
  'Aspen Schmitt',
  'Colten Aguilar',
  'Angelique Morse',
  'Selina Boyer',
  'Thaddeus Sykes',
  'Amiah Pruitt',
  'Chase Day',
  'Shawn Manning',
  'Soren Durham',
  'Cortez Herring',
  'Brycen Jimenez',
  'Giana Brandt',
];

const STATUSES: IBookingTripStatus[] = ['taken', 'cancelled', 'returned', 'travelling'];

const BUS_MODELS = ['9700', 'B11R', 'K250 UB', 'eCitaro', 'RN8 J', "Lion's Coach", 'ZK6122H9', 'Touring HD'];

const avatar = (index: number) => `/assets/images/avatar/avatar_${(index % 12) + 1}.jpg`;

export const _bookingList: IBookingItem[] = Array.from({ length: 24 }, (_, index) => {
  const tickets = (index % 4) + 1;
  const unitPrice = 650 + (index % 8) * 75;
  const subtotal = unitPrice * tickets;
  const staff = STAFF[index % STAFF.length];

  let discountType: IBookingDiscountType = 'amount';
  let discount = 0;
  let price = subtotal;

  if (index % 3 === 0) {
    discountType = 'percent';
    discount = 10 + (index % 3) * 5;
    price = Math.max(Math.round(subtotal * (1 - discount / 100)), 0);
  } else if (index % 5 === 0) {
    discountType = 'amount';
    discount = 100 + (index % 4) * 50;
    price = Math.max(subtotal - discount, 0);
  }

  return {
    id: `booking-${index + 1}`,
    route: ROUTES[index % ROUTES.length],
    busNumber: `DHK-${1000 + index * 37}`,
    busModel: BUS_MODELS[index % BUS_MODELS.length],
    bookedBy: staff.name,
    bookedByRole: staff.role,
    bookedByAvatarUrl: avatar(index),
    passengerName: PASSENGERS[index % PASSENGERS.length],
    passengerPhone: `+880 17${String(10000000 + index * 211).slice(0, 8)}`,
    tickets,
    discount,
    discountType,
    originalPrice: subtotal,
    price,
    bookedAt: new Date(Date.now() - (index + 1) * 18 * 60 * 60 * 1000),
    tripStatus: STATUSES[index % STATUSES.length],
  };
});
