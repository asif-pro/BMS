import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Container from '@mui/material/Container';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { RouterLink } from '@/routes/components';

import { useBoolean } from '@/hooks/use-boolean';

import { isAfter, isBetween } from '@/utils/format-time';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import EmptyContent from '@/components/empty-content';
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

import { ticketPaths } from './paths';
import TicketList from './ticket-list';
import TicketSearch from './ticket-search';
import TicketFilters from './ticket-filters';
import TicketTableRow from './ticket-table-row';
import TicketFiltersResult from './ticket-filters-result';
import { _operators, _tickets, DESTINATIONS, TICKET_SERVICE_OPTIONS } from './_mock';
import type { TicketFilterValue, TicketFilters as TicketFiltersType, TicketItem, TicketStatus } from './types';

// ----------------------------------------------------------------------

type ViewMode = 'list' | 'grid';

const TABLE_HEAD = [
  { id: 'name', label: 'ROUTE' },
  { id: 'driverName', label: 'DRIVER', width: 180 },
  { id: 'departure', label: 'DEPARTURE', width: 160 },
  { id: 'arrival', label: 'ARRIVAL', width: 160 },
  { id: 'booked', label: 'BOOKED', width: 100 },
  { id: 'earnings', label: 'TOTAL_EARNINGS', width: 140 },
  { id: 'status', label: 'STATUS', width: 120 },
];

const defaultFilters: TicketFiltersType = {
  destination: [],
  operators: [],
  services: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function TicketListView() {
  const { t } = useTranslation('index');
  const router = useRouter();
  const table = useTable({ defaultRowsPerPage: 10, defaultOrderBy: 'name' });

  const statusOptions: {
    value: 'all' | TicketStatus;
    label: string;
    color: 'default' | 'success' | 'warning' | 'info' | 'error';
  }[] = useMemo(
    () => [
      { value: 'all', label: t('ALL'), color: 'default' },
      { value: 'active', label: t('ACTIVE'), color: 'success' },
      { value: 'routing', label: t('ROUTING'), color: 'warning' },
      { value: 'upcoming', label: t('UPCOMING'), color: 'info' },
      { value: 'canceled', label: t('CANCELLED'), color: 'error' },
    ],
    [t]
  );

  const openFilters = useBoolean();

  const [view, setView] = useState<ViewMode>('grid');

  const [search, setSearch] = useState<{ query: string; results: TicketItem[] }>({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const [status, setStatus] = useState<'all' | TicketStatus>('all');

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: _tickets,
    filters,
    status,
    dateError,
    comparator: getComparator(table.order, table.orderBy),
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 72 : 72 + 20;

  const canReset =
    !!filters.destination.length ||
    !!filters.operators.length ||
    !!filters.services.length ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = !dataFiltered.length;

  const handleChangeView = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newView: ViewMode | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );

  const handleFilterStatus = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      setStatus(newValue as 'all' | TicketStatus);
    },
    [table]
  );

  const handleFilters = useCallback(
    (name: string, value: TicketFilterValue) => {
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
    table.onResetPage();
  }, [table]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(ticketPaths.details(id));
    },
    [router]
  );

  const handleSearch = useCallback((inputValue: string) => {
    setSearch((prevState) => ({
      ...prevState,
      query: inputValue,
    }));

    if (inputValue) {
      const results = _tickets.filter(
        (ticket) => ticket.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
      );

      setSearch((prevState) => ({
        ...prevState,
        results,
      }));
    }
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <TicketSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id: string) => ticketPaths.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <TicketFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          filters={filters}
          onFilters={handleFilters}
          canReset={canReset}
          onResetFilters={handleResetFilters}
          serviceOptions={TICKET_SERVICE_OPTIONS.map((option) => option.label)}
          operatorOptions={_operators}
          destinationOptions={DESTINATIONS}
          dateError={dateError}
        />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <TicketFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      canReset={canReset}
      onFilters={handleFilters}
      results={dataFiltered.length}
    />
  );

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="SELECT_TRIP"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_TRIPS' },
        ]}
        action={
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
              <ToggleButton value="list" aria-label={t('LIST_VIEW')}>
                <Iconify icon="solar:list-bold" />
              </ToggleButton>
              <ToggleButton value="grid" aria-label={t('GRID_VIEW')}>
                <Iconify icon="mingcute:dot-grid-fill" />
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              component={RouterLink}
              href={ticketPaths.create}
              size="large"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{ minWidth: 180 }}
            >
              {t('NEW_TRIP')}
            </Button>
          </Stack>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      <Tabs
        value={status}
        onChange={handleFilterStatus}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {statusOptions.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={tab.label}
            icon={
              <Label
                variant={((tab.value === 'all' || tab.value === status) && 'filled') || 'soft'}
                color={tab.color}
              >
                {tab.value === 'all'
                  ? _tickets.length
                  : _tickets.filter((ticket) => ticket.status === tab.value).length}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      {view === 'list' ? (
        <Card>
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
                    <TicketTableRow
                      key={row.id}
                      row={row}
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
      ) : notFound ? (
        <EmptyContent title="NO_DATA" filled sx={{ py: 10 }} />
      ) : (
        <TicketList tickets={dataFiltered} />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

type TicketSortable = TicketItem & {
  departure: number;
  arrival: number;
  booked: number;
  earnings: number;
};

const applyFilter = ({
  inputData,
  filters,
  status,
  dateError,
  comparator,
}: {
  inputData: TicketItem[];
  filters: TicketFiltersType;
  status: 'all' | TicketStatus;
  dateError: boolean;
  comparator: (a: any, b: any) => number;
}) => {
  const { services, destination, startDate, endDate, operators } = filters;

  const operatorIds = operators.map((operator) => operator.id);

  let data = [...inputData];

  if (status !== 'all') {
    data = data.filter((ticket) => ticket.status === status);
  }

  if (destination.length) {
    data = data.filter((ticket) => destination.includes(ticket.destination));
  }

  if (operatorIds.length) {
    data = data.filter((ticket) =>
      ticket.operators.some((operator) => operatorIds.includes(operator.id))
    );
  }

  if (services.length) {
    data = data.filter((ticket) => ticket.services.some((item) => services.includes(item)));
  }

  if (!dateError && startDate && endDate) {
    data = data.filter((ticket) =>
      isBetween(startDate, ticket.available.startDate, ticket.available.endDate)
    );
  }

  const stabilized = data.map((el, index) => [el, index] as const);

  stabilized.sort((a, b) => {
    const toSortable = (ticket: TicketItem): TicketSortable => ({
      ...ticket,
      departure: ticket.available.startDate.getTime(),
      arrival: ticket.available.endDate.getTime(),
      booked: ticket.bookers.length,
      earnings: ticket.seats
        .filter((seat) => seat.status === 'booked')
        .reduce((sum, seat) => sum + seat.price, 0),
    });

    const order = comparator(toSortable(a[0]), toSortable(b[0]));
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilized.map((el) => el[0]);
};
