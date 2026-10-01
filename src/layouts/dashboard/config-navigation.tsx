import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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
  fleet: icon('ic_fleet'),
  terminals: icon('ic_folder'),
  customers: icon('ic_user'),
  users: icon('ic_users'),
  organizations: icon('ic_job'),
  settings: icon('ic_menu_item'),
  report: icon('ic_file'),
  help: icon('ic_chat'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslation('index');

  const data = useMemo(
    () => [
      {
        items: [
          {
            title: t('NAV_DASHBOARD'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('NAV_ANALYTICS'),
            path: paths.dashboard.analytics,
            icon: ICONS.analytics,
          },
          {
            title: t('NAV_ACCOUNTS'),
            path: paths.dashboard.accounts,
            icon: ICONS.accounts,
          },
          {
            title: t('NAV_TRIPS'),
            path: paths.dashboard.trips.root,
            icon: ICONS.trips,
          },
          {
            title: t('NAV_TICKETS'),
            path: paths.dashboard.tickets.root,
            icon: ICONS.tickets,
            children: [{ title: t('NAV_QUICK_TICKET'), path: paths.dashboard.tickets.quick }],
          },
          {
            title: t('NAV_BOOKINGS'),
            path: paths.dashboard.bookings,
            icon: ICONS.bookings,
          },
          {
            title: t('NAV_FLEET'),
            path: paths.dashboard.vehicles.root,
            icon: ICONS.fleet,
            children: [
              { title: t('NAV_VEHICLES'), path: paths.dashboard.vehicles.list },
              { title: t('NAV_LAYOUT'), path: paths.dashboard.vehicles.layout },
              { title: t('NAV_MAINTENANCE'), path: paths.dashboard.vehicles.maintenance },
            ],
          },
          {
            title: t('NAV_TERMINALS'),
            path: paths.dashboard.terminals,
            icon: ICONS.terminals,
          },
          {
            title: t('NAV_CUSTOMERS'),
            path: paths.dashboard.customers.root,
            icon: ICONS.customers,
          },
          {
            title: t('NAV_USER_MANAGEMENT'),
            path: paths.dashboard.users.root,
            icon: ICONS.users,
            children: [
              { title: t('NAV_ALL_STAFF'), path: paths.dashboard.user.list },
              { title: t('NAV_ADD_STAFF'), path: paths.dashboard.user.new },
            ],
          },
          {
            title: t('NAV_ORGANIZATIONS'),
            path: paths.dashboard.organizations,
            icon: ICONS.organizations,
          },
          {
            title: t('NAV_SETTINGS'),
            path: paths.dashboard.settings,
            icon: ICONS.settings,
          },
          {
            title: t('NAV_REPORT'),
            path: paths.dashboard.report,
            icon: ICONS.report,
          },
          {
            title: t('NAV_HELP_AND_SUPPORT'),
            path: paths.dashboard.help,
            icon: ICONS.help,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
