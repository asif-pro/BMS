import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { alpha } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';

import { fNumber } from '@/utils/format-number';
import { useTranslation } from 'react-i18next';

import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type DriverItem = {
  id: string;
  name: string;
  avatarUrl: string;
  route: string;
  trips: number;
  rating: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: DriverItem[];
}

export default function DashboardTopDrivers({ title, subheader, list, ...other }: Props) {
  const { t } = useTranslation('index');
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {list.map((driver, index) => (
          <Stack key={driver.id} direction="row" alignItems="center" spacing={2}>
            <Avatar alt={driver.name} src={driver.avatarUrl} />

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {driver.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {driver.route} · {fNumber(driver.trips)} {t('TRIPS')}
              </Typography>
              <Rating size="small" value={driver.rating} precision={0.1} readOnly sx={{ mt: 0.5 }} />
            </Box>

            <Iconify
              icon="solar:cup-star-bold"
              sx={{
                p: 1,
                width: 40,
                height: 40,
                borderRadius: '50%',
                color: 'primary.main',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                ...(index === 1 && {
                  color: 'info.main',
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                }),
                ...(index === 2 && {
                  color: 'warning.main',
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                }),
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
