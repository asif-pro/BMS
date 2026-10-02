import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import OrganizationItem from './organization-item';
import type { IOrganizationItem } from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

type Props = {
  organizations: IOrganizationItem[];
};

export default function OrganizationList({ organizations }: Props) {
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
          <OrganizationItem key={organization.id} organization={organization} />
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
