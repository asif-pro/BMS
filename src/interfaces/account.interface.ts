export type ITransactionType = 'Income' | 'Expense';

export type ITransactionStatus = 'completed' | 'pending' | 'failed';

export type ITransactionCategory =
  | 'Ticket Sales'
  | 'Charter'
  | 'Parcel Service'
  | 'Fuel'
  | 'Maintenance'
  | 'Salaries'
  | 'Insurance'
  | 'Tolls'
  | 'Parts'
  | 'Other';

export type ITransactionItem = {
  id: string;
  type: ITransactionType;
  category: ITransactionCategory;
  description: string;
  amount: number;
  status: ITransactionStatus;
  date: Date;
  ref: string;
};

export type ITransactionFilterValue = string;

export type ITransactionFilters = {
  name: string;
  type: 'all' | ITransactionType;
  status: 'all' | ITransactionStatus;
};

export type IWalletCard = {
  id: string;
  cardType: 'mastercard' | 'visa';
  balance: number;
  cardHolder: string;
  cardNumber: string;
  cardValid: string;
};

export type IAccountChartPoint = {
  x: number;
  y: number;
};

export type IStaffSalaryStatus = 'paid' | 'pending' | 'processing';

export type IStaffSalaryItem = {
  id: string;
  staffId: string;
  name: string;
  avatarUrl: string;
  role: string;
  department: string;
  baseSalary: number;
  allowance: number;
  deduction: number;
  netSalary: number;
  status: IStaffSalaryStatus;
  paidAt: Date | null;
  monthLabel: string;
};
