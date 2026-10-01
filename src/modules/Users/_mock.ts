import type { IUserItem } from './types';

// ----------------------------------------------------------------------

export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'banned', label: 'Banned' },
  { value: 'rejected', label: 'Rejected' },
];

export const _roles = [
  'Admin',
  'Driver',
  'Manager',
  'Helper',
  'Mechanic',
  'Supervisor',
  'Conductor',
  'Other',
];

const NAMES = [
  'Jayvion Simon',
  'Lucian Obrien',
  'Deja Brady',
  'Harrison Stein',
  'Reece Chung',
  'Lainey Davidson',
  'Cristopher Cardenas',
  'Melanie Noble',
  'Chase Day',
  'Shawn Manning',
  'Soren Durham',
  'Cortez Herring',
  'Brycen Jimenez',
  'Giana Brandt',
  'Aspen Schmitt',
  'Colten Aguilar',
  'Angelique Morse',
  'Selina Boyer',
  'Thaddeus Sykes',
  'Amiah Pruitt',
];

const COMPANIES = [
  'Lueilwitz and Sons',
  'Gleichner, Mueller and Tromp',
  'Nikolaus - Leuschke',
  'Hegmann, Circle and Rogahn',
  'Adams Inc',
  'Wuckert Inc',
  'Jacobson, Lang and Kuhlman',
  'Bayer LLC',
  'Harris Group',
  'Howell - Armstrong',
];

const avatar = (index: number) => `/assets/images/avatar/avatar_${(index % 12) + 1}.jpg`;

export const _userList: IUserItem[] = NAMES.map((name, index) => ({
  id: `user-${index + 1}`,
  zipCode: '85807',
  state: 'Virginia',
  city: 'Rancho Cordova',
  role: _roles[index % _roles.length],
  email: `${name.toLowerCase().replace(/[^a-z]/g, '.')}@example.com`,
  address: '908 Jack Locks',
  name,
  isVerified: index % 2 === 0,
  company: COMPANIES[index % COMPANIES.length],
  country: 'United States',
  avatarUrl: avatar(index),
  phoneNumber: `+1 202-555-${String(1000 + index * 17).slice(0, 4)}`,
  status:
    (index % 2 && 'pending') || (index % 3 && 'banned') || (index % 4 && 'rejected') || 'active',
}));
