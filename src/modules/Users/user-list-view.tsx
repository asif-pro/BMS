import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { RouterLink } from '@/routes/components';

import { useGetStaffByRole } from '@/hooks/useGetAnalytics.hook';
import DashboardStaffOverview from '@/modules/Dashboard/components/dashboard-staff-overview';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import EmptyContent from '@/components/empty-content';
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

import { USER_ROLES, USER_STATUS_TAB_OPTIONS } from '@/constants/user.constant';
import { useGetUsers } from '@/hooks/useGetUsers.hook';
import UserTableRow from './user-table-row';
import { StaffCardList } from './staff-card';
import UserTableToolbar from './user-table-toolbar';
import UserTableFiltersResult from './user-table-filters-result';
import type { IUserItem, IUserTableFilters, IUserTableFilterValue } from '@/interfaces/user.interface';

// ----------------------------------------------------------------------

type ViewMode = 'list' | 'grid';

const TABLE_HEAD = [
  { id: 'name', label: 'NAME' },
  { id: 'phoneNumber', label: 'PHONE_NUMBER', width: 180 },
  { id: 'company', label: 'COMPANY', width: 220 },
  { id: 'role', label: 'ROLE', width: 180 },
  { id: 'status', label: 'STATUS', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters: IUserTableFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function UserListView() {
  const { t } = useTranslation('index');
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 10 });

  const router = useRouter();

  const [view, setView] = useState<ViewMode>('list');

  const { data: usersData = [] } = useGetUsers();
  const { data: staffByRole = [] } = useGetStaffByRole();
  const [tableData, setTableData] = useState<IUserItem[]>([]);

  useEffect(() => {
    setTableData(usersData);
  }, [usersData]);

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

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleChangeView = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newView: ViewMode | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );

  const handleFilters = useCallback(
    (name: string, value: IUserTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar(t('DELETE_SUCCESS'));

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, t, table, tableData]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="USER_LIST"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_USER', href: paths.dashboard.user.root },
          { name: 'LIST' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('ADD_STAFF')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DashboardStaffOverview
        title={t('STAFF_OVERVIEW')}
        compact
        list={staffByRole.map((item) => ({
          ...item,
          icon: 'solar:user-bold-duotone',
        }))}
        sx={{ mb: 3 }}
      />

      <Card>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{
            pr: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            {USER_STATUS_TAB_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={t(tab.label)}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <ToggleButtonGroup
            size="small"
            value={view}
            exclusive
            onChange={handleChangeView}
            sx={{ flexShrink: 0 }}
          >
            <ToggleButton value="list" aria-label={t('LIST_VIEW')}>
              <Iconify icon="solar:list-bold" />
            </ToggleButton>
            <ToggleButton value="grid" aria-label={t('GRID_VIEW')}>
              <Iconify icon="mingcute:dot-grid-fill" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <UserTableToolbar filters={filters} onFilters={handleFilters} roleOptions={USER_ROLES} />

        {canReset && (
          <UserTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        {view === 'list' ? (
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataInPage.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
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
        ) : notFound ? (
          <EmptyContent title="NO_DATA" filled sx={{ py: 10, m: 3 }} />
        ) : (
          <StaffCardList
            staff={dataInPage}
            onView={handleViewRow}
            onDelete={handleDeleteRow}
          />
        )}

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={view === 'list' ? table.dense : undefined}
          onChangeDense={view === 'list' ? table.onChangeDense : undefined}
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
  inputData: IUserItem[];
  comparator: (a: any, b: any) => number;
  filters: IUserTableFilters;
}) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
