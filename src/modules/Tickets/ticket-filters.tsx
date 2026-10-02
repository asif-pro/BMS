import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';

import type { TicketFilterValue, TicketFilters, TicketOperator } from '@/interfaces/ticket.interface';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  filters: TicketFilters;
  onFilters: (name: string, value: TicketFilterValue) => void;
  canReset: boolean;
  onResetFilters: VoidFunction;
  serviceOptions: string[];
  operatorOptions: TicketOperator[];
  destinationOptions: string[];
  dateError: boolean;
};

export default function TicketFilters({
  open,
  onOpen,
  onClose,
  filters,
  onFilters,
  canReset,
  onResetFilters,
  destinationOptions,
  operatorOptions,
  serviceOptions,
  dateError,
}: Props) {
  const { t } = useTranslation('index');
  const handleFilterServices = useCallback(
    (newValue: string) => {
      const checked = filters.services.includes(newValue)
        ? filters.services.filter((value) => value !== newValue)
        : [...filters.services, newValue];
      onFilters('services', checked);
    },
    [filters.services, onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Dayjs | null) => {
      onFilters('startDate', newValue ? newValue.toDate() : null);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Dayjs | null) => {
      onFilters('endDate', newValue ? newValue.toDate() : null);
    },
    [onFilters]
  );

  const renderHead = (
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
  );

  const renderDateRange = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {t('DURATIONS')}
      </Typography>
      <Stack spacing={2.5}>
        <DatePicker
          label={t('START_DATE')}
          value={filters.startDate ? dayjs(filters.startDate) : null}
          onChange={handleFilterStartDate}
        />

        <DatePicker
          label={t('END_DATE')}
          value={filters.endDate ? dayjs(filters.endDate) : null}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError ? t('DATE_ERROR_MESSAGE') : undefined,
            },
          }}
        />
      </Stack>
    </Stack>
  );

  const renderDestination = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {t('DESTINATION')}
      </Typography>

      <Autocomplete
        multiple
        disableCloseOnSelect
        options={destinationOptions}
        value={filters.destination}
        onChange={(event, newValue) => onFilters('destination', newValue)}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={filters.destination.length ? t('ADD_DESTINATION') : t('SELECT_DESTINATION')}
          />
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip {...getTagProps({ index })} key={option} size="small" variant="soft" label={option} />
          ))
        }
      />
    </Stack>
  );

  const renderOperators = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {t('OPERATOR')}
      </Typography>

      <Autocomplete
        multiple
        disableCloseOnSelect
        options={operatorOptions}
        value={filters.operators}
        onChange={(event, newValue) => onFilters('operators', newValue)}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField placeholder={t('SELECT_OPERATORS')} {...params} />}
        renderOption={(props, operator) => (
          <li {...props} key={operator.id}>
            <Avatar
              alt={operator.name}
              src={operator.avatarUrl}
              sx={{ width: 24, height: 24, flexShrink: 0, mr: 1 }}
            />
            {operator.name}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((operator, index) => (
            <Chip
              {...getTagProps({ index })}
              key={operator.id}
              size="small"
              variant="soft"
              label={operator.name}
              avatar={<Avatar alt={operator.name} src={operator.avatarUrl} />}
            />
          ))
        }
      />
    </Stack>
  );

  const renderServices = (
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
          label={
            option === 'Wi-Fi'
              ? t('AMENITY_WIFI')
              : option === 'Food'
                ? t('AMENITY_FOOD')
                : option === 'Toilet'
                  ? t('AMENITY_TOILET')
                  : option === 'AC'
                    ? t('AMENITY_AC')
                    : option === 'Extra luggage'
                      ? t('AMENITY_EXTRA_LUGGAGE')
                      : option
          }
        />
      ))}
    </Stack>
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
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              {renderDateRange}
              {renderDestination}
              {renderOperators}
              {renderServices}
            </Stack>
          </LocalizationProvider>
        </Scrollbar>
      </Drawer>
    </>
  );
}
