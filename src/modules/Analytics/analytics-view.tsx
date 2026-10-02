import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { fPercent } from '@/utils/format-number';
import { useTranslation } from 'react-i18next';

import { useSettingsContext } from '@/components/settings';

import { useGetAnalytics } from '@/hooks/useGetAnalytics.hook';

import AnalyticsRidership from './analytics-website-visits';
import AnalyticsTopStaff from './analytics-top-staff';
import AnalyticsTopDrivers from './analytics-top-drivers';
import AnalyticsPayrollTrend from './analytics-payroll-trend';
import AnalyticsFleetByBrand from './analytics-fleet-by-brand';
import AnalyticsRevenueByRoute from './analytics-current-visits';
import AnalyticsCurrentSubject from './analytics-current-subject';
import AnalyticsConversionRates from './analytics-conversion-rates';
import AnalyticsSparklineSummary from './analytics-sparkline-summary';
import AnalyticsSalaryExpenseShare from './analytics-salary-expense-share';

// ----------------------------------------------------------------------

export default function AnalyticsView() {
  const theme = useTheme();
  const { t } = useTranslation('index');

  const settings = useSettingsContext();
  const { data } = useGetAnalytics();

  const sparklines = data?.sparklines;
  const fleetHealth = data?.fleetHealth;
  const topDrivers = data?.topDrivers ?? [];
  const topStaff = data?.topStaff ?? [];
  const fleetByBrand = data?.fleetByBrand ?? [];
  const salaryByRole = data?.salaryByRole ?? [];
  const payrollTrend = data?.payrollTrend;
  const ridershipChart = data?.ridershipChart;
  const revenueByRoute = data?.revenueByRoute ?? [];
  const routePerformance = data?.routePerformance ?? [];
  const brandPerformance = data?.brandPerformance ?? [];
  const payrollTotal = data?.payrollTotal ?? 0;
  const totalExpenseAmount = data?.totalExpenseAmount ?? 0;
  const salaryExpenseAmount = data?.salaryExpenseAmount ?? 0;
  const salaryExpensePercent = data?.salaryExpensePercent ?? 0;
  const salaryExpenseByRole = data?.salaryExpenseByRole ?? [];

  if (!data || !sparklines || !fleetHealth || !payrollTrend || !ridershipChart) {
    return null;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} disableGutters>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {t('WELCOME_BACK')}
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSparklineSummary
            title={t('TOTAL_PASSENGERS')}
            percent={2.6}
            total={48230}
            chart={{ series: sparklines.passengers }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSparklineSummary
            title={t('TICKET_REVENUE')}
            percent={4.1}
            total={4120000}
            formatTotal={(value) => `৳${(value / 1000000).toFixed(2)}M`}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: sparklines.revenue,
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSparklineSummary
            title={t('FLEET_UTILIZATION')}
            percent={1.8}
            total={87.4}
            formatTotal={(value) => fPercent(value)}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: sparklines.utilization,
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsSparklineSummary
            title={t('ON_TIME_RATE')}
            percent={-0.7}
            total={93.6}
            formatTotal={(value) => fPercent(value)}
            chart={{
              colors: [theme.palette.error.light, theme.palette.error.main],
              series: sparklines.onTime,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsRidership
            title={t('RIDERSHIP_BOOKINGS')}
            subheader={t('PASSENGERS_THAN_LAST_YEAR')}
            chart={{
              labels: ridershipChart.labels,
              series: ridershipChart.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsRevenueByRoute
            title={t('REVENUE_BY_ROUTE')}
            subheader={t('REVENUE_BY_ROUTE_SUBHEADER')}
            chart={{
              series: revenueByRoute,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title={t('ROUTE_PERFORMANCE')}
            subheader={t('ROUTE_PERFORMANCE_SUBHEADER')}
            chart={{
              series: routePerformance,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title={t('FLEET_HEALTH')}
            chart={{
              categories: fleetHealth.categories,
              series: fleetHealth.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsFleetByBrand
            title={t('FLEET_BY_BRAND')}
            subheader={t('FLEET_BY_BRAND_DISTRIBUTION')}
            chart={{
              series: fleetByBrand,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title={t('BRAND_UTILIZATION')}
            subheader={t('BRAND_UTILIZATION_SUBHEADER')}
            chart={{
              series: brandPerformance,
              options: {
                tooltip: {
                  y: {
                    formatter: (value: number) => `${value}% ${t('UTILIZATION')}`,
                    title: {
                      formatter: () => '',
                    },
                  },
                },
              },
            }}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <AnalyticsTopDrivers
            title={t('TOP_DRIVERS')}
            subheader={t('BEST_PERFORMING_DRIVERS')}
            tableData={topDrivers}
            tableLabels={[
              { id: 'name', label: t('DRIVER') },
              { id: 'route', label: t('MAIN_ROUTE') },
              { id: 'trips', label: t('TRIPS'), align: 'center' },
              { id: 'rating', label: t('RATING'), align: 'center' },
              { id: 'revenue', label: t('REVENUE'), align: 'right' },
              { id: 'rank', label: t('RANK'), align: 'right' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTopStaff
            title={t('TOP_STAFF')}
            subheader={t('NON_DRIVER_LEADERS')}
            list={topStaff}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsPayrollTrend
            title={t('PAYROLL_TREND')}
            subheader={t('PAYROLL_TREND_SUBHEADER')}
            chart={{
              categories: payrollTrend.categories,
              series: [
                {
                  name: t('PAYROLL'),
                  type: 'column',
                  fill: 'solid',
                  data: payrollTrend.series[0].data,
                },
                {
                  name: t('OVERTIME'),
                  type: 'line',
                  fill: 'solid',
                  data: payrollTrend.series[1].data,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsConversionRates
            title={t('SALARY_BY_ROLE')}
            subheader={t('TOTAL_PAYROLL', { amount: `৳${(payrollTotal / 1000).toFixed(0)}k` })}
            chart={{
              series: salaryByRole.map((item) => ({
                label: item.label,
                value: Math.round(item.value / 1000),
              })),
              options: {
                tooltip: {
                  y: {
                    formatter: (value: number) => `৳${value}k`,
                    title: {
                      formatter: () => '',
                    },
                  },
                },
              },
            }}
          />
        </Grid>

        <Grid xs={12}>
          <AnalyticsSalaryExpenseShare
            title={t('SALARY_VS_TOTAL_EXPENSE')}
            subheader={t('SALARY_EXPENSE_SUBHEADER')}
            totalExpense={totalExpenseAmount}
            salaryExpense={salaryExpenseAmount}
            salaryPercent={salaryExpensePercent}
            byRole={salaryExpenseByRole}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
