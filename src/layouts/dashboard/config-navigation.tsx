import { useMemo } from 'react';

import { paths } from '@/routes/paths';

import SvgColor from '@/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  dashboard: icon('ic_dashboard'),
  analytics: icon('ic_analytics'),
  accounts: icon('ic_banking'),
  trips: icon('ic_calendar'),
  tickets: icon('ic_invoice'),
  bookings: icon('ic_booking'),
  vehicles: icon('ic_tour'),
  terminals: icon('ic_folder'),
  customers: icon('ic_user'),
  users: icon('ic_lock'),
  settings: icon('ic_menu_item'),
  report: icon('ic_file'),
  help: icon('ic_chat'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      {
        items: [
          {
            title: 'Dashboard',
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: 'Analytics',
            path: paths.dashboard.analytics,
            icon: ICONS.analytics,
          },
          {
            title: 'Accounts',
            path: paths.dashboard.accounts,
            icon: ICONS.accounts,
          },
          {
            title: 'Trips',
            path: paths.dashboard.trips.root,
            icon: ICONS.trips,
          },
          {
            title: 'Tickets',
            path: paths.dashboard.tickets,
            icon: ICONS.tickets,
          },
          {
            title: 'Bookings',
            path: paths.dashboard.bookings,
            icon: ICONS.bookings,
          },
          {
            title: 'Vehicles',
            path: paths.dashboard.vehicles.root,
            icon: ICONS.vehicles,
            children: [
              { title: 'Layout', path: paths.dashboard.vehicles.layout },
              { title: 'Maintenance', path: paths.dashboard.vehicles.maintenance },
            ],
          },
          {
            title: 'Terminals',
            path: paths.dashboard.terminals,
            icon: ICONS.terminals,
          },
          {
            title: 'Customers',
            path: paths.dashboard.customers,
            icon: ICONS.customers,
          },
          {
            title: 'User management',
            path: paths.dashboard.users.root,
            icon: ICONS.users,
            children: [{ title: 'Staff', path: paths.dashboard.users.staff }],
          },
          {
            title: 'Settings',
            path: paths.dashboard.settings,
            icon: ICONS.settings,
          },
          {
            title: 'Report',
            path: paths.dashboard.report,
            icon: ICONS.report,
          },
          {
            title: 'Help and support',
            path: paths.dashboard.help,
            icon: ICONS.help,
          },
        ],
      },
    ],
    []
  );

  return data;
}
