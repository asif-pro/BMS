import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useSnackbar } from '@/components/snackbar';

import { _roles, USER_STATUS_OPTIONS } from './_mock';
import type { IUserItem } from './types';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
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
  status: string;
  company: string;
  role: string;
};

const emptyForm: FormState = {
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  status: 'active',
  company: '',
  role: '',
};

export default function UserQuickEditForm({ currentUser, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      status: currentUser?.status || 'active',
      company: currentUser?.company || '',
      role: currentUser?.role || '',
    });
  }, [currentUser, open]);

  const setField = (name: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onClose();
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <TextField select name="status" label="Status" value={form.status} onChange={setField('status')}>
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <TextField name="name" label="Full Name" value={form.name} onChange={setField('name')} required />
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
            <TextField name="country" label="Country" value={form.country} onChange={setField('country')} required />
            <TextField name="state" label="State/Region" value={form.state} onChange={setField('state')} required />
            <TextField name="city" label="City" value={form.city} onChange={setField('city')} required />
            <TextField name="address" label="Address" value={form.address} onChange={setField('address')} required />
            <TextField name="zipCode" label="Zip/Code" value={form.zipCode} onChange={setField('zipCode')} />
            <TextField name="company" label="Company" value={form.company} onChange={setField('company')} required />
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
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
