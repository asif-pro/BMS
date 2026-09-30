import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { useBoolean } from '@/hooks/use-boolean';

import { isAfter, isBetween } from '@/utils/format-time';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import EmptyContent from '@/components/empty-content';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import { ticketPaths } from './paths';
import TicketList from './ticket-list';
import TicketSearch from './ticket-search';
import TicketFilters from './ticket-filters';
import TicketFiltersResult from './ticket-filters-result';
import { _operators, _tickets, DESTINATIONS, TICKET_SERVICE_OPTIONS } from './_mock';
import type { TicketFilterValue, TicketFilters as TicketFiltersType, TicketItem, TicketStatus } from './types';

// ----------------------------------------------------------------------

const STATUS_OPTIONS: { value: 'all' | TicketStatus; label: string; color: 'default' | 'success' | 'warning' | 'info' | 'error' }[] = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'routing', label: 'Routing', color: 'warning' },
  { value: 'upcoming', label: 'Upcoming', color: 'info' },
  { value: 'canceled', label: 'Cancelled', color: 'error' },
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
  const openFilters = useBoolean();

  const [search, setSearch] = useState<{ query: string; results: TicketItem[] }>({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]['value']>('all');

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: _tickets,
    filters,
    status,
    dateError,
  });

  const canReset =
    !!filters.destination.length ||
    !!filters.operators.length ||
    !!filters.services.length ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = !dataFiltered.length;

  const handleFilterStatus = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setStatus(newValue as (typeof STATUS_OPTIONS)[number]['value']);
  }, []);

  const handleFilters = useCallback((name: string, value: TicketFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSearch = useCallback(
    (inputValue: string) => {
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
    },
    []
  );

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
        heading="Select Trip"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Trips' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={ticketPaths.create}
            size="large"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ minWidth: 180 }}
          >
            Trip
          </Button>
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
        {STATUS_OPTIONS.map((tab) => (
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

      {notFound && <EmptyContent title="No Data" filled sx={{ py: 10 }} />}

      <TicketList tickets={dataFiltered} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({
  inputData,
  filters,
  status,
  dateError,
}: {
  inputData: TicketItem[];
  filters: TicketFiltersType;
  status: (typeof STATUS_OPTIONS)[number]['value'];
  dateError: boolean;
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

  return data;
};
