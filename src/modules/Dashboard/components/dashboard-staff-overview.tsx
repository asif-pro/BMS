import { ROLE_ICONS } from '@/constants/staff.constant';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import { useTranslation } from 'react-i18next';

import { fNumber } from '@/utils/format-number';

import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type StaffRoleItem = {
  label: string;
  value: number;
  icon: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: StaffRoleItem[];
  compact?: boolean;
}

export default function DashboardStaffOverview({
  title,
  subheader,
  list,
  compact = false,
  ...other
}: Props) {
  const { t } = useTranslation('index');
  const theme = useTheme();

  const totalStaff = list.reduce((sum, item) => sum + item.value, 0);

  const colors = [
    theme.palette.primary.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
    theme.palette.grey[600],
    theme.palette.primary.dark,
  ];

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={compact ? undefined : subheader}
        sx={compact ? { pb: 1, pt: 2, px: 2.5 } : undefined}
        titleTypographyProps={compact ? { variant: 'subtitle1' } : undefined}
        action={
          <Stack alignItems="flex-end" sx={{ pr: compact ? 0.5 : 1, pt: compact ? 0.25 : 0.5 }}>
            <Typography variant={compact ? 'h6' : 'h4'}>{fNumber(totalStaff)}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('TOTAL_STAFF')}
            </Typography>
          </Stack>
        }
      />

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(4, 1fr)',
          md: compact ? 'repeat(8, 1fr)' : 'repeat(4, 1fr)',
        }}
        gap={compact ? 1.5 : 2}
        sx={{ p: compact ? 2 : 3, pt: 0 }}
      >
        {list.map((item, index) => {
          const color = colors[index % colors.length];

          return (
            <Stack
              key={item.label}
              spacing={compact ? 0.5 : 1}
              alignItems={compact ? 'center' : 'flex-start'}
              sx={{
                p: compact ? 1.25 : 2,
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
              }}
            >
              <Box
                sx={{
                  width: compact ? 28 : 40,
                  height: compact ? 28 : 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  color,
                  bgcolor: alpha(color, 0.12),
                }}
              >
                <Iconify
                  icon={ROLE_ICONS[item.label] || item.icon || ROLE_ICONS.Other}
                  width={compact ? 16 : 22}
                />
              </Box>

              <Typography variant={compact ? 'subtitle1' : 'h4'}>{fNumber(item.value)}</Typography>
              <Typography
                variant={compact ? 'caption' : 'subtitle2'}
                sx={{ color: 'text.secondary', textAlign: compact ? 'center' : 'left' }}
              >
                {item.label}
              </Typography>
            </Stack>
          );
        })}
      </Box>
    </Card>
  );
}
