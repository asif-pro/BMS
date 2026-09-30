import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import Iconify from '@/components/iconify';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import { _vehicles } from './_mock';
import VehicleCard from './vehicle-card';

// ----------------------------------------------------------------------

export default function VehicleListView() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState(_vehicles);

  const handleDelete = useCallback((id: string) => {
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
  }, []);

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="NAV_VEHICLES"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_FLEET', href: paths.dashboard.vehicles.root },
          { name: 'NAV_VEHICLES' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.vehicles.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('NEW_VEHICLE')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onDelete={handleDelete} />
        ))}
      </Box>
    </Container>
  );
}
