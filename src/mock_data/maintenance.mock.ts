import type { IMaintenanceItem } from '@/interfaces/maintenance.interface';
import { _vehicles } from '@/mock_data/vehicles.mock';

// ----------------------------------------------------------------------

const WORKSHOPS = [
  'Metro Fleet Garage, Tejgaon',
  'Chattogram Auto Care, Agrabad',
  'Sylhet Coach Workshop',
  'Rajshahi Heavy Motors',
  'Khulna Bus Service Center',
  'Dhaka Volvo Authorized Service',
];

const d = (month: number, day: number) => new Date(2026, month - 1, day);

type Seed = Omit<
  IMaintenanceItem,
  'id' | 'vehicleName' | 'plateNumber' | 'workshop'
> & { vehicleIndex: number };

const SEEDS: Seed[] = [
  {
    vehicleIndex: 0,
    type: 'routine',
    title: 'Engine oil and filter change',
    cost: 12600,
    status: 'completed',
    scheduledDate: d(9, 4),
    completedDate: d(9, 4),
    odometer: 84250,
  },
  {
    vehicleIndex: 1,
    type: 'repair',
    title: 'Brake pad and disc replacement',
    cost: 18500,
    status: 'in_progress',
    scheduledDate: d(9, 29),
    completedDate: null,
    odometer: 112940,
  },
  {
    vehicleIndex: 2,
    type: 'inspection',
    title: 'Annual fitness inspection',
    cost: 7500,
    status: 'scheduled',
    scheduledDate: d(10, 8),
    completedDate: null,
    odometer: 96310,
  },
  {
    vehicleIndex: 3,
    type: 'emergency',
    title: 'Radiator leak and coolant refill',
    cost: 22400,
    status: 'completed',
    scheduledDate: d(9, 12),
    completedDate: d(9, 13),
    odometer: 73820,
  },
  {
    vehicleIndex: 4,
    type: 'routine',
    title: 'Tyre rotation and alignment',
    cost: 9200,
    status: 'overdue',
    scheduledDate: d(9, 15),
    completedDate: null,
    odometer: 101480,
  },
  {
    vehicleIndex: 5,
    type: 'repair',
    title: 'AC compressor replacement',
    cost: 31500,
    status: 'in_progress',
    scheduledDate: d(9, 27),
    completedDate: null,
    odometer: 68500,
  },
  {
    vehicleIndex: 6,
    type: 'routine',
    title: 'Transmission fluid service',
    cost: 14800,
    status: 'scheduled',
    scheduledDate: d(10, 12),
    completedDate: null,
    odometer: 58930,
  },
  {
    vehicleIndex: 7,
    type: 'inspection',
    title: 'Safety and emission check',
    cost: 5400,
    status: 'completed',
    scheduledDate: d(8, 28),
    completedDate: d(8, 28),
    odometer: 120760,
  },
  {
    vehicleIndex: 8,
    type: 'emergency',
    title: 'Clutch failure on highway',
    cost: 46000,
    status: 'completed',
    scheduledDate: d(9, 2),
    completedDate: d(9, 5),
    odometer: 90140,
  },
  {
    vehicleIndex: 9,
    type: 'routine',
    title: 'Suspension and steering check',
    cost: 11200,
    status: 'overdue',
    scheduledDate: d(9, 20),
    completedDate: null,
    odometer: 77650,
  },
  {
    vehicleIndex: 10,
    type: 'repair',
    title: 'Windshield and wiper replacement',
    cost: 16800,
    status: 'scheduled',
    scheduledDate: d(10, 15),
    completedDate: null,
    odometer: 45210,
  },
  {
    vehicleIndex: 11,
    type: 'routine',
    title: 'Battery test and terminal cleaning',
    cost: 3800,
    status: 'completed',
    scheduledDate: d(9, 18),
    completedDate: d(9, 18),
    odometer: 39870,
  },
  {
    vehicleIndex: 0,
    type: 'inspection',
    title: 'Fire extinguisher and first-aid audit',
    cost: 2600,
    status: 'scheduled',
    scheduledDate: d(10, 20),
    completedDate: null,
    odometer: 85010,
  },
  {
    vehicleIndex: 3,
    type: 'repair',
    title: 'Exhaust system welding',
    cost: 8900,
    status: 'overdue',
    scheduledDate: d(9, 24),
    completedDate: null,
    odometer: 74100,
  },
  {
    vehicleIndex: 5,
    type: 'routine',
    title: 'Air filter and fuel filter replacement',
    cost: 6700,
    status: 'completed',
    scheduledDate: d(9, 8),
    completedDate: d(9, 9),
    odometer: 67800,
  },
];

export const _maintenanceList: IMaintenanceItem[] = SEEDS.map(
  ({ vehicleIndex, ...seed }, index) => {
    const vehicle = _vehicles[vehicleIndex % _vehicles.length];

    return {
      id: `maintenance-${index + 1}`,
      vehicleName: vehicle.name,
      plateNumber: vehicle.plateNumber,
      workshop: WORKSHOPS[index % WORKSHOPS.length],
      ...seed,
    };
  }
);
