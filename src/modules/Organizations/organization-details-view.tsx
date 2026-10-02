import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from '@/routes/paths';

import { fData, fTaka } from '@/utils/format-number';
import { fDate } from '@/utils/format-time';

import Iconify from '@/components/iconify';
import EmptyContent from '@/components/empty-content';
import { useSnackbar } from '@/components/snackbar';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import StaffAvatarUpload from '@/modules/Users/staff-avatar-upload';
import {
  ORGANIZATION_STATUS_LABEL_KEYS,
  ORGANIZATION_STATUS_OPTIONS,
  ORGANIZATION_SUBSCRIPTION_PLANS,
} from '@/constants/organization.constant';
import { useGetOrganizationById } from '@/hooks/useGetOrganizations.hook';
import OrganizationAccountsView from './organization-accounts-view';
import OrganizationSystemView from './organization-system-view';
import type { IOrganizationStatus } from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

export default function OrganizationDetailsView() {
  const { t } = useTranslation('index');
  const { id = '' } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { data: organization } = useGetOrganizationById(id);

  const TABS = useMemo(
    () => [
      {
        value: 'details',
        label: t('DETAILS'),
        icon: <Iconify icon="solar:user-id-bold" width={24} />,
      },
      {
        value: 'system',
        label: t('SYSTEM'),
        icon: <Iconify icon="solar:settings-bold" width={24} />,
      },
      {
        value: 'accounts',
        label: t('ACCOUNTS'),
        icon: <Iconify icon="solar:bill-list-bold" width={24} />,
      },
    ],
    [t]
  );

  const [currentTab, setCurrentTab] = useState('details');
  const [editing, setEditing] = useState(false);
  const [logo, setLogo] = useState<File | string | null>(null);
  const [status, setStatus] = useState<IOrganizationStatus>('active');
  const [subscriptionPlan, setSubscriptionPlan] = useState('Basic');

  useEffect(() => {
    if (organization) {
      setLogo(organization.company.logo);
      setStatus(organization.status);
      setSubscriptionPlan(organization.subscriptionPlan);
      setEditing(false);
      setCurrentTab('details');
    }
  }, [organization]);

  const handleChangeTab = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      if (editing && organization) {
        setLogo(organization.company.logo);
        setStatus(organization.status);
        setSubscriptionPlan(organization.subscriptionPlan);
        setEditing(false);
      }
      setCurrentTab(newValue);
    },
    [editing, organization]
  );

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setLogo(file);
    }
  }, []);

  if (!organization) {
    return (
      <Container maxWidth={false} disableGutters>
        <CustomBreadcrumbs
          heading="ORGANIZATIONS"
          links={[
            { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
            { name: 'NAV_ORGANIZATIONS', href: paths.dashboard.organizations.root },
            { name: 'DETAILS' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <EmptyContent title="NO_DATA" filled sx={{ py: 10 }} />
      </Container>
    );
  }

  const {
    title,
    company,
    createdAt,
    category,
    vehicleCount,
    ticketsSold,
    staffCount,
    totalEarned,
    totalPaid,
    locations,
    services,
  } = organization;

  const handleCancel = () => {
    setLogo(organization.company.logo);
    setStatus(organization.status);
    setSubscriptionPlan(organization.subscriptionPlan);
    setEditing(false);
  };

  const handleSave = () => {
    enqueueSnackbar(t('UPDATE_SUCCESS'));
    setEditing(false);
  };

  const stats = [
    {
      label: t('ORG_VEHICLES_COUNT', { count: vehicleCount }),
      icon: 'solar:bus-bold',
    },
    {
      label: t('ORG_TICKETS_SOLD_COUNT', { count: ticketsSold }),
      icon: 'solar:ticket-bold',
    },
    {
      label: t('ORG_USER_ACCOUNTS_COUNT', { count: staffCount }),
      icon: 'solar:user-rounded-bold',
    },
    {
      label: t('ORG_TOTAL_EARNED', { amount: fTaka(totalEarned) }),
      icon: 'solar:wad-of-money-bold',
    },
  ];

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading={title}
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_ORGANIZATIONS', href: paths.dashboard.organizations.root },
          { name: title },
        ]}
        action={
          currentTab === 'details' && !editing ? (
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={() => setEditing(true)}
            >
              {t('EDIT')}
            </Button>
          ) : undefined
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'details' && (
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2} alignItems="center" textAlign="center">
                <StaffAvatarUpload
                  file={logo}
                  readOnly={!editing}
                  onDrop={handleDrop}
                  helperText={
                    editing ? (
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.disabled',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: t('ALLOWED_AVATAR_TYPES', { size: fData(3145728) }),
                        }}
                      />
                    ) : undefined
                  }
                />

                <Typography variant="h6">{title}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {t('JOINED_DATE', { date: fDate(createdAt) })}
                </Typography>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

              <Stack spacing={2.5}>
                {editing ? (
                  <>
                    <TextField
                      select
                      fullWidth
                      label={t('STATUS')}
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value as IOrganizationStatus)
                      }
                    >
                      {ORGANIZATION_STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(ORGANIZATION_STATUS_LABEL_KEYS[option.value])}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      fullWidth
                      label={t('SUBSCRIPTION_PLAN')}
                      value={subscriptionPlan}
                      onChange={(event) => setSubscriptionPlan(event.target.value)}
                    >
                      {ORGANIZATION_SUBSCRIPTION_PLANS.map((plan) => (
                        <MenuItem key={plan} value={plan}>
                          {plan}
                        </MenuItem>
                      ))}
                    </TextField>
                  </>
                ) : (
                  <>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        {t('STATUS')}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t(ORGANIZATION_STATUS_LABEL_KEYS[status])}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        {t('SUBSCRIPTION_PLAN')}
                      </Typography>
                      <Typography variant="subtitle2">{subscriptionPlan}</Typography>
                    </Stack>
                  </>
                )}

                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {t('TOTAL_PAID')}
                  </Typography>
                  <Typography variant="subtitle2" color="success.main">
                    {fTaka(totalPaid)}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {t('CATEGORIES')}
                  </Typography>
                  <Typography variant="subtitle2">{category}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {t('PHONE_NUMBER')}
                  </Typography>
                  <Typography variant="subtitle2">{company.phoneNumber}</Typography>
                </Stack>

                {editing && (
                  <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ pt: 1 }}>
                    <Button color="inherit" variant="outlined" onClick={handleCancel}>
                      {t('CANCEL')}
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                      {t('SAVE_CHANGES')}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {t('OVERVIEW')}
              </Typography>

              <Box
                gap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                {stats.map((item) => (
                  <Stack
                    key={item.label}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      p: 2,
                      borderRadius: 1.5,
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Iconify icon={item.icon} width={24} sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle2">{item.label}</Typography>
                  </Stack>
                ))}
              </Box>

              <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('LOCATIONS')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {locations.join(', ')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('SERVICES')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {services.join(', ')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('ADDRESS')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {company.fullAddress}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 'system' && <OrganizationSystemView organizationId={organization.id} />}

      {currentTab === 'accounts' && (
        <OrganizationAccountsView organizationId={organization.id} />
      )}
    </Container>
  );
}
