import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from '@/routes/paths';

import Scrollbar from '@/components/scrollbar';
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

import { useGetBookings } from '@/hooks/useGetBookings.hook';

import BookingTableRow from './booking-table-row';
import BookingTableToolbar from './booking-table-toolbar';
import type { IBookingItem, IBookingTableFilters, IBookingTableFilterValue } from '@/interfaces/booking.interface';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'route', label: 'TRIP' },
  { id: 'bookedBy', label: 'BOOKED_BY', width: 180 },
  { id: 'passengerName', label: 'PASSENGER', width: 180 },
  { id: 'tickets', label: 'TICKETS', width: 100 },
  { id: 'discount', label: 'DISCOUNT', width: 120 },
  { id: 'price', label: 'PRICE', width: 120 },
  { id: 'bookedAt', label: 'DATE', width: 160 },
  { id: 'tripStatus', label: 'STATUS', width: 130 },
];

const defaultFilters: IBookingTableFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function BookingListView() {
  const table = useTable({ defaultRowsPerPage: 10, defaultOrderBy: 'bookedAt', defaultOrder: 'desc' });

  const { data: bookingsData = [] } = useGetBookings();
  const [tableData, setTableData] = useState<IBookingItem[]>([]);

  useEffect(() => {
    setTableData(bookingsData);
  }, [bookingsData]);
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

  const denseHeight = table.dense ? 72 : 72 + 20;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IBookingTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="BOOKINGS"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_BOOKINGS' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <BookingTableToolbar filters={filters} onFilters={handleFilters} />

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
                  <BookingTableRow key={row.id} row={row} />
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
  inputData: IBookingItem[];
  comparator: (a: any, b: any) => number;
  filters: IBookingTableFilters;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(
      {
        ...a[0],
        bookedAt: a[0].bookedAt.getTime(),
      },
      {
        ...b[0],
        bookedAt: b[0].bookedAt.getTime(),
      }
    );
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  let data = stabilizedThis.map((el) => el[0]);

  if (name) {
    const query = name.toLowerCase();
    data = data.filter(
      (booking) =>
        booking.route.toLowerCase().includes(query) ||
        booking.bookedBy.toLowerCase().includes(query) ||
        booking.bookedByRole.toLowerCase().includes(query) ||
        booking.passengerName.toLowerCase().includes(query) ||
        booking.passengerPhone.toLowerCase().includes(query)
    );
  }

  return data;
}
