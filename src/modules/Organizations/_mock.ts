import { subDays } from 'date-fns';

import { VEHICLE_BRANDS } from '@/modules/Vehicles/_mock';

import type { IOrganizationItem } from './types';

// ----------------------------------------------------------------------

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

export const ORGANIZATION_SORT_OPTIONS = [
  { value: 'latest', labelKey: 'LATEST' },
  { value: 'popular', labelKey: 'POPULAR' },
  { value: 'oldest', labelKey: 'OLDEST' },
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
