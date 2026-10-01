import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from '@/components/iconify';

import type { IBookingTableFilters, IBookingTableFilterValue } from './types';

// ----------------------------------------------------------------------

type Props = {
  filters: IBookingTableFilters;
  onFilters: (name: string, value: IBookingTableFilterValue) => void;
};

export default function BookingTableToolbar({ filters, onFilters }: Props) {
  const { t } = useTranslation('index');

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5 }}
    >
      <TextField
        fullWidth
        value={filters.name}
        onChange={handleFilterName}
        placeholder={t('SEARCH_BOOKING')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
