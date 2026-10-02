import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';

import { fData } from '@/utils/format-number';

import { useSnackbar } from '@/components/snackbar';

import StaffAvatarUpload from '@/modules/Users/staff-avatar-upload';
import {
  ORGANIZATION_CATEGORY_OPTIONS,
  ORGANIZATION_LOCATIONS,
  ORGANIZATION_SERVICE_OPTIONS,
  ORGANIZATION_STATUS_LABEL_KEYS,
  ORGANIZATION_STATUS_OPTIONS,
  ORGANIZATION_SUBSCRIPTION_PLANS,
} from '@/constants/organization.constant';
import type { IOrganizationStatus } from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

type FormState = {
  logo: File | string | null;
  title: string;
  phoneNumber: string;
  fullAddress: string;
  category: string;
  locations: string[];
  services: string[];
  subscriptionPlan: string;
  status: IOrganizationStatus;
};

const defaultValues: FormState = {
  logo: null,
  title: '',
  phoneNumber: '',
  fullAddress: '',
  category: ORGANIZATION_CATEGORY_OPTIONS[0],
  locations: [],
  services: [],
  subscriptionPlan: ORGANIZATION_SUBSCRIPTION_PLANS[0],
  status: 'active',
};

export default function OrganizationNewEditForm() {
  const { t } = useTranslation('index');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState<FormState>(defaultValues);
  const [submitting, setSubmitting] = useState(false);

  const handleChange =
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setForm((prev) => ({ ...prev, logo: file }));
    }
  }, []);

  const handleCreate = useCallback(async () => {
    if (!form.title.trim()) {
      enqueueSnackbar(t('NAME_IS_REQUIRED'), { variant: 'warning' });
      return;
    }

    if (!form.phoneNumber.trim()) {
      enqueueSnackbar(t('PHONE_NUMBER_IS_REQUIRED'), { variant: 'warning' });
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      enqueueSnackbar(t('CREATE_SUCCESS'));
      router.push(paths.dashboard.organizations.root);
    } finally {
      setSubmitting(false);
    }
  }, [enqueueSnackbar, form.phoneNumber, form.title, router, t]);

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Card sx={{ pt: 10, pb: 5, px: 3 }}>
          <Box sx={{ mb: 5 }}>
            <StaffAvatarUpload
              file={form.logo}
              onDrop={handleDrop}
              helperText={
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
              }
            />
          </Box>
        </Card>
      </Grid>

      <Grid xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {t('ORGANIZATION_DETAILS')}
          </Typography>

          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={t('ORGANIZATION_NAME')}
                value={form.title}
                onChange={handleChange('title')}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={t('PHONE_NUMBER')}
                value={form.phoneNumber}
                onChange={handleChange('phoneNumber')}
              />
            </Grid>

            <Grid xs={12}>
              <TextField
                fullWidth
                label={t('ADDRESS')}
                value={form.fullAddress}
                onChange={handleChange('fullAddress')}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <TextField
                select
                fullWidth
                label={t('CATEGORIES')}
                value={form.category}
                onChange={handleChange('category')}
              >
                {ORGANIZATION_CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid xs={12} md={6}>
              <TextField
                select
                fullWidth
                label={t('STATUS')}
                value={form.status}
                onChange={handleChange('status')}
              >
                {ORGANIZATION_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(ORGANIZATION_STATUS_LABEL_KEYS[option.value])}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid xs={12} md={6}>
              <TextField
                select
                fullWidth
                label={t('SUBSCRIPTION_PLAN')}
                value={form.subscriptionPlan}
                onChange={handleChange('subscriptionPlan')}
              >
                {ORGANIZATION_SUBSCRIPTION_PLANS.map((plan) => (
                  <MenuItem key={plan} value={plan}>
                    {plan}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid xs={12} md={6}>
              <Autocomplete
                multiple
                options={ORGANIZATION_LOCATIONS}
                value={form.locations}
                onChange={(_event, value) => setForm((prev) => ({ ...prev, locations: value }))}
                renderInput={(params) => <TextField {...params} label={t('LOCATIONS')} />}
              />
            </Grid>

            <Grid xs={12}>
              <Autocomplete
                multiple
                options={ORGANIZATION_SERVICE_OPTIONS.map((option) => option.label)}
                value={form.services}
                onChange={(_event, value) => setForm((prev) => ({ ...prev, services: value }))}
                renderInput={(params) => <TextField {...params} label={t('SERVICES')} />}
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => router.push(paths.dashboard.organizations.root)}
            >
              {t('CANCEL')}
            </Button>
            <Button variant="contained" disabled={submitting} onClick={handleCreate}>
              {t('CREATE_ORGANIZATION')}
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
