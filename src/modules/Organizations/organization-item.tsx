import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { fTaka } from '@/utils/format-number';
import { fDate } from '@/utils/format-time';

import Label from '@/components/label';
import Iconify from '@/components/iconify';

import {
  ORGANIZATION_STATUS_COLORS,
  ORGANIZATION_STATUS_LABEL_KEYS,
} from '@/constants/organization.constant';
import type { IOrganizationItem } from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

type Props = {
  organization: IOrganizationItem;
};

export default function OrganizationItem({ organization }: Props) {
  const { t } = useTranslation('index');

  const {
    id,
    title,
    company,
    createdAt,
    vehicleCount,
    ticketsSold,
    staffCount,
    totalEarned,
    totalPaid,
    subscriptionPlan,
    status,
  } = organization;

  const detailsHref = paths.dashboard.organizations.details(id);

  return (
    <Card
      component={RouterLink}
      href={detailsHref}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        transition: (theme) =>
          theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.z20,
        },
      }}
    >
      <Stack sx={{ p: 3, pb: 2 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Avatar
            alt={company.name}
            src={company.logo}
            variant="rounded"
            sx={{ width: 48, height: 48, bgcolor: 'background.neutral' }}
          >
            {company.name.charAt(0)}
          </Avatar>

          <Label variant="soft" color={ORGANIZATION_STATUS_COLORS[status]}>
            {t(ORGANIZATION_STATUS_LABEL_KEYS[status])}
          </Label>
        </Stack>

        <ListItemText
          sx={{ mb: 1 }}
          primary={title}
          secondary={t('JOINED_DATE', { date: fDate(createdAt) })}
          primaryTypographyProps={{
            typography: 'subtitle1',
          }}
          secondaryTypographyProps={{
            mt: 1,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ typography: 'caption' }}
        >
          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', minWidth: 0 }}
          >
            <Iconify width={16} icon="solar:crown-bold" />
            <Typography variant="caption" noWrap>
              {t('ORG_SUBSCRIPTION_PLAN', { plan: subscriptionPlan })}
            </Typography>
          </Stack>

          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'success.main', flexShrink: 0 }}
          >
            <Iconify width={16} icon="solar:wallet-money-bold" />
            <Typography variant="caption" noWrap fontWeight={600}>
              {t('ORG_TOTAL_PAID', { amount: fTaka(totalPaid) })}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
        {[
          {
            label: t('ORG_VEHICLES_COUNT', { count: vehicleCount }),
            icon: <Iconify width={16} icon="solar:bus-bold" sx={{ flexShrink: 0 }} />,
          },
          {
            label: t('ORG_TICKETS_SOLD_COUNT', { count: ticketsSold }),
            icon: <Iconify width={16} icon="solar:ticket-bold" sx={{ flexShrink: 0 }} />,
          },
          {
            label: t('ORG_USER_ACCOUNTS_COUNT', { count: staffCount }),
            icon: <Iconify width={16} icon="solar:user-rounded-bold" sx={{ flexShrink: 0 }} />,
          },
          {
            label: t('ORG_TOTAL_EARNED', { amount: fTaka(totalEarned) }),
            icon: <Iconify width={16} icon="solar:wad-of-money-bold" sx={{ flexShrink: 0 }} />,
          },
        ].map((item) => (
          <Stack
            key={item.label}
            spacing={0.5}
            flexShrink={0}
            direction="row"
            alignItems="center"
            sx={{ color: 'text.disabled', minWidth: 0 }}
          >
            {item.icon}
            <Typography variant="caption" noWrap>
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Card>
  );
}
