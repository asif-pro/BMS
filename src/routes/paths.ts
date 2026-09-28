// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://minimals.cc',
  dashboard: {
    root: ROOTS.DASHBOARD,
    analytics: '/analytics',
    accounts: '/accounts',
    trips: {
      root: '/trips',
      schedule: '/trips/schedule',
      routes: '/trips/routes',
    },
    tickets: '/tickets',
    bookings: '/bookings',
    vehicles: {
      root: '/vehicles',
      layout: '/vehicles/layout',
      maintenance: '/vehicles/maintenance',
    },
    terminals: '/terminals',
    customers: '/customers',
    users: {
      root: '/users',
      staff: '/users/staff',
    },
    settings: '/settings',
    report: '/report',
    help: '/help',
    user: {
      profile: '/settings',
      account: '/settings',
    },
  },
};
