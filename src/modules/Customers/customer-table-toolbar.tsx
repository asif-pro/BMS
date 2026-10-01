import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from '@/components/iconify';

import type { ICustomerTableFilters, ICustomerTableFilterValue } from './types';

// ----------------------------------------------------------------------

type Props = {
  filters: ICustomerTableFilters;
  onFilters: (name: string, value: ICustomerTableFilterValue) => void;
};

export default function CustomerTableToolbar({ filters, onFilters }: Props) {
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
        placeholder={t('SEARCH_CUSTOMER')}
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
