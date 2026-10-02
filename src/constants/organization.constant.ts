export const ORGANIZATION_CATEGORY_OPTIONS = [
  'Intercity',
  'Local',
  'Coastal',
  'Corporate',
  'Parcel',
  'Charter',
  'Night Coach',
  'Express',
];

export const ORGANIZATION_PARTNERSHIP_OPTIONS = [
  { value: 'Owned', label: 'Owned' },
  { value: 'Partner', label: 'Partner' },
  { value: 'Franchise', label: 'Franchise' },
  { value: 'Affiliate', label: 'Affiliate' },
];

export const ORGANIZATION_SIZE_OPTIONS = [
  { value: 'Small fleet', label: 'Small fleet' },
  { value: 'Medium fleet', label: 'Medium fleet' },
  { value: 'Large fleet', label: 'Large fleet' },
  { value: 'Enterprise', label: 'Enterprise' },
];

export const ORGANIZATION_SERVICE_OPTIONS = [
  { value: 'AC coaches', label: 'AC coaches' },
  { value: 'Online booking', label: 'Online booking' },
  { value: 'Parcel desk', label: 'Parcel desk' },
  { value: 'Night service', label: 'Night service' },
  { value: 'Wi-Fi onboard', label: 'Wi-Fi onboard' },
  { value: 'Counter support', label: 'Counter support' },
  { value: 'Priority boarding', label: 'Priority boarding' },
  { value: 'Maintenance support', label: 'Maintenance support' },
];


export const ORGANIZATION_LOCATIONS = [
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  "Cox's Bazar",
  'Rangpur',
  'Barishal',
  'Cumilla',
  'Bogura',
];

export const ORGANIZATION_SUBSCRIPTION_PLANS = [
  'Basic',
  'Standard',
  'Premium',
  'Enterprise',
];

export const ORGANIZATION_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'payment_pending', label: 'Payment Pending' },
] as const;

export const ORGANIZATION_STATUS_COLORS: Record<
  (typeof ORGANIZATION_STATUS_OPTIONS)[number]['value'],
  'success' | 'default' | 'error' | 'warning'
> = {
  active: 'success',
  inactive: 'default',
  suspended: 'error',
  payment_pending: 'warning',
};

export const ORGANIZATION_STATUS_LABEL_KEYS: Record<
  (typeof ORGANIZATION_STATUS_OPTIONS)[number]['value'],
  string
> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  suspended: 'SUSPENDED',
  payment_pending: 'PAYMENT_PENDING',
};
