// ----------------------------------------------------------------------

export type IMaintenanceType = 'routine' | 'repair' | 'inspection' | 'emergency';

export type IMaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';

export type IMaintenanceTableFilterValue = string;

export type IMaintenanceTableFilters = {
  name: string;
  type: 'all' | IMaintenanceType;
  status: 'all' | IMaintenanceStatus;
};

export type IMaintenanceItem = {
  id: string;
  vehicleName: string;
  plateNumber: string;
  type: IMaintenanceType;
  title: string;
  cost: number;
  status: IMaintenanceStatus;
  scheduledDate: Date;
  completedDate: Date | null;
  workshop: string;
  odometer: number;
};
