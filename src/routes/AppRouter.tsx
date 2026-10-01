import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import LayoutTemplate from '../components/LayoutTemplate/LayoutTemplate';
import PageHeading from '@/components/page-heading/PageHeading';
import Dashboard from '@/modules/Dashboard/Dashboard';
import Settings from '@/modules/Settings/Settings';
import Tickets from '@/modules/Tickets/Tickets';
import TicketDetails from '@/modules/Tickets/ticket-details';
import TripCreateView from '@/modules/Tickets/trip-create-view';
import QuickTicketView from '@/modules/Tickets/quick-ticket-view';
import VehicleListView from '@/modules/Vehicles/vehicle-list-view';
import VehicleCreateView from '@/modules/Vehicles/vehicle-create-view';
import VehicleLayoutView from '@/modules/Vehicles/vehicle-layout-view';
import VehicleLayoutDetailsView from '@/modules/Vehicles/vehicle-layout-details-view';
import UserListView from '@/modules/Users/user-list-view';
import UserCreateView from '@/modules/Users/user-create-view';
import UserDetailsView from '@/modules/Users/user-details-view';
import CustomerListView from '@/modules/Customers/customer-list-view';
import CustomerDetailsView from '@/modules/Customers/customer-details-view';
import BookingListView from '@/modules/Bookings/booking-list-view';
import AnalyticsView from '@/modules/Analytics/analytics-view';
import AccountsView from '@/modules/Accounts/accounts-view';
import MaintenanceListView from '@/modules/Maintenance/maintenance-list-view';
import OrganizationListView from '@/modules/Organizations/organization-list-view';
import { paths } from './paths';

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutTemplate />,
      children: [
        { index: true, element: <Navigate to={paths.dashboard.root} replace /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'dashboard/trips/create', element: <TripCreateView /> },
        { path: 'dashboard/staff', element: <Navigate to={paths.dashboard.user.list} replace /> },
        { path: 'dashboard/staff/list', element: <UserListView /> },
        { path: 'dashboard/staff/new', element: <UserCreateView /> },
        { path: 'dashboard/user/list', element: <Navigate to={paths.dashboard.user.list} replace /> },
        { path: 'dashboard/user/new', element: <Navigate to={paths.dashboard.user.new} replace /> },
        {
          path: 'dashboard/staff/:id/edit',
          element: <UserDetailsView />,
        },
        { path: 'dashboard/staff/:id', element: <UserDetailsView /> },
        { path: 'analytics', element: <AnalyticsView /> },
        { path: 'accounts', element: <AccountsView /> },
        {
          path: 'trips',
          element: <Outlet />,
          children: [
            { index: true, element: <Tickets /> },
            { path: 'schedule', element: <PageHeading title="SCHEDULE" /> },
            { path: 'routes', element: <PageHeading title="ROUTES" /> },
            { path: ':id/edit', element: <PageHeading title="EDIT_TICKET" /> },
            { path: ':id', element: <TicketDetails /> },
          ],
        },
        {
          path: 'tickets',
          element: <Outlet />,
          children: [
            { index: true, element: <Navigate to="quick" replace /> },
            { path: 'quick', element: <QuickTicketView /> },
          ],
        },
        { path: 'bookings', element: <BookingListView /> },
        {
          path: 'vehicles',
          element: <Outlet />,
          children: [
            { index: true, element: <Navigate to="list" replace /> },
            { path: 'list', element: <VehicleListView /> },
            { path: 'new', element: <VehicleCreateView /> },
            { path: 'layout', element: <VehicleLayoutView /> },
            { path: 'layout/:layoutId', element: <VehicleLayoutDetailsView /> },
            { path: 'maintenance', element: <MaintenanceListView /> },
            { path: ':id/edit', element: <VehicleCreateView /> },
            { path: ':id', element: <VehicleCreateView /> },
          ],
        },
        { path: 'terminals', element: <PageHeading title="TERMINALS" /> },
        {
          path: 'customers',
          element: <Outlet />,
          children: [
            { index: true, element: <CustomerListView /> },
            { path: ':id', element: <CustomerDetailsView /> },
          ],
        },
        {
          path: 'users',
          element: <Outlet />,
          children: [
            { index: true, element: <Navigate to={paths.dashboard.user.list} replace /> },
            { path: 'staff', element: <Navigate to={paths.dashboard.user.list} replace /> },
          ],
        },
        { path: 'organizations', element: <OrganizationListView /> },
        { path: 'settings', element: <Settings /> },
        { path: 'report', element: <PageHeading title="REPORT" /> },
        { path: 'help', element: <PageHeading title="HELP_AND_SUPPORT" /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
