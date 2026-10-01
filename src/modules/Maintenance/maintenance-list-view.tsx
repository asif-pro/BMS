import sumBy from 'lodash/sumBy';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from '@/routes/paths';

import Label from '@/components/label';
import Scrollbar from '@/components/scrollbar';
import { useSnackbar } from '@/components/snackbar';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '@/components/table';

import { _maintenanceList } from './_mock';
import MaintenanceAnalytic from './maintenance-analytic';
import MaintenanceTableRow from './maintenance-table-row';
import MaintenanceTableToolbar from './maintenance-table-toolbar';
import type {
  IMaintenanceItem,
  IMaintenanceStatus,
  IMaintenanceTableFilters,
  IMaintenanceTableFilterValue,
} from './types';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleName', label: 'VEHICLE' },
  { id: 'title', label: 'SERVICE' },
  { id: 'type', label: 'TYPE', width: 120 },
  { id: 'scheduledDate', label: 'SCHEDULED', width: 130 },
  { id: 'completedDate', label: 'COMPLETED', width: 130 },
  { id: 'odometer', label: 'ODOMETER', width: 130 },
  { id: 'cost', label: 'COST', width: 120 },
  { id: 'status', label: 'STATUS', width: 130 },
  { id: '', width: 88 },
];

const defaultFilters: IMaintenanceTableFilters = {
  name: '',
  type: 'all',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function MaintenanceListView() {
  const { t } = useTranslation('index');
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'scheduledDate',
    defaultOrder: 'desc',
  });

  const [tableData, setTableData] = useState<IMaintenanceItem[]>(_maintenanceList);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;
  const notFound = !dataFiltered.length;

  const getLength = (status: IMaintenanceStatus) =>
    tableData.filter((item) => item.status === status).length;

  const getTotalCost = (status: IMaintenanceStatus) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'cost'
    );

  const getPercentByStatus = (status: IMaintenanceStatus) =>
    tableData.length ? (getLength(status) / tableData.length) * 100 : 0;

  const TABS = [
    { value: 'all', label: t('ALL'), color: 'default', count: tableData.length },
    { value: 'scheduled', label: t('SCHEDULED'), color: 'info', count: getLength('scheduled') },
    {
      value: 'in_progress',
      label: t('IN_PROGRESS'),
      color: 'warning',
      count: getLength('in_progress'),
    },
    { value: 'completed', label: t('COMPLETED'), color: 'success', count: getLength('completed') },
    { value: 'overdue', label: t('OVERDUE'), color: 'error', count: getLength('overdue') },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: IMaintenanceTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleFilterStatus = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      enqueueSnackbar(t('DELETE_SUCCESS'));
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, t, table, tableData]
  );

  const handleCompleteRow = useCallback(
    (id: string) => {
      setTableData((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, status: 'completed' as const, completedDate: new Date() }
            : row
        )
      );
      enqueueSnackbar(t('MAINTENANCE_COMPLETED_SUCCESS'));
    },
    [enqueueSnackbar, t]
  );

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="MAINTENANCE"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_FLEET', href: paths.dashboard.vehicles.root },
          { name: 'NAV_MAINTENANCE' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: { xs: 3, md: 5 } }}>
        <Scrollbar>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <MaintenanceAnalytic
              title={t('TOTAL')}
              total={tableData.length}
              percent={100}
              price={sumBy(tableData, 'cost')}
              icon="solar:bill-list-bold-duotone"
              color={theme.palette.info.main}
            />

            <MaintenanceAnalytic
              title={t('SCHEDULED')}
              total={getLength('scheduled')}
              percent={getPercentByStatus('scheduled')}
              price={getTotalCost('scheduled')}
              icon="solar:calendar-date-bold-duotone"
              color={theme.palette.primary.main}
            />

            <MaintenanceAnalytic
              title={t('IN_PROGRESS')}
              total={getLength('in_progress')}
              percent={getPercentByStatus('in_progress')}
              price={getTotalCost('in_progress')}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.warning.main}
            />

            <MaintenanceAnalytic
              title={t('COMPLETED')}
              total={getLength('completed')}
              percent={getPercentByStatus('completed')}
              price={getTotalCost('completed')}
              icon="solar:file-check-bold-duotone"
              color={theme.palette.success.main}
            />

            <MaintenanceAnalytic
              title={t('OVERDUE')}
              total={getLength('overdue')}
              percent={getPercentByStatus('overdue')}
              price={getTotalCost('overdue')}
              icon="solar:bell-bing-bold-duotone"
              color={theme.palette.error.main}
            />
          </Stack>
        </Scrollbar>
      </Card>

      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <MaintenanceTableToolbar filters={filters} onFilters={handleFilters} />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1100 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataInPage.map((row) => (
                  <MaintenanceTableRow
                    key={row.id}
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onCompleteRow={() => handleCompleteRow(row.id)}
                  />
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
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IMaintenanceItem[];
  comparator: ReturnType<typeof getComparator<string>>;
  filters: IMaintenanceTableFilters;
}) {
  const { name, type, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(
      {
        ...a[0],
        scheduledDate: a[0].scheduledDate.getTime(),
        completedDate: a[0].completedDate ? a[0].completedDate.getTime() : 0,
      },
      {
        ...b[0],
        scheduledDate: b[0].scheduledDate.getTime(),
        completedDate: b[0].completedDate ? b[0].completedDate.getTime() : 0,
      }
    );
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let data = stabilizedThis.map((el) => el[0]);

  if (status !== 'all') {
    data = data.filter((item) => item.status === status);
  }

  if (type !== 'all') {
    data = data.filter((item) => item.type === type);
  }

  if (name) {
    const query = name.toLowerCase();
    data = data.filter(
      (item) =>
        item.vehicleName.toLowerCase().includes(query) ||
        item.plateNumber.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.workshop.toLowerCase().includes(query)
    );
  }

  return data;
}
