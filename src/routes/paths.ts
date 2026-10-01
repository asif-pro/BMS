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
      create: '/dashboard/trips/create',
      schedule: '/trips/schedule',
      routes: '/trips/routes',
    },
    tickets: {
      root: '/tickets',
      quick: '/tickets/quick',
    },
    bookings: '/bookings',
    vehicles: {
      root: '/vehicles',
      list: '/vehicles/list',
      create: '/vehicles/new',
      details: (id: string) => `/vehicles/${id}`,
      edit: (id: string) => `/vehicles/${id}/edit`,
      layout: '/vehicles/layout',
      layoutDetails: (slug: string) => `/vehicles/layout/${slug}`,
      maintenance: '/vehicles/maintenance',
    },
    terminals: '/terminals',
    customers: '/customers',
    users: {
      root: '/dashboard/staff',
      staff: '/dashboard/staff/list',
      list: '/dashboard/staff/list',
    },
    settings: '/settings',
    report: '/report',
    help: '/help',
    user: {
      root: '/dashboard/staff',
      list: '/dashboard/staff/list',
      new: '/dashboard/staff/new',
      edit: (id: string) => `/dashboard/staff/${id}/edit`,
      profile: '/settings',
      account: '/settings',
    },
  },
};
