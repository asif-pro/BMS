import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

import Iconify from '@/components/iconify';

import type { IOrganizationFilters, IOrganizationFilterValue } from './types';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IOrganizationFilters;
  onFilters: (name: string, value: IOrganizationFilterValue) => void;
  canReset: boolean;
  onResetFilters: VoidFunction;
  results: number;
};

export default function OrganizationFiltersResult({
  filters,
  onFilters,
  canReset,
  onResetFilters,
  results,
  ...other
}: Props) {
  const { t } = useTranslation('index');

  const handleRemovePartnershipTypes = (inputValue: string) => {
    onFilters(
      'partnershipTypes',
      filters.partnershipTypes.filter((item) => item !== inputValue)
    );
  };

  const handleRemoveSize = () => {
    onFilters('size', 'all');
  };

  const handleRemoveCategories = (inputValue: string) => {
    onFilters(
      'categories',
      filters.categories.filter((item) => item !== inputValue)
    );
  };

  const handleRemoveLocations = (inputValue: string) => {
    onFilters(
      'locations',
      filters.locations.filter((item) => item !== inputValue)
    );
  };

  const handleRemoveServices = (inputValue: string) => {
    onFilters(
      'services',
      filters.services.filter((item) => item !== inputValue)
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
        {!!filters.partnershipTypes.length && (
          <Block label={t('PARTNERSHIP_LABEL')}>
            {filters.partnershipTypes.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemovePartnershipTypes(item)}
              />
            ))}
          </Block>
        )}

        {filters.size !== 'all' && (
          <Block label={t('SIZE_LABEL')}>
            <Chip size="small" label={filters.size} onDelete={handleRemoveSize} />
          </Block>
        )}

        {!!filters.categories.length && (
          <Block label={t('CATEGORIES_LABEL')}>
            {filters.categories.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveCategories(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.locations.length && (
          <Block label={t('LOCATIONS_LABEL')}>
            {filters.locations.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveLocations(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.services.length && (
          <Block label={t('SERVICES_LABEL')}>
            {filters.services.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveServices(item)}
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
