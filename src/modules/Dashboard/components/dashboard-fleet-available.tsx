import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';

import { fNumber } from '@/utils/format-number';
import { useTranslation } from 'react-i18next';

import Chart, { useChart } from '@/components/chart';

// ----------------------------------------------------------------------

type ItemProps = {
  label: string;
  value: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: ItemProps[];
    options?: ApexOptions;
  };
}

export default function DashboardFleetAvailable({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();
  const { t } = useTranslation('index');

  const {
    colors = [theme.palette.success.main, theme.palette.warning.main, theme.palette.grey[500]],
    series,
    options,
  } = chart;

  const total = series.reduce((sum, item) => sum + item.value, 0);

  const chartOptions = useChart({
    colors,
    labels: series.map((item) => item.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      show: false,
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => `${fNumber(value)} ${t('BUSES')}`,
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '78%',
          labels: {
            show: true,
            total: {
              label: t('BUSES'),
              formatter: () => fNumber(total),
            },
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <Chart
        dir="ltr"
        type="donut"
        series={series.map((item) => item.value)}
        options={chartOptions}
        width="100%"
        height={280}
      />

      <Stack spacing={2} sx={{ p: 5 }}>
        {series.map((item, index) => (
          <Stack
            key={item.label}
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{ typography: 'subtitle2' }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.75,
                bgcolor: colors[index],
              }}
            />
            <Box sx={{ color: 'text.secondary', flexGrow: 1 }}>{item.label}</Box>
            {fNumber(item.value)} {t('BUSES')}
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
