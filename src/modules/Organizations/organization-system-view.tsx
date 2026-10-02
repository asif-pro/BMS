import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import { alpha } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';

import Label from '@/components/label';
import EmptyContent from '@/components/empty-content';
import Scrollbar from '@/components/scrollbar';
import { useSnackbar } from '@/components/snackbar';
import { TableHeadCustom } from '@/components/table';

import { useGetOrganizationUsers } from '@/hooks/useGetOrganizations.hook';
import type {
  IOrganizationUserAccount,
  IOrganizationUserAccountStatus,
} from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'USER_ID_NAME' },
  { id: 'role', label: 'ROLE', width: 180 },
  { id: 'status', label: 'ACCOUNT_STATUS', width: 160 },
  { id: 'actions', label: 'ACTION', width: 180 },
];

const STATUS_OPTIONS: {
  value: IOrganizationUserAccountStatus;
  labelKey: string;
}[] = [
  { value: 'active', labelKey: 'ACTIVE' },
  { value: 'inactive', labelKey: 'INACTIVE' },
  { value: 'suspended', labelKey: 'SUSPENDED' },
];

const STATUS_LABEL_KEYS: Record<IOrganizationUserAccountStatus, string> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  suspended: 'SUSPENDED',
};

const STATUS_COLORS: Record<
  IOrganizationUserAccountStatus,
  'success' | 'default' | 'error'
> = {
  active: 'success',
  inactive: 'default',
  suspended: 'error',
};

type Props = {
  organizationId: string;
};

export default function OrganizationSystemView({ organizationId }: Props) {
  const { t } = useTranslation('index');
  const { enqueueSnackbar } = useSnackbar();
  const { data: users = [] } = useGetOrganizationUsers(organizationId);

  const [tableData, setTableData] = useState<IOrganizationUserAccount[]>([]);

  useEffect(() => {
    setTableData(users);
  }, [users]);

  const handleStatusChange = useCallback(
    (id: string, status: IOrganizationUserAccountStatus) => {
      setTableData((prev) =>
        prev.map((user) => (user.id === id ? { ...user, status } : user))
      );
      enqueueSnackbar(t('UPDATE_SUCCESS'));
    },
    [enqueueSnackbar, t]
  );

  return (
    <Card>
      {tableData.length ? (
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 800 }}>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  bgcolor: 'background.paper',
                  boxShadow: (theme) => theme.customShadows.z8,
                  '& .MuiTableCell-head': {
                    bgcolor: 'background.paper',
                    borderBottom: (theme) =>
                      `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                  },
                }}
              />

              <TableBody>
                {tableData.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        alt={user.name}
                        src={user.avatarUrl}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <ListItemText
                        primary={user.name}
                        secondary={user.id}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                        secondaryTypographyProps={{
                          component: 'span',
                          typography: 'caption',
                          color: 'text.disabled',
                          noWrap: true,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.role}</TableCell>

                    <TableCell>
                      <Label variant="soft" color={STATUS_COLORS[user.status]}>
                        {t(STATUS_LABEL_KEYS[user.status])}
                      </Label>
                    </TableCell>

                    <TableCell>
                      <TextField
                        select
                        size="small"
                        fullWidth
                        value={user.status}
                        onChange={(event) =>
                          handleStatusChange(
                            user.id,
                            event.target.value as IOrganizationUserAccountStatus
                          )
                        }
                        inputProps={{ 'aria-label': t('ACTION') }}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {t(option.labelKey)}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      ) : (
        <EmptyContent title="NO_DATA" filled sx={{ py: 10, m: 3 }} />
      )}
    </Card>
  );
}
