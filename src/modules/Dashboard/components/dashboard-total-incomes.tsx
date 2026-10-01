import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { fTaka, fPercent } from '@/utils/format-number';

import { bgGradient } from '@/theme/css';
import { ColorSchema } from '@/theme/palette';

import Iconify from '@/components/iconify';
import Chart, { useChart } from '@/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  total: number;
  title: string;
  percent: number;
  color?: ColorSchema;
  chart: {
    colors?: string[];
    series: {
      x: number;
      y: number;
    }[];
    options?: ApexOptions;
  };
}

export default function DashboardTotalIncomes({
  title,
  total,
  percent,
  color = 'primary',
  chart,
  sx,
  ...other
}: Props) {
  const { t } = useTranslation('index');
  const theme = useTheme();

  const {
    colors = [theme.palette[color].lighter, theme.palette.common.white],
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    colors: [colors[1]],
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    stroke: {
      width: 4,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      marker: {
        show: false,
      },
      y: {
        formatter: (value: number) => fTaka(value * 1000),
        title: {
          formatter: () => '',
        },
      },
    },
    ...options,
  });

  return (
    <Stack
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: theme.palette[color].dark,
          endColor: theme.palette[color].darker,
        }),
        p: 3,
        borderRadius: 2,
        color: 'common.white',
        height: 1,
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          <Box sx={{ mb: 1, typography: 'subtitle2', opacity: 0.72 }}>{title}</Box>
          <Box sx={{ typography: 'h3' }}>{fTaka(total)}</Box>
        </div>

        <div>
          <Stack spacing={0.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Iconify icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />

            <Box sx={{ typography: 'subtitle2' }}>
              {percent > 0 && '+'}
              {fPercent(percent)}
            </Box>
          </Stack>

          <Box sx={{ mt: 0.5, opacity: 0.72, typography: 'body2' }}>{t('THAN_LAST_MONTH')}</Box>
        </div>
      </Stack>

      <Chart
        dir="ltr"
        type="line"
        series={[{ data: series }]}
        options={chartOptions}
        width="100%"
        height={118}
      />
    </Stack>
  );
}
