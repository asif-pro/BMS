import sumBy from 'lodash/sumBy';

import {
  _payrollTrend as _accountsPayrollTrend,
  _salaryByRole as _accountsSalaryByRole,
  _staffSalaryList,
  _transactionList,
} from '@/mock_data/accounts.mock';
import { _operators } from '@/mock_data/tickets.mock';
import { _userList } from '@/mock_data/users.mock';
import { _vehicles } from '@/mock_data/vehicles.mock';

// ----------------------------------------------------------------------

export const _ridershipChart = {
  labels: [
    '10/01/2025',
    '11/01/2025',
    '12/01/2025',
    '01/01/2026',
    '02/01/2026',
    '03/01/2026',
    '04/01/2026',
    '05/01/2026',
    '06/01/2026',
    '07/01/2026',
    '08/01/2026',
    '09/01/2026',
  ],
  series: [
    {
      name: 'Passengers',
      type: 'column',
      fill: 'solid',
      data: [3820, 4130, 5210, 4680, 4390, 4750, 5120, 5640, 5980, 6120, 5870, 6340],
    },
    {
      name: 'Bookings',
      type: 'area',
      fill: 'gradient',
      data: [3410, 3760, 4720, 4250, 3980, 4310, 4690, 5110, 5470, 5630, 5390, 5810],
    },
    {
      name: 'Cancellations',
      type: 'line',
      fill: 'solid',
      data: [310, 290, 410, 360, 320, 350, 380, 420, 450, 470, 430, 440],
    },
  ],
};

export const _revenueByRoute = [
  { label: 'Dhaka - Chattogram', value: 4344 },
  { label: 'Dhaka - Sylhet', value: 5435 },
  { label: 'Dhaka - Rajshahi', value: 1443 },
  { label: 'Dhaka - Khulna', value: 4443 },
  { label: 'Chattogram - Cox\'s Bazar', value: 2870 },
];

export const _routePerformance = [
  { label: 'Dhaka - Chattogram', value: 4820 },
  { label: 'Dhaka - Sylhet', value: 3960 },
  { label: 'Dhaka - Khulna', value: 3410 },
  { label: 'Dhaka - Rajshahi', value: 2980 },
  { label: 'Chattogram - Cox\'s Bazar', value: 2740 },
  { label: 'Dhaka - Rangpur', value: 2150 },
  { label: 'Sylhet - Chattogram', value: 1620 },
  { label: 'Dhaka - Barishal', value: 1380 },
];

export const _fleetHealth = {
  categories: [
    'Fuel Efficiency',
    'Punctuality',
    'Occupancy',
    'Maintenance',
    'Safety',
    'Comfort',
  ],
  series: [
    { name: 'This month', data: [80, 92, 74, 66, 88, 78] },
    { name: 'Last month', data: [72, 86, 70, 58, 84, 74] },
    { name: 'Target', data: [85, 90, 80, 80, 90, 85] },
  ],
};

export const _sparklines = {
  passengers: [5120, 5640, 5980, 6120, 5870, 6340, 6210, 6480],
  revenue: [2.4, 2.9, 3.1, 3.4, 3.2, 3.8, 3.6, 4.1],
  utilization: [78, 81, 83, 80, 85, 86, 84, 87],
  onTime: [88, 90, 87, 91, 92, 90, 93, 94],
};

// ----------------------------------------------------------------------

const brandCounts = _vehicles.reduce<Record<string, { label: string; value: number; logo: string }>>(
  (acc, vehicle) => {
    if (!acc[vehicle.brand]) {
      acc[vehicle.brand] = {
        label: vehicle.brand,
        value: 0,
        logo: vehicle.brandLogoUrl,
      };
    }
    acc[vehicle.brand].value += 1;
    return acc;
  },
  {}
);

export const _fleetByBrand = Object.values(brandCounts);

export const _brandPerformance = _fleetByBrand.map((brand, index) => ({
  label: brand.label,
  value: [92, 88, 84, 79, 74, 71][index % 6],
}));

export const _topDrivers = _operators.slice(0, 5).map((driver, index) => ({
  id: driver.id,
  name: driver.name,
  avatarUrl: driver.avatarUrl,
  route: [
    'Dhaka - Chattogram',
    'Dhaka - Sylhet',
    "Dhaka - Cox's Bazar",
    'Dhaka - Rajshahi',
    'Dhaka - Khulna',
  ][index],
  trips: [148, 136, 124, 118, 109][index],
  rating: [4.9, 4.8, 4.7, 4.6, 4.5][index],
  revenue: [486000, 452000, 418000, 392000, 361000][index],
  rank: `Top ${index + 1}`,
}));

const staffRoleCounts = _userList.reduce<Record<string, number>>((acc, user) => {
  acc[user.role] = (acc[user.role] || 0) + 1;
  return acc;
}, {});

export const _staffByRole = Object.entries(staffRoleCounts).map(([label, value]) => ({
  label,
  value,
}));

export const _topStaff = _userList
  .filter((user) => user.role !== 'Driver')
  .slice(0, 5)
  .map((user, index) => ({
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    score: [984, 912, 876, 841, 798][index],
  }));

export const _salaryByRole = _accountsSalaryByRole;

export const _payrollTrend = _accountsPayrollTrend;

export const _payrollTotal = _staffSalaryList.reduce((sum, item) => sum + item.netSalary, 0);

const completedExpenses = _transactionList.filter(
  (item) => item.type === 'Expense' && item.status === 'completed'
);

export const _totalExpenseAmount = sumBy(completedExpenses, 'amount');

const ledgerSalaryExpense = sumBy(
  completedExpenses.filter((item) => item.category === 'Salaries'),
  'amount'
);

// Use ledger salary spend for expense share; fall back to payroll roster total
export const _salaryExpenseAmount = ledgerSalaryExpense || _payrollTotal;

export const _salaryExpensePercent = _totalExpenseAmount
  ? (_salaryExpenseAmount / _totalExpenseAmount) * 100
  : 0;

const rolePayrollTotal = sumBy(_accountsSalaryByRole, 'value') || 1;

// Distribute salary expense across roles using roster weights
export const _salaryExpenseByRole = _accountsSalaryByRole.map((item) => {
  const value = (_salaryExpenseAmount * item.value) / rolePayrollTotal;

  return {
    label: `${item.label} Salary`,
    value: Math.round(value),
    percent: _totalExpenseAmount ? (value / _totalExpenseAmount) * 100 : 0,
  };
});
