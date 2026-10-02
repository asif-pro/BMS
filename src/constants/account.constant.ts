import type { ITransactionCategory } from '@/interfaces/account.interface';

export const EXPENSE_CATEGORIES: ITransactionCategory[] = [
  'Fuel',
  'Maintenance',
  'Salaries',
  'Insurance',
  'Tolls',
  'Parts',
  'Other',
];

export const CATEGORY_ICONS: Record<ITransactionCategory, string> = {
  'Ticket Sales': 'solar:ticket-bold',
  Charter: 'solar:bus-bold',
  'Parcel Service': 'solar:box-bold',
  Fuel: 'solar:gas-station-bold',
  Maintenance: 'solar:settings-bold',
  Salaries: 'solar:wallet-money-bold',
  Insurance: 'solar:shield-check-bold',
  Tolls: 'solar:routing-bold',
  Parts: 'solar:widget-5-bold',
  Other: 'solar:bill-list-bold',
};
