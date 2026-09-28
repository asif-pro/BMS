import { Outlet } from 'react-router-dom';
import DashboardLayout from '@/layouts/dashboard';

const LayoutTemplate = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default LayoutTemplate;
