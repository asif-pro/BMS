import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from '@/routes/paths';

import Iconify from '@/components/iconify';
import EmptyContent from '@/components/empty-content';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import { _userList } from './_mock';
import UserNewEditForm from './user-new-edit-form';

// ----------------------------------------------------------------------

export default function UserDetailsView() {
  const { t } = useTranslation('index');
  const { id = '' } = useParams();

  const currentUser = useMemo(() => _userList.find((user) => user.id === id), [id]);

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(false);
  }, [currentUser?.id]);

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading={currentUser?.name || 'STAFF_DETAILS'}
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_USER', href: paths.dashboard.user.root },
          { name: currentUser?.name || 'STAFF_DETAILS' },
        ]}
        action={
          currentUser && !editing ? (
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={() => setEditing(true)}
            >
              {t('EDIT_INFO')}
            </Button>
          ) : undefined
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentUser ? (
        <UserNewEditForm
          key={`${currentUser.id}-${editing ? 'edit' : 'view'}`}
          currentUser={currentUser}
          readOnly={!editing}
          onCancelEdit={() => setEditing(false)}
          onSaveSuccess={() => setEditing(false)}
        />
      ) : (
        <EmptyContent title="NO_DATA" filled sx={{ py: 10 }} />
      )}
    </Container>
  );
}
