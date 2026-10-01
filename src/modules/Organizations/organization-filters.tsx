import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';

import type { IOrganizationFilters, IOrganizationFilterValue } from './types';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  filters: IOrganizationFilters;
  onFilters: (name: string, value: IOrganizationFilterValue) => void;
  canReset: boolean;
  onResetFilters: VoidFunction;
  categoryOptions: string[];
  serviceOptions: string[];
  sizeOptions: string[];
  partnershipTypeOptions: string[];
  locationOptions: string[];
};

export default function OrganizationFilters({
  open,
  onOpen,
  onClose,
  filters,
  onFilters,
  canReset,
  onResetFilters,
  categoryOptions,
  locationOptions,
  serviceOptions,
  sizeOptions,
  partnershipTypeOptions,
}: Props) {
  const { t } = useTranslation('index');

  const handleFilterPartnershipTypes = useCallback(
    (newValue: string) => {
      const checked = filters.partnershipTypes.includes(newValue)
        ? filters.partnershipTypes.filter((value) => value !== newValue)
        : [...filters.partnershipTypes, newValue];
      onFilters('partnershipTypes', checked);
    },
    [filters.partnershipTypes, onFilters]
  );

  const handleFilterSize = useCallback(
    (newValue: string) => {
      onFilters('size', newValue);
    },
    [onFilters]
  );

  const handleFilterCategories = useCallback(
    (newValue: string[]) => {
      onFilters('categories', newValue);
    },
    [onFilters]
  );

  const handleFilterLocations = useCallback(
    (newValue: string[]) => {
      onFilters('locations', newValue);
    },
    [onFilters]
  );

  const handleFilterServices = useCallback(
    (newValue: string) => {
      const checked = filters.services.includes(newValue)
        ? filters.services.filter((value) => value !== newValue)
        : [...filters.services, newValue];
      onFilters('services', checked);
    },
    [filters.services, onFilters]
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        {t('FILTERS')}
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 2, pr: 1, pl: 2.5 }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('FILTERS')}
          </Typography>

          <Tooltip title={t('RESET')}>
            <IconButton onClick={onResetFilters}>
              <Badge color="error" variant="dot" invisible={!canReset}>
                <Iconify icon="solar:restart-bold" />
              </Badge>
            </IconButton>
          </Tooltip>

          <IconButton onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('PARTNERSHIP_TYPES')}
              </Typography>
              {partnershipTypeOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={filters.partnershipTypes.includes(option)}
                      onClick={() => handleFilterPartnershipTypes(option)}
                    />
                  }
                  label={option}
                />
              ))}
            </Stack>

            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('FLEET_SIZE')}
              </Typography>
              {sizeOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Radio
                      checked={option === filters.size}
                      onClick={() => handleFilterSize(option)}
                    />
                  }
                  label={option === 'all' ? t('ALL') : option}
                  sx={{
                    ...(option === 'all' && {
                      textTransform: 'capitalize',
                    }),
                  }}
                />
              ))}
            </Stack>

            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                {t('CATEGORIES')}
              </Typography>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={categoryOptions}
                getOptionLabel={(option) => option}
                value={filters.categories}
                onChange={(_event, newValue) => handleFilterCategories(newValue)}
                renderInput={(params) => (
                  <TextField placeholder={t('SELECT_CATEGORIES')} {...params} />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      variant="soft"
                    />
                  ))
                }
              />
            </Stack>

            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                {t('LOCATIONS')}
              </Typography>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={locationOptions}
                getOptionLabel={(option) => option}
                value={filters.locations}
                onChange={(_event, newValue) => handleFilterLocations(newValue)}
                renderInput={(params) => (
                  <TextField
                    placeholder={
                      filters.locations.length ? t('ADD_LOCATIONS') : t('SELECT_LOCATIONS')
                    }
                    {...params}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      variant="soft"
                    />
                  ))
                }
              />
            </Stack>

            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('SERVICES')}
              </Typography>
              {serviceOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={filters.services.includes(option)}
                      onClick={() => handleFilterServices(option)}
                    />
                  }
                  label={option}
                />
              ))}
            </Stack>
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
