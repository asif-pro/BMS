import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

import Iconify from '@/components/iconify';
import CustomPopover, { usePopover } from '@/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  sort: string;
  onSort: (newValue: string) => void;
  sortOptions: {
    value: string;
    labelKey: string;
  }[];
};

export default function OrganizationSort({ sort, onSort, sortOptions }: Props) {
  const { t } = useTranslation('index');
  const popover = usePopover();

  const currentLabel =
    sortOptions.find((option) => option.value === sort)?.labelKey || sort;

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold' }}
      >
        {t('SORT_BY')}
        <Box
          component="span"
          sx={{
            ml: 0.5,
            fontWeight: 'fontWeightBold',
            textTransform: 'capitalize',
          }}
        >
          {t(currentLabel)}
        </Box>
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sort}
            onClick={() => {
              popover.onClose();
              onSort(option.value);
            }}
          >
            {t(option.labelKey)}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
