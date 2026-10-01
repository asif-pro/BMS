import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';

import { useBoolean } from '@/hooks/use-boolean';

import { fTaka, fNumber } from '@/utils/format-number';
import { fDate } from '@/utils/format-time';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import type { IMaintenanceItem, IMaintenanceStatus } from './types';

// ----------------------------------------------------------------------

type Props = {
  row: IMaintenanceItem;
  onDeleteRow: VoidFunction;
  onCompleteRow: VoidFunction;
};

const STATUS_COLORS: Record<IMaintenanceStatus, 'info' | 'warning' | 'success' | 'error'> = {
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  overdue: 'error',
};

export default function MaintenanceTableRow({ row, onDeleteRow, onCompleteRow }: Props) {
  const { t } = useTranslation('index');

  const {
    vehicleName,
    plateNumber,
    type,
    title,
    cost,
    status,
    scheduledDate,
    completedDate,
    workshop,
    odometer,
  } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell>
          <ListItemText
            primary={vehicleName}
            secondary={plateNumber}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={title}
            secondary={workshop}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (type === 'emergency' && 'error') ||
              (type === 'repair' && 'warning') ||
              (type === 'inspection' && 'info') ||
              'default'
            }
          >
            {t(type.toUpperCase())}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(scheduledDate)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {completedDate ? fDate(completedDate) : '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fNumber(odometer)} km</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fTaka(cost)}</TableCell>

        <TableCell>
          <Label variant="soft" color={STATUS_COLORS[status]}>
            {t(status.toUpperCase())}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 190 }}
      >
        {status !== 'completed' && (
          <MenuItem
            onClick={() => {
              onCompleteRow();
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:checkmark-circle-2-fill" />
            {t('MARK_AS_COMPLETED')}
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('DELETE')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('DELETE')}
        content={t('DELETE_CONFIRM_QUESTION')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            {t('DELETE')}
          </Button>
        }
      />
    </>
  );
}
