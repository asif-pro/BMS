import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from '@/routes/paths';

import { fData } from '@/utils/format-number';

import Iconify from '@/components/iconify';
import EmptyContent from '@/components/empty-content';
import { useSnackbar } from '@/components/snackbar';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import StaffAvatarUpload from '@/modules/Users/staff-avatar-upload';

import { useGetCustomerById, useGetCustomerTripHistory } from '@/hooks/useGetCustomers.hook';
import CustomerTripHistory from './customer-trip-history';
import type { ICustomerItem } from '@/interfaces/customer.interface';

// ----------------------------------------------------------------------

type FormState = {
  name: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string | File | null;
};

function toFormState(customer: ICustomerItem): FormState {
  return {
    name: customer.name,
    phoneNumber: customer.phoneNumber,
    address: customer.address,
    avatarUrl: customer.avatarUrl,
  };
}

function readOnlyFieldSx(readOnly: boolean) {
  if (!readOnly) {
    return undefined;
  }

  return {
    '& .MuiInputBase-root': {
      bgcolor: 'background.neutral',
    },
    '& .MuiInputBase-input': {
      color: 'text.primary',
      WebkitTextFillColor: 'unset',
      cursor: 'default',
      fontWeight: 600,
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
    },
  };
}

// ----------------------------------------------------------------------

export default function CustomerDetailsView() {
  const { t } = useTranslation('index');
  const { id = '' } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data: customer } = useGetCustomerById(id);
  const { data: trips = [] } = useGetCustomerTripHistory(id);

  const TABS = useMemo(
    () => [
      {
        value: 'details',
        label: t('DETAILS'),
        icon: <Iconify icon="solar:user-id-bold" width={24} />,
      },
      {
        value: 'trip_history',
        label: t('TRIP_HISTORY'),
        icon: <Iconify icon="solar:bus-bold" width={24} />,
      },
    ],
    [t]
  );

  const [currentTab, setCurrentTab] = useState('details');
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState | null>(customer ? toFormState(customer) : null);

  useEffect(() => {
    if (customer) {
      setForm(toFormState(customer));
      setEditing(false);
      setCurrentTab('details');
    }
  }, [customer]);

  const handleChangeTab = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      if (editing && customer) {
        setForm(toFormState(customer));
        setEditing(false);
      }
      setCurrentTab(newValue);
    },
    [customer, editing]
  );

  const setField =
    (name: keyof Omit<FormState, 'avatarUrl'>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => (prev ? { ...prev, [name]: event.target.value } : prev));
    };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setForm((prev) => (prev ? { ...prev, avatarUrl: file } : prev));
    }
  }, []);

  const handleCancel = () => {
    if (customer) {
      setForm(toFormState(customer));
    }
    setEditing(false);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) {
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar(t('UPDATE_SUCCESS'));
      setEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading={customer?.name || t('CUSTOMER_DETAILS')}
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_CUSTOMERS', href: paths.dashboard.customers.list },
          { name: customer?.name || t('CUSTOMER_DETAILS') },
        ]}
        action={
          customer && currentTab === 'details' && !editing ? (
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={() => setEditing(true)}
            >
              {t('EDIT_INFO')}
            </Button>
          ) : undefined
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {customer && form ? (
        <>
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
            <form onSubmit={handleSave}>
              <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                  <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                    <Box sx={{ mb: 5 }}>
                      <StaffAvatarUpload
                        file={form.avatarUrl}
                        readOnly={!editing}
                        onDrop={handleDrop}
                        helperText={
                          editing ? (
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 3,
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
                    </Box>
                  </Card>
                </Grid>

                <Grid xs={12} md={8}>
                  <Card sx={{ p: 3 }}>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                      }}
                    >
                      <TextField
                        name="name"
                        label={t('FULL_NAME')}
                        value={form.name}
                        onChange={setField('name')}
                        required
                        InputProps={{ readOnly: !editing }}
                        sx={readOnlyFieldSx(!editing)}
                      />
                      <TextField
                        name="phoneNumber"
                        label={t('PHONE_NUMBER')}
                        value={form.phoneNumber}
                        onChange={setField('phoneNumber')}
                        required
                        InputProps={{ readOnly: !editing }}
                        sx={readOnlyFieldSx(!editing)}
                      />
                      <TextField
                        name="address"
                        label={t('ADDRESS')}
                        value={form.address}
                        onChange={setField('address')}
                        required
                        InputProps={{ readOnly: !editing }}
                        sx={{
                          gridColumn: { sm: '1 / -1' },
                          ...readOnlyFieldSx(!editing),
                        }}
                      />
                    </Box>

                    {editing && (
                      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={handleCancel}
                          disabled={submitting}
                        >
                          {t('CANCEL')}
                        </Button>
                        <Button type="submit" variant="contained" disabled={submitting}>
                          {submitting ? '...' : t('SAVE_CHANGES')}
                        </Button>
                      </Stack>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </form>
          )}

          {currentTab === 'trip_history' && <CustomerTripHistory trips={trips} />}
        </>
      ) : (
        <EmptyContent title="NO_DATA" filled sx={{ py: 10 }} />
      )}
    </Container>
  );
}
