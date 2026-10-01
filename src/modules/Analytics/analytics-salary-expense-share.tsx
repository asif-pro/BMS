import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { fTaka, fPercent } from '@/utils/format-number';
import { useTranslation } from 'react-i18next';

import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type RoleShareItem = {
  label: string;
  value: number;
  percent: number;
};

type Props = {
  title?: string;
  subheader?: string;
  totalExpense: number;
  salaryExpense: number;
  salaryPercent: number;
  byRole: RoleShareItem[];
};

const ROLE_ICONS: Record<string, string> = {
  Admin: 'solar:shield-user-bold-duotone',
  Driver: 'solar:bus-bold-duotone',
  Manager: 'solar:case-round-bold-duotone',
  Helper: 'solar:users-group-rounded-bold-duotone',
  Mechanic: 'solar:wrench-bold-duotone',
  Supervisor: 'solar:clipboard-check-bold-duotone',
  Conductor: 'solar:ticket-bold-duotone',
  Other: 'solar:user-bold-duotone',
};

export default function AnalyticsSalaryExpenseShare({
  title,
  subheader,
  totalExpense,
  salaryExpense,
  salaryPercent,
  byRole,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslation('index');

  const cardTitle = title ?? t('SALARY_VS_TOTAL_EXPENSE');
  const cardSubheader = subheader ?? t('SALARY_EXPENSE_SUBHEADER');

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
    <Card>
      <CardHeader title={cardTitle} subheader={cardSubheader} />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{ p: 3, pt: 0 }}
        alignItems={{ md: 'stretch' }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{
            minWidth: { md: 260 },
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.neutral',
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={140}
              thickness={3}
              sx={{ color: (tTheme) => alpha(tTheme.palette.grey[500], 0.16) }}
            />
            <CircularProgress
              variant="determinate"
              value={Math.min(salaryPercent, 100)}
              size={140}
              thickness={3}
              sx={{
                color: 'warning.main',
                position: 'absolute',
                left: 0,
                [`& .MuiCircularProgress-circle`]: { strokeLinecap: 'round' },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h3">{fPercent(salaryPercent)}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('OF_EXPENSES')}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={0.5} alignItems="center">
            <Typography variant="subtitle1">{t('STAFF_SALARY')}</Typography>
            <Typography variant="h5" sx={{ color: 'warning.main' }}>
              {fTaka(salaryExpense)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('OF_TOTAL_EXPENSE', { amount: fTaka(totalExpense) })}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {t('SALARY_BY_ROLE_SUBTITLE')}
          </Typography>

          <Stack spacing={2.5}>
            {byRole.map((item, index) => {
              const color = colors[index % colors.length];
              const roleName = item.label.replace(/ Salary$/, '');

              return (
                <Stack key={item.label} spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        color,
                        bgcolor: alpha(color, 0.12),
                        flexShrink: 0,
                      }}
                    >
                      <Iconify icon={ROLE_ICONS[roleName] || ROLE_ICONS.Other} width={20} />
                    </Box>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Typography variant="subtitle2" noWrap>
                          {item.label}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
                          {fTaka(item.value)} · {fPercent(item.percent)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(item.percent, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: alpha(color, 0.12),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: color,
                        borderRadius: 1,
                      },
                    }}
                  />
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
