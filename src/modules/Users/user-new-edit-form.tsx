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

import { COUNTRY_OPTIONS, USER_ROLES } from '@/constants/user.constant';
import StaffAvatarUpload from './staff-avatar-upload';
import type { IUserItem } from '@/interfaces/user.interface';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
  readOnly?: boolean;
  onCancelEdit?: () => void;
  onSaveSuccess?: () => void;
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

export default function UserNewEditForm({
  currentUser,
  readOnly = false,
  onCancelEdit,
  onSaveSuccess,
}: Props) {
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

  const handleCancel = () => {
    setForm(defaultValues);
    onCancelEdit?.();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (readOnly) {
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar(currentUser ? t('UPDATE_SUCCESS') : t('CREATE_SUCCESS'));

      if (currentUser) {
        onSaveSuccess?.();
      } else {
        router.push(paths.dashboard.user.list);
      }
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
                {t(form.status.toUpperCase())}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <StaffAvatarUpload
                file={form.avatarUrl}
                readOnly={readOnly}
                onDrop={handleDrop}
                helperText={
                  readOnly ? undefined : (
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
                  )
                }
              />
            </Box>

            {currentUser && readOnly && (
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                <Label variant="soft" color={form.isVerified ? 'info' : 'default'}>
                  {form.isVerified ? t('VERIFIED') : t('UNVERIFIED')}
                </Label>
              </Stack>
            )}

            {currentUser && !readOnly && (
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
                      {t('BANNED')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t('APPLY_DISABLE_ACCOUNT')}
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            {!readOnly && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch checked={form.isVerified} onChange={setField('isVerified')} name="isVerified" />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('EMAIL_VERIFIED')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t('EMAIL_VERIFIED_HINT')}
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
            )}

            {currentUser && !readOnly && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  {t('DELETE_USER')}
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
                label={t('FULL_NAME')}
                value={form.name}
                onChange={setField('name')}
                required
                InputProps={{ readOnly }}
                sx={readOnlyFieldSx(readOnly)}
              />
              <TextField
                name="email"
                label={t('EMAIL_ADDRESS')}
                type="email"
                value={form.email}
                onChange={setField('email')}
                required
                InputProps={{ readOnly }}
                sx={readOnlyFieldSx(readOnly)}
              />
              <TextField
                name="phoneNumber"
                label={t('PHONE_NUMBER')}
                value={form.phoneNumber}
                onChange={setField('phoneNumber')}
                required
                InputProps={{ readOnly }}
                sx={readOnlyFieldSx(readOnly)}
              />

              <Autocomplete
                options={COUNTRY_OPTIONS}
                value={form.country || null}
                onChange={(_, value) => setForm((prev) => ({ ...prev, country: value || '' }))}
                readOnly={readOnly}
                disableClearable={readOnly}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('COUNTRY')}
                    placeholder={t('CHOOSE_A_COUNTRY')}
                    required
                    InputProps={{
                      ...params.InputProps,
                      readOnly,
                    }}
                    sx={readOnlyFieldSx(readOnly)}
                  />
                )}
              />

              <TextField
                name="state"
                label={t('STATE_REGION')}
                value={form.state}
                onChange={setField('state')}
                required
                InputProps={{ readOnly }}
                sx={readOnlyFieldSx(readOnly)}
              />
              <TextField
                name="city"
                label={t('CITY')}
                value={form.city}
                onChange={setField('city')}
                required
                InputProps={{ readOnly }}
                sx={readOnlyFieldSx(readOnly)}
              />
              <TextField
                name="address"
                label={t('ADDRESS')}
                value={form.address}
                onChange={setField('address')}
                required
                InputProps={{ readOnly }}
                sx={readOnlyFieldSx(readOnly)}
              />
              <TextField
                name="zipCode"
                label={t('ZIP_CODE')}
                value={form.zipCode}
                onChange={setField('zipCode')}
                required
                InputProps={{ readOnly }}
                sx={readOnlyFieldSx(readOnly)}
              />
              <TextField
                name="company"
                label={t('COMPANY')}
                value={form.company}
                onChange={setField('company')}
                required
                InputProps={{ readOnly }}
                sx={readOnlyFieldSx(readOnly)}
              />
              <TextField
                select
                name="role"
                label={t('ROLE')}
                value={form.role}
                onChange={setField('role')}
                required
                SelectProps={{
                  displayEmpty: true,
                  readOnly,
                  IconComponent: readOnly ? () => null : undefined,
                }}
                InputProps={{ readOnly }}
                sx={readOnlyFieldSx(readOnly)}
              >
                <MenuItem value="">
                  <em>{t('SELECT_ROLE')}</em>
                </MenuItem>
                {USER_ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {!readOnly && (
              <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
                {currentUser && onCancelEdit && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancel}
                    disabled={submitting}
                  >
                    {t('CANCEL')}
                  </Button>
                )}
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting
                    ? '...'
                    : !currentUser
                      ? t('CREATE_STAFF')
                      : t('SAVE_CHANGES')}
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}
