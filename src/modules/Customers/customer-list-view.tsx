import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';

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

import { _customerList } from './_mock';
import CustomerTableRow from './customer-table-row';
import { CustomerCardList } from './customer-card';
import CustomerTableToolbar from './customer-table-toolbar';
import CustomerTableFiltersResult from './customer-table-filters-result';
import type { ICustomerItem, ICustomerTableFilters, ICustomerTableFilterValue } from './types';

// ----------------------------------------------------------------------

type ViewMode = 'list' | 'grid';

const TABLE_HEAD = [
  { id: 'name', label: 'NAME' },
  { id: 'phoneNumber', label: 'PHONE_NUMBER', width: 200 },
  { id: 'ticketsPurchased', label: 'TICKETS_PURCHASED', width: 160 },
  { id: 'address', label: 'ADDRESS' },
  { id: '', width: 88 },
];

const defaultFilters: ICustomerTableFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function CustomerListView() {
  const { t } = useTranslation('index');
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 10 });
  const router = useRouter();

  const [view, setView] = useState<ViewMode>('list');
  const [tableData, setTableData] = useState<ICustomerItem[]>(_customerList);
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
    (name: string, value: ICustomerTableFilterValue) => {
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
      router.push(paths.dashboard.customers.details(id));
    },
    [router]
  );

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="CUSTOMERS"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_CUSTOMERS' },
        ]}
        action={
          <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
            <ToggleButton value="list" aria-label={t('LIST_VIEW')}>
              <Iconify icon="solar:list-bold" />
            </ToggleButton>
            <ToggleButton value="grid" aria-label={t('GRID_VIEW')}>
              <Iconify icon="mingcute:dot-grid-fill" />
            </ToggleButton>
          </ToggleButtonGroup>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CustomerTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <CustomerTableFiltersResult
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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataInPage.map((row) => (
                    <CustomerTableRow
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
          <CustomerCardList
            customers={dataInPage}
            onDelete={handleDeleteRow}
            onView={handleViewRow}
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
  inputData: ICustomerItem[];
  comparator: (a: any, b: any) => number;
  filters: ICustomerTableFilters;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (customer) =>
        customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        customer.phoneNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        customer.address.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
