export type IOrganizationFilterValue = string | string[];

export type IOrganizationFilters = {
  status: string;
  subscriptionPlans: string[];
};

export type IOrganizationContact = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IOrganizationUserAccountStatus = 'active' | 'inactive' | 'suspended';

export type IOrganizationUserAccount = {
  id: string;
  organizationId: string;
  name: string;
  role: string;
  status: IOrganizationUserAccountStatus;
  avatarUrl: string;
};

export type IOrganizationTransactionStatus = 'completed' | 'pending' | 'failed';

export type IOrganizationTransactionCategory =
  | 'Subscription'
  | 'Commission'
  | 'Settlement'
  | 'Setup Fee'
  | 'Penalty';

export type IOrganizationPaymentMethod =
  | 'Bank Transfer'
  | 'bKash'
  | 'Nagad'
  | 'Card'
  | 'Cash';

export type IOrganizationTransaction = {
  id: string;
  organizationId: string;
  category: IOrganizationTransactionCategory;
  description: string;
  amount: number;
  status: IOrganizationTransactionStatus;
  date: Date;
  ref: string;
  paymentMethod: IOrganizationPaymentMethod;
  invoiceNumber: string;
};

export type IOrganizationCompany = {
  name: string;
  logo: string;
  phoneNumber: string;
  fullAddress: string;
};

export type IOrganizationFee = {
  type: string;
  price: number;
  negotiable: boolean;
};

export type IOrganizationStatus = 'active' | 'inactive' | 'suspended' | 'payment_pending';

export type IOrganizationItem = {
  id: string;
  category: string;
  title: string;
  content: string;
  publish: string;
  createdAt: Date;
  skills: string[];
  expiredDate: Date;
  totalViews: number;
  size: string;
  vehicleCount: number;
  ticketsSold: number;
  staffCount: number;
  totalEarned: number;
  totalPaid: number;
  subscriptionPlan: string;
  status: IOrganizationStatus;
  fee: IOrganizationFee;
  services: string[];
  locations: string[];
  company: IOrganizationCompany;
  partnershipTypes: string[];
  workingSchedule: string[];
  contacts: IOrganizationContact[];
};
