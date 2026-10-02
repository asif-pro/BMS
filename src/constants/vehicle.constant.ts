import type {
  VehicleBusType,
  VehicleEngineType,
  VehicleFuelType,
  VehicleStatus,
} from '@/interfaces/vehicle.interface';

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

export const COVER_LABELS: Record<string, string> = {
  '/assets/images/buses/highway-coach.jpg': 'Highway coach',
  '/assets/images/buses/ac-coach.jpg': 'AC coach',
  '/assets/images/buses/sleeper.jpg': 'Sleeper',
  '/assets/images/buses/double-decker.jpg': 'Double decker',
  '/assets/images/buses/night-bus.jpg': 'Night bus',
  '/assets/images/buses/blue-bus.jpg': 'Blue bus',
  '/assets/images/buses/yellow-bus.jpg': 'Yellow bus',
  '/assets/images/buses/orange-coach.jpg': 'Orange coach',
  '/assets/images/buses/desert-coach.jpg': 'Desert coach',
  '/assets/images/buses/minibus.jpg': 'Minibus',
  '/assets/images/buses/double-decker-city.jpg': 'City double decker',
  '/assets/images/buses/pink-coach.jpg': 'Pink coach',
};
