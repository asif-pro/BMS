import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';

import { useBoolean } from '@/hooks/use-boolean';

import Iconify from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import type { ICustomerItem } from '@/interfaces/customer.interface';

// ----------------------------------------------------------------------

type Props = {
  row: ICustomerItem;
  onDeleteRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function CustomerTableRow({ row, onDeleteRow, onViewRow }: Props) {
  const { t } = useTranslation('index');
  const { name, avatarUrl, phoneNumber, address, ticketsPurchased } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow
        hover
        onClick={onViewRow}
        sx={{
          cursor: 'pointer',
          '& td': { cursor: 'pointer' },
        }}
      >
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />
          <ListItemText
            primary={name}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{ticketsPurchased}</TableCell>

        <TableCell>{address}</TableCell>

        <TableCell
          align="right"
          sx={{ px: 1, whiteSpace: 'nowrap', cursor: 'default !important' }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t('VIEW')}
        </MenuItem>

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
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('DELETE')}
          </Button>
        }
      />
    </>
  );
}
