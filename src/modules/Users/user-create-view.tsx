import Container from '@mui/material/Container';

import { paths } from '@/routes/paths';

import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import UserNewEditForm from './user-new-edit-form';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="CREATE_A_NEW_STAFF"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_USER', href: paths.dashboard.user.root },
          { name: 'NEW_STAFF' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm />
    </Container>
  );
}
