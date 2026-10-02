import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

import Iconify from '@/components/iconify';

import { ORGANIZATION_STATUS_LABEL_KEYS } from '@/constants/organization.constant';
import type {
  IOrganizationFilters,
  IOrganizationFilterValue,
  IOrganizationStatus,
} from '@/interfaces/organization.interface';

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

  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  const handleRemoveSubscriptionPlans = (inputValue: string) => {
    onFilters(
      'subscriptionPlans',
      filters.subscriptionPlans.filter((item) => item !== inputValue)
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
        {filters.status !== 'all' && (
          <Block label={t('STATUS_LABEL')}>
            <Chip
              size="small"
              label={t(ORGANIZATION_STATUS_LABEL_KEYS[filters.status as IOrganizationStatus])}
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {!!filters.subscriptionPlans.length && (
          <Block label={t('SUBSCRIPTION_PLAN_LABEL')}>
            {filters.subscriptionPlans.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveSubscriptionPlans(item)}
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
