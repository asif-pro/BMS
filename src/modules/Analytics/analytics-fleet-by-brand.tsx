import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import { styled, useTheme } from '@mui/material/styles';

import { fNumber, fPercent } from '@/utils/format-number';

import Chart, { useChart } from '@/components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 280;

const StyledChart = styled(Chart)(() => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
}));

// ----------------------------------------------------------------------

type BrandItem = {
  label: string;
  value: number;
  logo?: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: BrandItem[];
    options?: ApexOptions;
  };
}

export default function AnalyticsFleetByBrand({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const total = series.reduce((sum, item) => sum + item.value, 0);

  const chartSeries = series.map((item) => item.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
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
        formatter: (value: number) => `${fNumber(value)} buses`,
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              label: 'Fleet',
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
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <StyledChart
        dir="ltr"
        type="donut"
        series={chartSeries}
        options={chartOptions}
        width="100%"
        height={CHART_HEIGHT}
      />

      <Stack spacing={2} sx={{ px: 3, pb: 3 }}>
        {series.map((item, index) => (
          <Stack key={item.label} direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              alt={item.label}
              src={item.logo}
              variant="rounded"
              sx={{ width: 32, height: 32, bgcolor: 'background.neutral' }}
            >
              {item.label.charAt(0)}
            </Avatar>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {item.label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {item.value} buses · {fPercent((item.value / total) * 100)}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 0.75,
                bgcolor: colors?.[index] || theme.palette.primary.main,
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
