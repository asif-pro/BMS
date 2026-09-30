export type VehicleStatus = 'active' | 'maintenance' | 'inactive';

export type VehicleBusType =
  | 'Economy'
  | 'Business'
  | 'Sleeper'
  | 'Double decker'
  | 'AC Coach'
  | 'Minibus';

export type VehicleEngineType = 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';

export type VehicleFuelType = 'Diesel' | 'Electric' | 'Petrol' | 'CNG' | 'Hybrid';

export type VehicleItem = {
  id: string;
  name: string;
  plateNumber: string;
  brand: string;
  brandLogoUrl: string;
  model: string;
  seats: number;
  quantity: number;
  engineType: VehicleEngineType;
  busType: VehicleBusType;
  fuelType: VehicleFuelType;
  layoutId: string;
  coverUrl: string;
  status: VehicleStatus;
};
