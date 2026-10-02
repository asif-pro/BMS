import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useGetDashboard } from '@/hooks/useGetDashboard.hook';

import { useSettingsContext } from '@/components/settings';

import DashboardBooked from './components/dashboard-booked';
import DashboardTopDrivers from './components/dashboard-top-drivers';
import DashboardTopStaff from './components/dashboard-top-staff';
import DashboardTotalIncomes from './components/dashboard-total-incomes';
import DashboardFleetByBrand from './components/dashboard-fleet-by-brand';
import DashboardWidgetSummary from './components/dashboard-widget-summary';
import DashboardFleetAvailable from './components/dashboard-fleet-available';
import DashboardCheckInWidgets from './components/dashboard-check-in-widgets';

// ----------------------------------------------------------------------

const SPACING = 3;

export default function Dashboard() {
  const { t } = useTranslation('index');

  const settings = useSettingsContext();
  const { data } = useGetDashboard();

  const vehicles = data?.vehicles ?? [];
  const topDrivers = data?.topDrivers ?? [];
  const topStaff = data?.topStaff ?? [];
  const fleetByBrand = data?.fleetByBrand ?? [];
  const incomeTrend = data?.incomeTrend ?? [];
  const summary = data?.summary;

  const countVehicles = (status: string) =>
    vehicles.filter((vehicle) => vehicle.status === status).length;

  const bookedStatus = [
    { status: t('PAID'), quantity: 12840, value: 72 },
    { status: t('PENDING'), quantity: 3560, value: 20 },
    { status: t('CANCELLED'), quantity: 1420, value: 8 },
  ];

  if (!data || !summary) {
    return null;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} disableGutters>
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h4">{t('DASHBOARD')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('WELCOME_BACK')}
        </Typography>
      </Box>

      <Grid container spacing={SPACING} disableEqualOverflow>
        <Grid xs={12} md={4}>
          <DashboardWidgetSummary
            title={t('TOTAL_BOOKINGS')}
            total={summary.totalBookings}
            icon="solar:calendar-mark-bold-duotone"
            color="primary"
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardWidgetSummary
            title={t('TICKETS_SOLD')}
            total={summary.ticketsSold}
            icon="solar:ticket-bold-duotone"
            color="success"
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardWidgetSummary
            title={t('CANCELLED')}
            total={1420}
            icon="solar:close-circle-bold-duotone"
            color="error"
          />
        </Grid>

        <Grid container xs={12}>
          <Grid container xs={12} md={8}>
            <Grid xs={12} md={6}>
              <DashboardTotalIncomes
                title={t('TOTAL_INCOMES')}
                total={1876500}
                percent={2.6}
                chart={{ series: incomeTrend }}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <DashboardBooked title={t('BOOKED')} data={bookedStatus} />
            </Grid>

            <Grid xs={12}>
              <DashboardCheckInWidgets
                chart={{
                  series: [
                    { label: t('SOLD'), percent: 72, total: 38566 },
                    { label: t('PENDING_FOR_PAYMENT'), percent: 64, total: 18472 },
                  ],
                }}
              />
            </Grid>
          </Grid>

          <Grid xs={12} md={4}>
            <DashboardFleetAvailable
              title={t('FLEET_AVAILABLE')}
              chart={{
                series: [
                  { label: t('ACTIVE'), value: countVehicles('active') },
                  { label: t('MAINTENANCE'), value: countVehicles('maintenance') },
                  { label: t('INACTIVE'), value: countVehicles('inactive') },
                ],
              }}
            />
          </Grid>
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardFleetByBrand
            title={t('FLEET_BY_BRAND')}
            subheader={t('FLEET_BY_BRAND_SUBHEADER')}
            list={fleetByBrand}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardTopDrivers
            title={t('TOP_DRIVERS')}
            subheader={t('TOP_DRIVERS_SUBHEADER')}
            list={topDrivers.slice(0, 4)}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashboardTopStaff
            title={t('TOP_STAFF')}
            subheader={t('TOP_STAFF_SUBHEADER')}
            list={topStaff.slice(0, 4)}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
