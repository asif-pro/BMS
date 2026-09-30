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
        { path: 'analytics', element: <PageHeading title="Analytics" /> },
        { path: 'accounts', element: <PageHeading title="Accounts" /> },
        {
          path: 'trips',
          element: <Outlet />,
          children: [
            { index: true, element: <Tickets /> },
            { path: 'schedule', element: <PageHeading title="Schedule" /> },
            { path: 'routes', element: <PageHeading title="Routes" /> },
            { path: ':id/edit', element: <PageHeading title="Edit ticket" /> },
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
        { path: 'bookings', element: <PageHeading title="Bookings" /> },
        {
          path: 'vehicles',
          element: <Outlet />,
          children: [
            { index: true, element: <Navigate to="list" replace /> },
            { path: 'list', element: <VehicleListView /> },
            { path: 'new', element: <VehicleCreateView /> },
            { path: 'layout', element: <VehicleLayoutView /> },
            { path: 'layout/:layoutId', element: <VehicleLayoutDetailsView /> },
            { path: 'maintenance', element: <PageHeading title="Maintenance" /> },
            { path: ':id/edit', element: <VehicleCreateView /> },
            { path: ':id', element: <VehicleCreateView /> },
          ],
        },
        { path: 'terminals', element: <PageHeading title="Terminals" /> },
        { path: 'customers', element: <PageHeading title="Customers" /> },
        {
          path: 'users',
          element: <Outlet />,
          children: [
            { index: true, element: <Navigate to="staff" replace /> },
            { path: 'staff', element: <PageHeading title="Staff" /> },
          ],
        },
        { path: 'settings', element: <Settings /> },
        { path: 'report', element: <PageHeading title="Report" /> },
        { path: 'help', element: <PageHeading title="Help and support" /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
