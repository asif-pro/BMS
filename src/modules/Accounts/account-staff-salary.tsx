import sumBy from 'lodash/sumBy';
import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';

import { fTaka } from '@/utils/format-number';
import { fDate } from '@/utils/format-time';

import Label from '@/components/label';
import Scrollbar from '@/components/scrollbar';
import { useTranslation } from 'react-i18next';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '@/components/table';

import type { IStaffSalaryItem } from './types';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'STAFF' },
  { id: 'role', label: 'ROLE', width: 120 },
  { id: 'department', label: 'DEPARTMENT', width: 130 },
  { id: 'baseSalary', label: 'BASE', width: 120 },
  { id: 'allowance', label: 'ALLOWANCE', width: 120 },
  { id: 'deduction', label: 'DEDUCTION', width: 120 },
  { id: 'netSalary', label: 'NET_PAY', width: 130 },
  { id: 'status', label: 'STATUS', width: 120 },
  { id: 'paidAt', label: 'PAID_ON', width: 130 },
];

type Props = {
  title?: string;
  subheader?: string;
  tableData: IStaffSalaryItem[];
};

export default function AccountStaffSalary({
  title,
  subheader,
  tableData,
}: Props) {
  const { t } = useTranslation('index');
  const cardTitle = title ?? t('STAFF_SALARY');
  const cardSubheader = subheader ?? t('STAFF_SALARY_SUBHEADER');
  const table = useTable({
    defaultRowsPerPage: 8,
    defaultOrderBy: 'netSalary',
    defaultOrder: 'desc',
  });

  const roles = useMemo(
    () => Array.from(new Set(tableData.map((item) => item.role))).sort(),
    [tableData]
  );

  const [roleFilter, setRoleFilter] = useState('all');

  const dataFiltered = useMemo(() => {
    const filtered =
      roleFilter === 'all' ? tableData : tableData.filter((item) => item.role === roleFilter);

    const comparator = getComparator(table.order, table.orderBy);
    const stabilized = filtered.map((el, index) => [el, index] as const);

    stabilized.sort((a, b) => {
      const order = comparator(
        {
          ...a[0],
          paidAt: a[0].paidAt ? a[0].paidAt.getTime() : 0,
        },
        {
          ...b[0],
          paidAt: b[0].paidAt ? b[0].paidAt.getTime() : 0,
        }
      );
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilized.map((el) => el[0]);
  }, [roleFilter, table.order, table.orderBy, tableData]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 64 : 80;
  const notFound = !dataFiltered.length;

  const totals = useMemo(() => {
    const paid = dataFiltered.filter((item) => item.status === 'paid');
    const pending = dataFiltered.filter((item) => item.status !== 'paid');

    return {
      payroll: sumBy(dataFiltered, 'netSalary'),
      paid: sumBy(paid, 'netSalary'),
      pending: sumBy(pending, 'netSalary'),
      count: dataFiltered.length,
    };
  }, [dataFiltered]);

  const handleRoleFilter = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRoleFilter(event.target.value);
      table.onResetPage();
    },
    [table]
  );

  return (
    <Card>
      <CardHeader
        title={cardTitle}
        subheader={cardSubheader}
        sx={{ mb: 1 }}
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              {t('STAFF')} {totals.count}
            </Typography>
            <Typography variant="caption" sx={{ color: 'warning.main', whiteSpace: 'nowrap' }}>
              {t('PAYROLL')} {fTaka(totals.payroll)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'success.main', whiteSpace: 'nowrap' }}>
              {t('PAID')} {fTaka(totals.paid)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'error.main', whiteSpace: 'nowrap' }}>
              {t('DUE')} {fTaka(totals.pending)}
            </Typography>
          </Stack>
        }
      />

      <Stack direction="row" sx={{ px: 2.5, pb: 2 }}>
        <TextField
          select
          size="small"
          label={t('ROLE')}
          value={roleFilter}
          onChange={handleRoleFilter}
          sx={{ width: { xs: 1, sm: 200 } }}
        >
          <MenuItem value="all">{t('ALL_ROLES')}</MenuItem>
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1080 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              onSort={table.onSort}
            />

            <TableBody>
              {dataInPage.map((row) => (
                <StaffSalaryRow key={row.id} row={row} />
              ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowProps = {
  row: IStaffSalaryItem;
};

function StaffSalaryRow({ row }: RowProps) {
  const { t } = useTranslation('index');

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={row.name} src={row.avatarUrl} />
          <ListItemText
            primary={row.name}
            secondary={row.monthLabel}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
          />
        </Stack>
      </TableCell>

      <TableCell>
        <Label variant="soft">{row.role}</Label>
      </TableCell>

      <TableCell>{row.department}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fTaka(row.baseSalary)}</TableCell>

      <TableCell sx={{ color: 'success.main', whiteSpace: 'nowrap' }}>
        +{fTaka(row.allowance)}
      </TableCell>

      <TableCell sx={{ color: 'error.main', whiteSpace: 'nowrap' }}>
        -{fTaka(row.deduction)}
      </TableCell>

      <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{fTaka(row.netSalary)}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'paid' && 'success') ||
            (row.status === 'processing' && 'info') ||
            'warning'
          }
        >
          {t(row.status.toUpperCase())}
        </Label>
      </TableCell>

      <TableCell sx={{ color: 'text.secondary' }}>
        {row.paidAt ? fDate(row.paidAt) : '—'}
      </TableCell>
    </TableRow>
  );
}
