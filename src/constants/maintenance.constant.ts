import type { IMaintenanceStatus, IMaintenanceType } from '@/interfaces/maintenance.interface';

export const MAINTENANCE_TYPES: IMaintenanceType[] = ['routine', 'repair', 'inspection', 'emergency'];

export const MAINTENANCE_STATUSES: IMaintenanceStatus[] = [
  'scheduled',
  'in_progress',
  'completed',
  'overdue',
];

export const MAINTENANCE_TYPE_LABELS: Record<IMaintenanceType, string> = {
  routine: 'Routine',
  repair: 'Repair',
  inspection: 'Inspection',
  emergency: 'Emergency',
};

export const MAINTENANCE_STATUS_LABELS: Record<IMaintenanceStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
  overdue: 'Overdue',
};

export const MAINTENANCE_STATUS_COLORS: Record<
  IMaintenanceStatus,
  'info' | 'warning' | 'success' | 'error'
> = {
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  overdue: 'error',
};
