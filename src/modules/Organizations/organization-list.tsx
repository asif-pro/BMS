import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { useSnackbar } from '@/components/snackbar';

import OrganizationItem from './organization-item';
import type { IOrganizationItem } from './types';

// ----------------------------------------------------------------------

type Props = {
  organizations: IOrganizationItem[];
};

export default function OrganizationList({ organizations }: Props) {
  const { t } = useTranslation('index');
  const { enqueueSnackbar } = useSnackbar();

  const handleView = useCallback(
    (id: string) => {
      enqueueSnackbar(t('VIEW_ORGANIZATION', { id }));
    },
    [enqueueSnackbar, t]
  );

  const handleEdit = useCallback(
    (id: string) => {
      enqueueSnackbar(t('EDIT_ORGANIZATION', { id }));
    },
    [enqueueSnackbar, t]
  );

  const handleDelete = useCallback(
    (id: string) => {
      enqueueSnackbar(t('DELETE_ORGANIZATION', { id }), { variant: 'warning' });
    },
    [enqueueSnackbar, t]
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {organizations.map((organization) => (
          <OrganizationItem
            key={organization.id}
            organization={organization}
            onView={() => handleView(organization.id)}
            onEdit={() => handleEdit(organization.id)}
            onDelete={() => handleDelete(organization.id)}
          />
        ))}
      </Box>

      {organizations.length > 8 && (
        <Pagination
          count={Math.ceil(organizations.length / 8)}
          sx={{
            mt: 3,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
