import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';

import { ORGANIZATION_STATUS_LABEL_KEYS } from '@/constants/organization.constant';
import type {
  IOrganizationFilters,
  IOrganizationFilterValue,
  IOrganizationStatus,
} from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

type StatusOption = {
  value: string;
  labelKey: string;
};

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  filters: IOrganizationFilters;
  onFilters: (name: string, value: IOrganizationFilterValue) => void;
  canReset: boolean;
  onResetFilters: VoidFunction;
  statusOptions: StatusOption[];
  subscriptionPlanOptions: string[];
};

export default function OrganizationFilters({
  open,
  onOpen,
  onClose,
  filters,
  onFilters,
  canReset,
  onResetFilters,
  statusOptions,
  subscriptionPlanOptions,
}: Props) {
  const { t } = useTranslation('index');

  const handleFilterStatus = useCallback(
    (newValue: string) => {
      onFilters('status', newValue);
    },
    [onFilters]
  );

  const handleFilterSubscriptionPlans = useCallback(
    (newValue: string) => {
      const checked = filters.subscriptionPlans.includes(newValue)
        ? filters.subscriptionPlans.filter((value) => value !== newValue)
        : [...filters.subscriptionPlans, newValue];
      onFilters('subscriptionPlans', checked);
    },
    [filters.subscriptionPlans, onFilters]
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
                {t('STATUS')}
              </Typography>
              {statusOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Radio
                      checked={option.value === filters.status}
                      onClick={() => handleFilterStatus(option.value)}
                    />
                  }
                  label={
                    option.value === 'all'
                      ? t('ALL')
                      : t(
                          ORGANIZATION_STATUS_LABEL_KEYS[option.value as IOrganizationStatus] ||
                            option.labelKey
                        )
                  }
                  sx={{
                    ...(option.value === 'all' && {
                      textTransform: 'capitalize',
                    }),
                  }}
                />
              ))}
            </Stack>

            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('SUBSCRIPTION_PLAN')}
              </Typography>
              {subscriptionPlanOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={filters.subscriptionPlans.includes(option)}
                      onClick={() => handleFilterSubscriptionPlans(option)}
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
