import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';

import { useBoolean } from '@/hooks/use-boolean';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import UserQuickEditForm from './user-quick-edit-form';
import type { IUserItem } from '@/interfaces/user.interface';

// ----------------------------------------------------------------------

type Props = {
  onViewRow: VoidFunction;
  row: IUserItem;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({ row, onViewRow, onDeleteRow }: Props) {
  const { t } = useTranslation('index');

  const { name, avatarUrl, company, role, status, email, phoneNumber } = row;

  const confirm = useBoolean();
  const quickEdit = useBoolean();
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
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{company}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{role}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'active' && 'success') ||
              (status === 'pending' && 'warning') ||
              (status === 'banned' && 'error') ||
              'default'
            }
          >
            {t(status.toUpperCase())}
          </Label>
        </TableCell>

        <TableCell
          align="right"
          sx={{ px: 1, whiteSpace: 'nowrap', cursor: 'default !important' }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Tooltip title={t('QUICK_EDIT')} placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

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
