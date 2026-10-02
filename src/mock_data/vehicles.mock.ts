import {
  VEHICLE_BRANDS,
  VEHICLE_BUS_TYPES,
  VEHICLE_COVERS,
  VEHICLE_ENGINE_TYPES,
  VEHICLE_FUEL_TYPES,
  VEHICLE_MODELS,
} from '@/constants/vehicle.constant';
import type { VehicleFuelType, VehicleItem, VehicleStatus } from '@/interfaces/vehicle.interface';
import { SEAT_LAYOUTS } from '@/constants/seat-layout.constant';
import { layoutSeatCount } from '@/utils/seat-layouts';

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
