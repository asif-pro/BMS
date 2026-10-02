import { subDays } from 'date-fns';

import {
  ORGANIZATION_CATEGORY_OPTIONS,
  ORGANIZATION_LOCATIONS,
  ORGANIZATION_SERVICE_OPTIONS,
  ORGANIZATION_SIZE_OPTIONS,
  ORGANIZATION_SUBSCRIPTION_PLANS,
} from '@/constants/organization.constant';
import { VEHICLE_BRANDS } from '@/constants/vehicle.constant';
import type {
  IOrganizationItem,
  IOrganizationPaymentMethod,
  IOrganizationStatus,
  IOrganizationTransaction,
  IOrganizationTransactionCategory,
  IOrganizationTransactionStatus,
  IOrganizationUserAccount,
  IOrganizationUserAccountStatus,
} from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

const ORG_NAMES = [
  'Green Line Paribahan',
  'Shohag Enterprise',
  'Hanif Enterprise',
  'Eagle Paribahan',
  'Saudia Coach',
  'TR Travels',
  'Desh Travels',
  'Saintmartin Hyundai',
  'Shyamoli NR Travels',
  'S. Alam Service',
  'Unique Service',
  'Ena Transport',
];

const CONTACT_NAMES = [
  'Nusrat Jahan',
  'Rahim Uddin',
  'Farhana Akter',
  'Imran Hossain',
  'Sadia Rahman',
  'Tanvir Ahmed',
];

const CONTACTS = CONTACT_NAMES.map((name, index) => ({
  id: `org-contact-${index + 1}`,
  name,
  role: ['Manager', 'Supervisor', 'Counter Lead', 'Coordinator'][index % 4],
  avatarUrl: `/assets/images/avatar/avatar_${(index % 12) + 1}.jpg`,
}));

export const _organizations: IOrganizationItem[] = ORG_NAMES.map((title, index) => {
  const brand = VEHICLE_BRANDS[index % VEHICLE_BRANDS.length];
  const size =
    ORGANIZATION_SIZE_OPTIONS.map((option) => option.label)[index % ORGANIZATION_SIZE_OPTIONS.length];
  const partnershipTypes =
    (index % 2 && ['Partner']) ||
    (index % 3 && ['Franchise']) ||
    (index % 4 && ['Affiliate']) || ['Owned'];
  const statuses: IOrganizationStatus[] = [
    'active',
    'active',
    'payment_pending',
    'active',
    'suspended',
    'inactive',
  ];
  const status = statuses[index % statuses.length];

  return {
    id: `org-${index + 1}`,
    title,
    category: ORGANIZATION_CATEGORY_OPTIONS[index % ORGANIZATION_CATEGORY_OPTIONS.length],
    content: `${title} partner organization for bus operations and counter sales.`,
    publish: index % 3 ? 'published' : 'draft',
    createdAt: subDays(new Date(), index + 2),
    expiredDate: subDays(new Date(), -(30 - index)),
    skills: ['Ticketing', 'Fleet ops', 'Counter'],
    totalViews: 1200 + index * 137,
    size,
    vehicleCount: 12 + index * 7 + (index % 5) * 3,
    ticketsSold: 4800 + index * 1250 + (index % 4) * 340,
    staffCount: 18 + index * 4 + (index % 3) * 2,
    totalEarned: 1850000 + index * 425000 + (index % 6) * 87500,
    totalPaid: 45000 + index * 18500 + (index % 4) * 7500,
    subscriptionPlan:
      ORGANIZATION_SUBSCRIPTION_PLANS[index % ORGANIZATION_SUBSCRIPTION_PLANS.length],
    status,
    fee: {
      type: index % 2 ? 'Monthly' : 'Commission',
      price: 45000 + index * 8500,
      negotiable: index % 3 === 0,
    },
    services: ORGANIZATION_SERVICE_OPTIONS.slice(0, 3 + (index % 3)).map((option) => option.label),
    locations: ORGANIZATION_LOCATIONS.slice(0, 2 + (index % 4)),
    company: {
      name: title,
      logo: brand.logo,
      phoneNumber: `+880 17${(10000000 + index * 137).toString().slice(0, 8)}`,
      fullAddress: `${ORGANIZATION_LOCATIONS[index % ORGANIZATION_LOCATIONS.length]}, Bangladesh`,
    },
    partnershipTypes,
    workingSchedule: ['Monday to Sunday', 'Counter 6am - 11pm'],
    contacts: CONTACTS.slice(0, 3 + (index % 3)),
  };
});

// ----------------------------------------------------------------------

const ORG_USER_NAMES = [
  'Karim Hasan',
  'Nusrat Jahan',
  'Rahim Uddin',
  'Farhana Akter',
  'Imran Hossain',
  'Sadia Rahman',
  'Tanvir Ahmed',
  'Mehedi Alam',
  'Ruma Begum',
  'Shafiq Islam',
];

const ORG_USER_ROLES = [
  'Admin',
  'Manager',
  'Supervisor',
  'Counter Lead',
  'Operator',
  'Coordinator',
];

const ORG_USER_STATUSES: IOrganizationUserAccountStatus[] = [
  'active',
  'active',
  'inactive',
  'suspended',
  'active',
];

export const _organizationUserAccounts: IOrganizationUserAccount[] = _organizations.flatMap(
  (organization, orgIndex) => {
    const count = 4 + (orgIndex % 3);

    return Array.from({ length: count }, (_, userIndex) => {
      const globalIndex = orgIndex * 6 + userIndex;

      return {
        id: `${organization.id}-user-${userIndex + 1}`,
        organizationId: organization.id,
        name: ORG_USER_NAMES[globalIndex % ORG_USER_NAMES.length],
        role: ORG_USER_ROLES[globalIndex % ORG_USER_ROLES.length],
        status: ORG_USER_STATUSES[globalIndex % ORG_USER_STATUSES.length],
        avatarUrl: `/assets/images/avatar/avatar_${(globalIndex % 24) + 1}.jpg`,
      };
    });
  }
);

// ----------------------------------------------------------------------

const ORG_TXN_CATEGORIES: IOrganizationTransactionCategory[] = [
  'Subscription',
  'Commission',
  'Settlement',
  'Setup Fee',
  'Penalty',
];

const ORG_TXN_STATUSES: IOrganizationTransactionStatus[] = [
  'completed',
  'completed',
  'pending',
  'completed',
  'failed',
];

const ORG_TXN_DESCRIPTIONS: Record<IOrganizationTransactionCategory, string> = {
  Subscription: 'Monthly subscription payment',
  Commission: 'Platform commission settlement',
  Settlement: 'Ticket sales settlement payment',
  'Setup Fee': 'Organization onboarding setup fee',
  Penalty: 'Late payment penalty',
};

const ORG_PAYMENT_METHODS: IOrganizationPaymentMethod[] = [
  'Bank Transfer',
  'bKash',
  'Nagad',
  'Card',
  'Cash',
];

export const _organizationTransactions: IOrganizationTransaction[] = _organizations.flatMap(
  (organization, orgIndex) => {
    const count = 5 + (orgIndex % 4);

    return Array.from({ length: count }, (_, txnIndex) => {
      const globalIndex = orgIndex * 7 + txnIndex;
      const category = ORG_TXN_CATEGORIES[globalIndex % ORG_TXN_CATEGORIES.length];
      const baseAmount =
        category === 'Subscription'
          ? 15000
          : category === 'Setup Fee'
            ? 25000
            : category === 'Penalty'
              ? 3500
              : 45000;

      return {
        id: `${organization.id}-txn-${txnIndex + 1}`,
        organizationId: organization.id,
        category,
        description: `${ORG_TXN_DESCRIPTIONS[category]} - ${organization.title}`,
        amount: baseAmount + orgIndex * 2500 + txnIndex * 1750,
        status: ORG_TXN_STATUSES[globalIndex % ORG_TXN_STATUSES.length],
        date: subDays(new Date(), txnIndex * 7 + (orgIndex % 5) + 1),
        ref: `ORG-${organization.id.toUpperCase()}-${1000 + txnIndex}`,
        paymentMethod: ORG_PAYMENT_METHODS[globalIndex % ORG_PAYMENT_METHODS.length],
        invoiceNumber: `INV-${organization.id.toUpperCase()}-${2400 + txnIndex}`,
      };
    });
  }
);
