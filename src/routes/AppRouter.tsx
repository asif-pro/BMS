import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import LayoutTemplate from '../components/LayoutTemplate/LayoutTemplate';
import Dashboard from '@/modules/Dashboard/Dashboard';
import Settings from '@/modules/Settings/Settings';

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutTemplate />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
