import sumBy from 'lodash/sumBy';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
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
import Badge, { badgeClasses } from '@mui/material/Badge';

import { fTaka } from '@/utils/format-number';
import { fDate, fTime } from '@/utils/format-time';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
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

import { CATEGORY_ICONS, getTransactionMonthOptions } from './_mock';
import type { ITransactionItem } from './types';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'description', label: 'DESCRIPTION' },
  { id: 'type', label: 'TYPE', width: 120 },
  { id: 'category', label: 'CATEGORY', width: 140 },
  { id: 'date', label: 'DATE', width: 160 },
  { id: 'amount', label: 'AMOUNT', width: 140 },
  { id: 'status', label: 'STATUS', width: 120 },
  { id: 'ref', label: 'REF', width: 130 },
];

type Props = {
  title?: string;
  subheader?: string;
  tableData: ITransactionItem[];
};

export default function AccountTransactionsTable({
  title,
  subheader,
  tableData,
}: Props) {
  const { t } = useTranslation('index');
  const cardTitle = title ?? t('INCOME_AND_EXPENSES');
  const cardSubheader = subheader ?? t('INCOME_EXPENSES_SUBHEADER');
  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'date',
    defaultOrder: 'desc',
  });

  const monthOptions = useMemo(() => getTransactionMonthOptions(tableData), [tableData]);

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]?.value || '');

  const dataFiltered = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);

    const filtered = tableData.filter((item) => {
      if (!selectedMonth) return true;
      return item.date.getFullYear() === year && item.date.getMonth() === month;
    });

    const comparator = getComparator(table.order, table.orderBy);
    const stabilized = filtered.map((el, index) => [el, index] as const);

    stabilized.sort((a, b) => {
      const order = comparator(
        { ...a[0], date: a[0].date.getTime() },
        { ...b[0], date: b[0].date.getTime() }
      );
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilized.map((el) => el[0]);
  }, [selectedMonth, table.order, table.orderBy, tableData]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 72 : 92;
  const notFound = !dataFiltered.length;

  const monthTotals = useMemo(() => {
    const income = sumBy(
      dataFiltered.filter((item) => item.type === 'Income'),
      'amount'
    );
    const expense = sumBy(
      dataFiltered.filter((item) => item.type === 'Expense'),
      'amount'
    );

    return { income, expense, net: income - expense };
  }, [dataFiltered]);

  const handleMonthChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedMonth(event.target.value);
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
            <Typography variant="caption" sx={{ color: 'success.main', whiteSpace: 'nowrap' }}>
              {t('INCOME')} {fTaka(monthTotals.income)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'error.main', whiteSpace: 'nowrap' }}>
              {t('EXPENSE')} {fTaka(monthTotals.expense)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              {t('NET')} {fTaka(monthTotals.net)}
            </Typography>
          </Stack>
        }
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        sx={{ px: 2.5, pb: 2 }}
      >
        <TextField
          select
          size="small"
          label={t('MONTH')}
          value={selectedMonth}
          onChange={handleMonthChange}
          sx={{ width: { xs: 1, sm: 220 } }}
        >
          {monthOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              onSort={table.onSort}
            />

            <TableBody>
              {dataInPage.map((row) => (
                <AccountTransactionRow key={row.id} row={row} />
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
  row: ITransactionItem;
};

function AccountTransactionRow({ row }: RowProps) {
  const { t } = useTranslation('index');
  const isIncome = row.type === 'Income';

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ position: 'relative' }}>
            <Badge
              overlap="circular"
              color={isIncome ? 'success' : 'error'}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Iconify
                  icon={
                    isIncome
                      ? 'eva:diagonal-arrow-left-down-fill'
                      : 'eva:diagonal-arrow-right-up-fill'
                  }
                  width={16}
                />
              }
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  p: 0,
                  width: 20,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  color: 'text.secondary',
                  bgcolor: 'background.neutral',
                }}
              >
                <Iconify icon={CATEGORY_ICONS[row.category]} width={22} />
              </Avatar>
            </Badge>
          </Box>

          <ListItemText
            primary={row.description}
            secondary={row.ref}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
          />
        </Stack>
      </TableCell>

      <TableCell>
        <Label variant="soft" color={isIncome ? 'success' : 'warning'}>
          {t(row.type.toUpperCase())}
        </Label>
      </TableCell>

      <TableCell>{row.category}</TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.date)}
          secondary={fTime(row.date)}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell
        sx={{
          color: isIncome ? 'success.main' : 'error.main',
          whiteSpace: 'nowrap',
          fontWeight: 600,
        }}
      >
        {isIncome ? '+' : '-'}
        {fTaka(row.amount)}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'completed' && 'success') ||
            (row.status === 'pending' && 'warning') ||
            'error'
          }
        >
          {t(row.status.toUpperCase())}
        </Label>
      </TableCell>

      <TableCell sx={{ color: 'text.secondary' }}>{row.ref}</TableCell>
    </TableRow>
  );
}
