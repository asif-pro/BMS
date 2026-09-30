import { addDays, set, subDays } from 'date-fns';

import type { TicketItem, TicketOperator, TicketPassenger, TicketSeat, TicketSeatColumn, TicketStatus } from './types';

// ----------------------------------------------------------------------

const avatar = (index: number) => `/assets/images/avatar/avatar_${(index % 12) + 1}.jpg`;

const BUS_MODELS = [
  'Scania K250',
  'Mercedes-Benz eCitaro',
  'Volvo B11R',
  'Hino RN8',
  "MAN Lion's Coach",
  'Yutong ZK6122',
];

const BUS_IMAGES = [
  '/assets/images/buses/ac-coach.jpg',
  '/assets/images/buses/highway-coach.jpg',
  '/assets/images/buses/desert-coach.jpg',
  '/assets/images/buses/blue-bus.jpg',
  '/assets/images/buses/yellow-bus.jpg',
  '/assets/images/buses/sleeper.jpg',
  '/assets/images/buses/double-decker.jpg',
  '/assets/images/buses/double-decker-city.jpg',
  '/assets/images/buses/minibus.jpg',
  '/assets/images/buses/orange-coach.jpg',
  '/assets/images/buses/night-bus.jpg',
  '/assets/images/buses/pink-coach.jpg',
];

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

const ROUTE_STOPS: Record<string, string[]> = {
  'Dhaka — Chittagong AC Express': ['Cumilla', 'Feni', 'Mirsharai'],
  'Dhaka — Sylhet Night Coach': ['Narsingdi', 'Bhairab', 'Brahmanbaria'],
  "Dhaka — Cox's Bazar Coastal": ['Cumilla', 'Feni', 'Chittagong', 'Satkania', 'Lohagara', 'Chakaria'],
  'Chittagong — Sylhet Highway': ['Cumilla', 'Brahmanbaria'],
  'Dhaka — Rajshahi Intercity': ['Tangail', 'Sirajganj', 'Bogura'],
  'Khulna — Dhaka Sleeper': ['Jashore', 'Faridpur', 'Mawa'],
  'Barishal — Dhaka Launch Link': ['Madaripur', 'Faridpur'],
  'Rangpur — Dhaka Morning': ['Bogura', 'Sirajganj', 'Tangail'],
  'Comilla — Chittagong Shuttle': ['Feni'],
  'Bogura — Dhaka Express': ['Sirajganj', 'Tangail'],
  'Jessore — Khulna Connector': ['Jhikargacha'],
  'Mymensingh — Dhaka Local': ['Trishal', 'Gazipur', 'Uttara'],
};

const NAMES = [
  'Dhaka — Chittagong AC Express',
  'Dhaka — Sylhet Night Coach',
  "Dhaka — Cox's Bazar Coastal",
  'Chittagong — Sylhet Highway',
  'Dhaka — Rajshahi Intercity',
  'Khulna — Dhaka Sleeper',
  'Barishal — Dhaka Launch Link',
  'Rangpur — Dhaka Morning',
  'Comilla — Chittagong Shuttle',
  'Bogura — Dhaka Express',
  'Jessore — Khulna Connector',
  'Mymensingh — Dhaka Local',
];

const OPERATORS: TicketOperator[] = [
  'Nusrat Jahan',
  'Rahim Uddin',
  'Farhana Akter',
  'Imran Hossain',
  'Sadia Rahman',
  'Tanvir Ahmed',
  'Mitu Chowdhury',
  'Hasan Mahmud',
  'Rupa Khatun',
  'Shahidul Islam',
  'Lima Begum',
  'Karim Reza',
].map((name, index) => ({
  id: `operator-${index + 1}`,
  name,
  avatarUrl: avatar(index),
  phoneNumber: `+880 17${(10000000 + index * 137).toString().slice(0, 8)}`,
}));

const PASSENGERS: TicketPassenger[] = [...Array(12)].map((_, index) => ({
  id: `passenger-${index + 1}`,
  name: OPERATORS[index].name,
  avatarUrl: avatar(index + 4),
  guests: index + 1,
  phoneNumber: OPERATORS[index].phoneNumber,
}));

const STATUSES: TicketStatus[] = ['upcoming', 'completed', 'routing', 'canceled', 'active'];

const SEAT_COLUMNS: TicketSeatColumn[] = ['A', 'B', 'C', 'D'];

const BOOKED_SEAT_IDS = ['A2', 'C5', 'D8', 'B4', 'A7', 'C9', 'D3', 'B10'];

const HELD_SEAT = {
  id: 'B1',
  holdBy: 'Admin User',
  holdByAvatar: avatar(0),
  holdNote: 'Keep this seat until 30 minutes before departure.',
  heldAt: set(subDays(new Date(), 1), {
    hours: 15,
    minutes: 40,
    seconds: 0,
    milliseconds: 0,
  }),
};

const TRAVELERS = [
  'Ayesha Siddique',
  'Mehedi Hasan',
  'Nabila Chowdhury',
  'Rafiqul Alam',
  'Sumaiya Akter',
  'Jahidul Kabir',
  'Farzana Yesmin',
  'Omar Faruk',
].map((name, index) => ({
  name,
  phoneNumber: `+880 18${(20000000 + index * 251).toString().slice(0, 8)}`,
}));

function buildSeats(bookers: TicketPassenger[], origin: string, stops: string[]): TicketSeat[] {
  const boardingPoints = [origin, ...stops];
  const assignments = new Map(
    bookers.map((booker, index) => [
      BOOKED_SEAT_IDS[index],
      {
        bookedBy: booker.name,
        passenger: TRAVELERS[index % TRAVELERS.length].name,
        passengerPhone: TRAVELERS[index % TRAVELERS.length].phoneNumber,
        boarding: boardingPoints[index % boardingPoints.length],
        bookedAt: set(subDays(new Date(), index + 1), {
          hours: [9, 11, 14, 16, 18, 20, 8, 13][index % 8],
          minutes: [10, 25, 40, 55][index % 4],
          seconds: 0,
          milliseconds: 0,
        }),
        luggage: index % 4,
        note: [
          'Call the passenger 30 minutes before departure.',
          'Two bags will be loaded at the counter.',
          'Seat requested next to a family member.',
          'Drop at the highway gate, not the terminal.',
        ][index % 4],
      },
    ])
  );

  return Array.from({ length: 10 }, (_, rowIndex) => rowIndex + 1).flatMap((row) =>
    SEAT_COLUMNS.map((column) => {
      const id = `${column}${row}`;
      const booked = assignments.get(id);
      const held = !booked && id === HELD_SEAT.id;
      const position = column === 'A' || column === 'D' ? 'Window' : 'Aisle';

      return {
        id,
        row,
        column,
        side: column === 'A' || column === 'B' ? 'Left' : 'Right',
        position,
        status: booked ? 'booked' : held ? 'held' : 'available',
        price: position === 'Window' ? 1350 : 1200,
        bookedBy: booked?.bookedBy,
        passenger: booked?.passenger,
        passengerPhone: booked?.passengerPhone,
        boarding: booked?.boarding,
        bookedAt: booked?.bookedAt,
        luggage: booked?.luggage,
        note: booked?.note,
        holdBy: held ? HELD_SEAT.holdBy : undefined,
        holdByAvatar: held ? HELD_SEAT.holdByAvatar : undefined,
        holdNote: held ? HELD_SEAT.holdNote : undefined,
        heldAt: held ? HELD_SEAT.heldAt : undefined,
      };
    })
  );
}

const SERVICE_SETS = [
  ['Air conditioned', 'Wi-Fi'],
  ['Snacks', 'Recliner seats'],
  ['USB charging', 'Onboard toilet'],
  ['Priority boarding', 'Extra luggage', 'Air conditioned'],
];

export const _operators = OPERATORS;

export type TicketVehicleOption = {
  busNumber: string;
  busModel: string;
};

export function formatTicketVehicleOption(option: TicketVehicleOption) {
  return `${option.busNumber} · ${option.busModel}`;
}

export const _tickets: TicketItem[] = NAMES.map((name, index) => {
  const createdAt = subDays(new Date(), index + 1);
  const startDate = set(addDays(new Date(), index + 2), {
    hours: [6, 8, 9, 10, 14, 18, 21, 7, 11, 16, 20][index % 11],
    minutes: [0, 15, 30, 45][index % 4],
    seconds: 0,
    milliseconds: 0,
  });
  const endDate = set(addDays(startDate, (index % 3) + 1), {
    hours: [12, 15, 17, 19, 22, 8, 10, 13, 16, 18, 23][index % 11],
    minutes: [20, 40, 10, 50][index % 4],
    seconds: 0,
    milliseconds: 0,
  });
  const price = 45 + index * 12;
  const hasSale = index % 3 === 0;
  const [, routeEnd = ''] = name.split(' — ');
  const origin = name.split(' — ')[0];
  const destination =
    [...DESTINATIONS].sort((a, b) => b.length - a.length).find((city) => routeEnd.startsWith(city)) ??
    routeEnd;
  const driver = OPERATORS[index];
  const bookers = PASSENGERS.slice(0, (index % 6) + 3);

  return {
    id: `trip-${index + 1}`,
    name,
    price,
    priceSale: hasSale ? price + 18 : 0,
    totalViews: 120 + index * 37,
    images: [BUS_IMAGES[index]],
    services: SERVICE_SETS[index % SERVICE_SETS.length],
    origin,
    destination,
    stops: ROUTE_STOPS[name] ?? [],
    ratingNumber: Number((4.2 + (index % 5) * 0.15).toFixed(1)),
    bookers,
    operators:
      (index === 0 && OPERATORS.slice(0, 1)) ||
      (index === 1 && OPERATORS.slice(1, 3)) ||
      (index === 2 && OPERATORS.slice(2, 5)) ||
      OPERATORS.slice(index % 6, (index % 6) + 2),
    status: STATUSES[index % STATUSES.length],
    busModel: BUS_MODELS[index % BUS_MODELS.length],
    busNumber: `BA-${String(11 + (index % 20)).padStart(2, '0')}-${2400 + index * 13}`,
    driverName: driver.name,
    driverAvatarUrl: driver.avatarUrl,
    seatCapacity: 40,
    seats: buildSeats(bookers, origin, ROUTE_STOPS[name] ?? []),
    createdAt,
    available: {
      startDate,
      endDate,
    },
  };
});

export const _ticketVehicles: TicketVehicleOption[] = Array.from(
  new Map(
    _tickets.map((ticket) => [
      ticket.busNumber,
      { busNumber: ticket.busNumber, busModel: ticket.busModel },
    ])
  ).values()
);
