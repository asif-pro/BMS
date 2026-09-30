import { SEAT_LAYOUTS, layoutSeatCount } from '@/modules/Tickets/seat-layouts';

import type {
  VehicleBusType,
  VehicleEngineType,
  VehicleFuelType,
  VehicleItem,
  VehicleStatus,
} from './types';

// ----------------------------------------------------------------------

export const VEHICLE_BRANDS = [
  { name: 'Volvo', logo: '/assets/images/brands/volvo.svg' },
  { name: 'Scania', logo: '/assets/images/brands/scania.svg' },
  { name: 'Mercedes-Benz', logo: '/assets/images/brands/mercedes.svg' },
  { name: 'Hino', logo: '/assets/images/brands/hino.svg' },
  { name: 'MAN', logo: '/assets/images/brands/man.svg' },
  { name: 'Yutong', logo: '/assets/images/brands/yutong.svg' },
] as const;

export const VEHICLE_MODELS = [
  'B11R',
  'K250 UB',
  'eCitaro',
  'RN8 J',
  "Lion's Coach",
  'ZK6122H9',
  '9700',
  'Touring HD',
];

export const VEHICLE_BUS_TYPES: VehicleBusType[] = [
  'Economy',
  'Business',
  'Sleeper',
  'Double decker',
  'AC Coach',
  'Minibus',
];

export const VEHICLE_ENGINE_TYPES: VehicleEngineType[] = ['Diesel', 'Electric', 'Hybrid', 'CNG'];

export const VEHICLE_FUEL_TYPES: VehicleFuelType[] = ['Diesel', 'Electric', 'Petrol', 'CNG', 'Hybrid'];

export const VEHICLE_STATUSES: VehicleStatus[] = ['active', 'maintenance', 'inactive'];

export const VEHICLE_COVERS = [
  '/assets/images/buses/highway-coach.jpg',
  '/assets/images/buses/ac-coach.jpg',
  '/assets/images/buses/sleeper.jpg',
  '/assets/images/buses/double-decker.jpg',
  '/assets/images/buses/night-bus.jpg',
  '/assets/images/buses/blue-bus.jpg',
  '/assets/images/buses/yellow-bus.jpg',
  '/assets/images/buses/orange-coach.jpg',
  '/assets/images/buses/desert-coach.jpg',
  '/assets/images/buses/minibus.jpg',
  '/assets/images/buses/double-decker-city.jpg',
  '/assets/images/buses/pink-coach.jpg',
];

const STATUSES: VehicleStatus[] = ['active', 'active', 'active', 'maintenance', 'inactive', 'active'];

const NAMES = [
  'Coach DHK-01',
  'Express CTG-07',
  'Night Sylhet-03',
  'Coastal CXB-12',
  'Intercity RAJ-05',
  'Metro KHL-09',
  'Shuttle COM-02',
  'Highway BOG-11',
  'City Link MYM-04',
  'Premium BAR-08',
  'Sleeper RNG-06',
  'Local JES-10',
];

// ----------------------------------------------------------------------

export const _vehicles: VehicleItem[] = NAMES.map((name, index) => {
  const brand = VEHICLE_BRANDS[index % VEHICLE_BRANDS.length];
  const engineType = VEHICLE_ENGINE_TYPES[index % VEHICLE_ENGINE_TYPES.length];
  const layout = SEAT_LAYOUTS[index % SEAT_LAYOUTS.length];

  return {
    id: `vehicle-${index + 1}`,
    name,
    plateNumber: `DHK-${String(1000 + index * 37).slice(0, 4)}`,
    brand: brand.name,
    brandLogoUrl: brand.logo,
    model: VEHICLE_MODELS[index % VEHICLE_MODELS.length],
    seats: layoutSeatCount(layout),
    quantity: (index % 4) + 1,
    engineType,
    busType: VEHICLE_BUS_TYPES[index % VEHICLE_BUS_TYPES.length],
    fuelType: (engineType === 'Electric'
      ? 'Electric'
      : engineType === 'Hybrid'
        ? 'Hybrid'
        : VEHICLE_FUEL_TYPES[index % VEHICLE_FUEL_TYPES.length]) as VehicleFuelType,
    layoutId: layout.id,
    coverUrl: VEHICLE_COVERS[index % VEHICLE_COVERS.length],
    status: STATUSES[index % STATUSES.length],
  };
});

export function getVehicleById(id: string | undefined) {
  if (!id) {
    return null;
  }

  return _vehicles.find((vehicle) => vehicle.id === id) ?? null;
}
