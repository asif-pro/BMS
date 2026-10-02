import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from 'react-i18next';

import Iconify from '@/components/iconify';

import { MAINTENANCE_TYPES } from '@/constants/maintenance.constant';
import type { IMaintenanceTableFilters, IMaintenanceTableFilterValue } from '@/interfaces/maintenance.interface';

// ----------------------------------------------------------------------

type Props = {
  filters: IMaintenanceTableFilters;
  onFilters: (name: string, value: IMaintenanceTableFilterValue) => void;
};

export default function MaintenanceTableToolbar({ filters, onFilters }: Props) {
  const { t } = useTranslation('index');

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterType = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('type', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'stretch', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5 }}
    >
      <TextField
        select
        label={t('TYPE')}
        value={filters.type}
        onChange={handleFilterType}
        sx={{ width: { xs: 1, md: 200 }, flexShrink: 0 }}
      >
        <MenuItem value="all">{t('ALL_TYPES')}</MenuItem>
        {MAINTENANCE_TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            {t(type.toUpperCase())}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filters.name}
        onChange={handleFilterName}
        placeholder={t('SEARCH_MAINTENANCE_PLACEHOLDER')}
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
