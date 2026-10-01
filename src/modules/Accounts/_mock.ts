import { _userList } from '@/modules/Users/_mock';

import type {
  ITransactionItem,
  ITransactionCategory,
  IWalletCard,
  IStaffSalaryItem,
  IStaffSalaryStatus,
} from './types';

// ----------------------------------------------------------------------

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

const day = (month: number, d: number, hour = 10, minute = 0) =>
  new Date(2026, month, d, hour, minute);

export const _transactionList: ITransactionItem[] = [
  {
    id: 'txn-1',
    type: 'Income',
    category: 'Ticket Sales',
    description: 'Dhaka - Chattogram ticket sales',
    amount: 148500,
    status: 'completed',
    date: day(8, 29, 18, 20),
    ref: 'TXN-240901',
  },
  {
    id: 'txn-2',
    type: 'Expense',
    category: 'Fuel',
    description: 'Diesel refill - DHK-METRO-1042',
    amount: 42000,
    status: 'completed',
    date: day(8, 29, 9, 45),
    ref: 'TXN-240902',
  },
  {
    id: 'txn-3',
    type: 'Income',
    category: 'Ticket Sales',
    description: 'Dhaka - Sylhet ticket sales',
    amount: 96200,
    status: 'completed',
    date: day(8, 28, 20, 5),
    ref: 'TXN-240903',
  },
  {
    id: 'txn-4',
    type: 'Expense',
    category: 'Salaries',
    description: 'Driver and helper salaries - September',
    amount: 185000,
    status: 'completed',
    date: day(8, 28, 12, 0),
    ref: 'TXN-240904',
  },
  {
    id: 'txn-5',
    type: 'Expense',
    category: 'Maintenance',
    description: 'Brake service - CTG-KA-5521',
    amount: 18500,
    status: 'pending',
    date: day(8, 27, 15, 30),
    ref: 'TXN-240905',
  },
  {
    id: 'txn-6',
    type: 'Income',
    category: 'Charter',
    description: "Corporate trip charter - Cox's Bazar",
    amount: 72000,
    status: 'completed',
    date: day(8, 26, 8, 15),
    ref: 'TXN-240906',
  },
  {
    id: 'txn-7',
    type: 'Expense',
    category: 'Tolls',
    description: 'Padma Bridge toll - weekly',
    amount: 14400,
    status: 'completed',
    date: day(8, 26, 7, 0),
    ref: 'TXN-240907',
  },
  {
    id: 'txn-8',
    type: 'Expense',
    category: 'Insurance',
    description: 'Fleet insurance premium - Q3',
    amount: 64000,
    status: 'completed',
    date: day(8, 25, 11, 10),
    ref: 'TXN-240908',
  },
  {
    id: 'txn-9',
    type: 'Income',
    category: 'Ticket Sales',
    description: 'Dhaka - Rajshahi ticket sales',
    amount: 83400,
    status: 'completed',
    date: day(7, 24, 19, 40),
    ref: 'TXN-240809',
  },
  {
    id: 'txn-10',
    type: 'Expense',
    category: 'Parts',
    description: 'Tyre replacement set - RAJ-GA-2210',
    amount: 56000,
    status: 'failed',
    date: day(7, 23, 14, 25),
    ref: 'TXN-240810',
  },
  {
    id: 'txn-11',
    type: 'Income',
    category: 'Parcel Service',
    description: 'Parcel delivery revenue - week 4',
    amount: 21800,
    status: 'pending',
    date: day(7, 23, 17, 0),
    ref: 'TXN-240811',
  },
  {
    id: 'txn-12',
    type: 'Expense',
    category: 'Fuel',
    description: 'Diesel refill - SYL-HA-7733',
    amount: 38500,
    status: 'completed',
    date: day(7, 22, 6, 50),
    ref: 'TXN-240812',
  },
  {
    id: 'txn-13',
    type: 'Income',
    category: 'Ticket Sales',
    description: 'Dhaka - Khulna ticket sales',
    amount: 67900,
    status: 'completed',
    date: day(7, 21, 21, 10),
    ref: 'TXN-240813',
  },
  {
    id: 'txn-14',
    type: 'Expense',
    category: 'Maintenance',
    description: 'Engine oil and filter change',
    amount: 12600,
    status: 'completed',
    date: day(7, 20, 10, 35),
    ref: 'TXN-240814',
  },
  {
    id: 'txn-15',
    type: 'Expense',
    category: 'Other',
    description: 'Terminal parking and counter rent',
    amount: 22000,
    status: 'completed',
    date: day(6, 19, 13, 0),
    ref: 'TXN-240715',
  },
  {
    id: 'txn-16',
    type: 'Income',
    category: 'Charter',
    description: 'Wedding party charter - Gazipur',
    amount: 45000,
    status: 'pending',
    date: day(6, 18, 9, 30),
    ref: 'TXN-240716',
  },
  {
    id: 'txn-17',
    type: 'Expense',
    category: 'Salaries',
    description: 'Counter staff salaries - July',
    amount: 96000,
    status: 'completed',
    date: day(6, 17, 12, 0),
    ref: 'TXN-240717',
  },
  {
    id: 'txn-18',
    type: 'Expense',
    category: 'Parts',
    description: 'AC compressor - CTG-KA-5521',
    amount: 31500,
    status: 'pending',
    date: day(6, 16, 16, 20),
    ref: 'TXN-240718',
  },
  {
    id: 'txn-19',
    type: 'Income',
    category: 'Ticket Sales',
    description: "Chattogram - Cox's Bazar ticket sales",
    amount: 59300,
    status: 'completed',
    date: day(6, 15, 20, 45),
    ref: 'TXN-240719',
  },
  {
    id: 'txn-20',
    type: 'Expense',
    category: 'Tolls',
    description: 'Dhaka - Chattogram highway toll',
    amount: 9800,
    status: 'failed',
    date: day(6, 14, 5, 40),
    ref: 'TXN-240720',
  },
  {
    id: 'txn-21',
    type: 'Income',
    category: 'Ticket Sales',
    description: 'Dhaka - Rangpur ticket sales',
    amount: 71400,
    status: 'completed',
    date: day(7, 12, 18, 10),
    ref: 'TXN-240815',
  },
  {
    id: 'txn-22',
    type: 'Expense',
    category: 'Salaries',
    description: 'Driver and helper salaries - August',
    amount: 178000,
    status: 'completed',
    date: day(7, 28, 11, 0),
    ref: 'TXN-240816',
  },
  {
    id: 'txn-23',
    type: 'Income',
    category: 'Parcel Service',
    description: 'Parcel delivery revenue - July',
    amount: 19200,
    status: 'completed',
    date: day(6, 8, 15, 20),
    ref: 'TXN-240721',
  },
  {
    id: 'txn-24',
    type: 'Expense',
    category: 'Fuel',
    description: 'CNG refill - DHK-CITY-2201',
    amount: 26800,
    status: 'completed',
    date: day(6, 5, 7, 15),
    ref: 'TXN-240722',
  },
  {
    id: 'txn-25',
    type: 'Expense',
    category: 'Salaries',
    description: 'Admin and manager salaries - September',
    amount: 142000,
    status: 'completed',
    date: day(8, 27, 11, 30),
    ref: 'TXN-240923',
  },
  {
    id: 'txn-26',
    type: 'Expense',
    category: 'Salaries',
    description: 'Mechanic and conductor salaries - September',
    amount: 118500,
    status: 'pending',
    date: day(8, 30, 10, 0),
    ref: 'TXN-240924',
  },
  {
    id: 'txn-27',
    type: 'Expense',
    category: 'Salaries',
    description: 'Supervisor overtime payout - August',
    amount: 28500,
    status: 'completed',
    date: day(7, 30, 16, 0),
    ref: 'TXN-240817',
  },
  {
    id: 'txn-28',
    type: 'Expense',
    category: 'Salaries',
    description: 'Full staff payroll - July',
    amount: 412000,
    status: 'completed',
    date: day(6, 29, 12, 0),
    ref: 'TXN-240723',
  },
];

// ----------------------------------------------------------------------

const ROLE_BASE_SALARY: Record<string, number> = {
  Admin: 65000,
  Driver: 32000,
  Manager: 55000,
  Helper: 18000,
  Mechanic: 28000,
  Supervisor: 40000,
  Conductor: 22000,
  Other: 20000,
};

const ROLE_DEPARTMENT: Record<string, string> = {
  Admin: 'Operations',
  Driver: 'Fleet',
  Manager: 'Management',
  Helper: 'Fleet',
  Mechanic: 'Workshop',
  Supervisor: 'Operations',
  Conductor: 'Fleet',
  Other: 'Support',
};

const SALARY_STATUSES: IStaffSalaryStatus[] = [
  'paid',
  'paid',
  'paid',
  'pending',
  'processing',
  'paid',
  'paid',
  'pending',
];

export const _staffSalaryList: IStaffSalaryItem[] = _userList.map((user, index) => {
  const baseSalary = ROLE_BASE_SALARY[user.role] ?? 20000;
  const allowance = [2500, 1800, 3200, 1200, 2000, 1500, 2800, 1000][index % 8];
  const deduction = [500, 0, 800, 300, 0, 450, 200, 600][index % 8];
  const status = SALARY_STATUSES[index % SALARY_STATUSES.length];

  return {
    id: `salary-${user.id}`,
    staffId: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    department: ROLE_DEPARTMENT[user.role] ?? 'Support',
    baseSalary,
    allowance,
    deduction,
    netSalary: baseSalary + allowance - deduction,
    status,
    paidAt: status === 'paid' ? day(8, 28 - (index % 5), 11, 0) : null,
    monthLabel: 'September 2026',
  };
});

export const _salaryByRole = Object.entries(
  _staffSalaryList.reduce<Record<string, number>>((acc, item) => {
    acc[item.role] = (acc[item.role] || 0) + item.netSalary;
    return acc;
  }, {})
)
  .map(([label, value]) => ({ label, value }))
  .sort((a, b) => b.value - a.value);

export const _payrollTrend = {
  categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  series: [
    { name: 'Payroll', data: [398000, 405000, 412000, 418000, 425000, 445500] },
    { name: 'Overtime', data: [18000, 22000, 19500, 25000, 21000, 28500] },
  ],
};

export function getTransactionMonthOptions(transactions: ITransactionItem[] = _transactionList) {
  const keys = new Set<string>();

  transactions.forEach((item) => {
    const year = item.date.getFullYear();
    const month = item.date.getMonth();
    keys.add(`${year}-${month}`);
  });

  return Array.from(keys)
    .map((key) => {
      const [year, month] = key.split('-').map(Number);
      const label = new Date(year, month, 1).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      return { value: key, label, year, month };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

export const _walletCards: IWalletCard[] = [
  {
    id: 'wallet-1',
    cardType: 'visa',
    balance: 1284500,
    cardHolder: 'Bus Operations',
    cardNumber: '**** **** **** 4821',
    cardValid: '08/29',
  },
  {
    id: 'wallet-2',
    cardType: 'mastercard',
    balance: 436200,
    cardHolder: 'Fuel and Maintenance',
    cardNumber: '**** **** **** 9034',
    cardValid: '03/28',
  },
];

// Sparkline data (monthly trend) for the Income / Expenses widgets
export const _incomeTrend = [
  { x: 1, y: 88 },
  { x: 2, y: 120 },
  { x: 3, y: 156 },
  { x: 4, y: 123 },
  { x: 5, y: 88 },
  { x: 6, y: 66 },
  { x: 7, y: 95 },
  { x: 8, y: 129 },
  { x: 9, y: 145 },
  { x: 10, y: 188 },
  { x: 11, y: 132 },
  { x: 12, y: 184 },
];

export const _expenseTrend = [
  { x: 1, y: 70 },
  { x: 2, y: 96 },
  { x: 3, y: 110 },
  { x: 4, y: 104 },
  { x: 5, y: 126 },
  { x: 6, y: 98 },
  { x: 7, y: 87 },
  { x: 8, y: 112 },
  { x: 9, y: 99 },
  { x: 10, y: 130 },
  { x: 11, y: 108 },
  { x: 12, y: 121 },
];

// Balance statistics (values are in thousand taka)
export const _balanceStatistics = {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  series: [
    {
      type: 'Week',
      data: [
        { name: 'Income', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
        { name: 'Expenses', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
      ],
    },
    {
      type: 'Month',
      data: [
        { name: 'Income', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
        { name: 'Expenses', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
      ],
    },
    {
      type: 'Year',
      data: [
        { name: 'Income', data: [276, 242, 229, 341, 327, 438, 417, 386, 363] },
        { name: 'Expenses', data: [180, 155, 134, 214, 180, 230, 215, 228, 255] },
      ],
    },
  ],
};
