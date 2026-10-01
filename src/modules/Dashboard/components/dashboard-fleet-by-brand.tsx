import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';

import { fNumber, fPercent } from '@/utils/format-number';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

type BrandItem = {
  label: string;
  value: number;
  logo?: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: BrandItem[];
}

export default function DashboardFleetByBrand({ title, subheader, list, ...other }: Props) {
  const { t } = useTranslation('index');
  const total = list.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {list.map((item) => {
          const percent = total ? (item.value / total) * 100 : 0;

          return (
            <Stack key={item.label} spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  alt={item.label}
                  src={item.logo}
                  variant="rounded"
                  sx={{ width: 36, height: 36, bgcolor: 'background.neutral' }}
                >
                  {item.label.charAt(0)}
                </Avatar>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {fNumber(item.value)} {t('BUSES')} · {fPercent(percent)}
                  </Typography>
                </Box>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={percent}
                color="inherit"
                sx={{
                  height: 6,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'primary.main',
                  },
                }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
}
