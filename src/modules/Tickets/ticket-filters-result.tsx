import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack, { StackProps } from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

import Iconify from '@/components/iconify';
import { shortDateLabel } from '@/utils/short-date-label';

import type { TicketFilterValue, TicketFilters, TicketOperator } from '@/interfaces/ticket.interface';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: TicketFilters;
  onFilters: (name: string, value: TicketFilterValue) => void;
  canReset: boolean;
  onResetFilters: VoidFunction;
  results: number;
};

export default function TicketFiltersResult({
  filters,
  onFilters,
  canReset,
  onResetFilters,
  results,
  ...other
}: Props) {
  const { t } = useTranslation('index');

  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  const handleRemoveServices = (inputValue: string) => {
    onFilters(
      'services',
      filters.services.filter((item) => item !== inputValue)
    );
  };

  const handleRemoveAvailable = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  };

  const handleRemoveOperator = (inputValue: TicketOperator) => {
    onFilters(
      'operators',
      filters.operators.filter((item) => item.id !== inputValue.id)
    );
  };

  const handleRemoveDestination = (inputValue: string) => {
    onFilters(
      'destination',
      filters.destination.filter((item) => item !== inputValue)
    );
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          {t('RESULTS_FOUND')}
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.startDate && filters.endDate && (
          <Block label={t('AVAILABLE_LABEL')}>
            <Chip size="small" label={shortLabel} onDelete={handleRemoveAvailable} />
          </Block>
        )}

        {!!filters.services.length && (
          <Block label={t('SERVICES_LABEL')}>
            {filters.services.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveServices(item)} />
            ))}
          </Block>
        )}

        {!!filters.operators.length && (
          <Block label={t('OPERATOR_LABEL')}>
            {filters.operators.map((item) => (
              <Chip
                key={item.id}
                size="small"
                avatar={<Avatar alt={item.name} src={item.avatarUrl} />}
                label={item.name}
                onDelete={() => handleRemoveOperator(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.destination.length && (
          <Block label={t('DESTINATION_LABEL')}>
            {filters.destination.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveDestination(item)}
              />
            ))}
          </Block>
        )}

        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            {t('CLEAR')}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
