import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';

import { fData } from '@/utils/format-number';

import Label from '@/components/label';
import { useSnackbar } from '@/components/snackbar';

import { _roles } from './_mock';
import { COUNTRY_OPTIONS } from './countries';
import StaffAvatarUpload from './staff-avatar-upload';
import type { IUserItem } from './types';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

type FormState = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  company: string;
  role: string;
  status: string;
  isVerified: boolean;
  avatarUrl: string | File | null;
};

export default function UserNewEditForm({ currentUser }: Props) {
  const { t } = useTranslation('index');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = useMemo<FormState>(
    () => ({
      name: currentUser?.name || '',
      city: currentUser?.city || '',
      role: currentUser?.role || '',
      email: currentUser?.email || '',
      state: currentUser?.state || '',
      status: currentUser?.status || 'active',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      zipCode: currentUser?.zipCode || '',
      company: currentUser?.company || '',
      avatarUrl: currentUser?.avatarUrl || null,
      phoneNumber: currentUser?.phoneNumber || '',
      isVerified: currentUser?.isVerified ?? true,
    }),
    [currentUser]
  );

  const [form, setForm] = useState<FormState>(defaultValues);

  useEffect(() => {
    setForm(defaultValues);
  }, [defaultValues]);

  const setField =
    (name: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setForm((prev) => ({ ...prev, avatarUrl: file }));
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, position: 'relative' }}>
            {currentUser && (
              <Label
                color={
                  (form.status === 'active' && 'success') ||
                  (form.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {form.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <StaffAvatarUpload
                file={form.avatarUrl}
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
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    checked={form.status !== 'active'}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        status: event.target.checked ? 'banned' : 'active',
                      }))
                    }
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch checked={form.isVerified} onChange={setField('isVerified')} name="isVerified" />
              }
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
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
                label="Full Name"
                value={form.name}
                onChange={setField('name')}
                required
              />
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={form.email}
                onChange={setField('email')}
                required
              />
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={form.phoneNumber}
                onChange={setField('phoneNumber')}
                required
              />

              <Autocomplete
                options={COUNTRY_OPTIONS}
                value={form.country || null}
                onChange={(_, value) => setForm((prev) => ({ ...prev, country: value || '' }))}
                renderInput={(params) => (
                  <TextField {...params} label="Country" placeholder="Choose a country" required />
                )}
              />

              <TextField
                name="state"
                label="State/Region"
                value={form.state}
                onChange={setField('state')}
                required
              />
              <TextField name="city" label="City" value={form.city} onChange={setField('city')} required />
              <TextField
                name="address"
                label="Address"
                value={form.address}
                onChange={setField('address')}
                required
              />
              <TextField
                name="zipCode"
                label="Zip/Code"
                value={form.zipCode}
                onChange={setField('zipCode')}
                required
              />
              <TextField
                name="company"
                label="Company"
                value={form.company}
                onChange={setField('company')}
                required
              />
              <TextField
                select
                name="role"
                label="Role"
                value={form.role}
                onChange={setField('role')}
                required
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="">
                  <em>Select role</em>
                </MenuItem>
                {_roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting
                  ? '...'
                  : !currentUser
                    ? t('CREATE_STAFF')
                    : t('SAVE_CHANGES')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}
