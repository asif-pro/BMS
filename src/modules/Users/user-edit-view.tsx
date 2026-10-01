import { useParams } from 'react-router-dom';

import Container from '@mui/material/Container';

import { paths } from '@/routes/paths';

import EmptyContent from '@/components/empty-content';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import { _userList } from './_mock';
import UserNewEditForm from './user-new-edit-form';

// ----------------------------------------------------------------------

export default function UserEditView() {
  const { id = '' } = useParams();

  const currentUser = _userList.find((user) => user.id === id);

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="EDIT_STAFF"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_USER', href: paths.dashboard.user.root },
          { name: currentUser?.name || 'EDIT_STAFF' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentUser ? (
        <UserNewEditForm key={currentUser.id} currentUser={currentUser} />
      ) : (
        <EmptyContent title="NO_DATA" filled sx={{ py: 10 }} />
      )}
    </Container>
  );
}
