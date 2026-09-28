import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import LayoutTemplate from '../components/LayoutTemplate/LayoutTemplate';
import PageHeading from '@/components/page-heading/PageHeading';
import Dashboard from '@/modules/Dashboard/Dashboard';
import Settings from '@/modules/Settings/Settings';
import Tickets from '@/modules/Tickets/Tickets';
import TicketDetails from '@/modules/Tickets/ticket-details';
import { paths } from './paths';

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutTemplate />,
      children: [
        { index: true, element: <Navigate to={paths.dashboard.root} replace /> },
        { path: 'dashboard', element: <Dashboard /> },
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
        { path: 'tickets', element: <PageHeading title="Tickets" /> },
        { path: 'bookings', element: <PageHeading title="Bookings" /> },
        {
          path: 'vehicles',
          element: <Outlet />,
          children: [
            { index: true, element: <Navigate to="layout" replace /> },
            { path: 'layout', element: <PageHeading title="Layout" /> },
            { path: 'maintenance', element: <PageHeading title="Maintenance" /> },
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
