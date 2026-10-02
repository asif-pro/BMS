import Container from '@mui/material/Container';

import { paths } from '@/routes/paths';

import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import OrganizationNewEditForm from './organization-new-edit-form';

// ----------------------------------------------------------------------

export default function OrganizationCreateView() {
  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="NEW_ORGANIZATION"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_ORGANIZATIONS', href: paths.dashboard.organizations.root },
          { name: 'NEW_ORGANIZATION' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OrganizationNewEditForm />
    </Container>
  );
}
