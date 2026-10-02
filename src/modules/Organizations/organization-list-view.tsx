import isEqual from 'lodash/isEqual';
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Container from '@mui/material/Container';
import { alpha } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';

import { RouterLink } from '@/routes/components';

import { useBoolean } from '@/hooks/use-boolean';

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

import {
  ORGANIZATION_STATUS_LABEL_KEYS,
  ORGANIZATION_STATUS_OPTIONS,
  ORGANIZATION_SUBSCRIPTION_PLANS,
} from '@/constants/organization.constant';
import { useGetOrganizations } from '@/hooks/useGetOrganizations.hook';
import OrganizationList from './organization-list';
import OrganizationSearch from './organization-search';
import OrganizationFilters from './organization-filters';
import OrganizationTableRow from './organization-table-row';
import OrganizationFiltersResult from './organization-filters-result';
import type {
  IOrganizationItem,
  IOrganizationFilters,
  IOrganizationFilterValue,
} from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

type ViewMode = 'list' | 'grid';

const TABLE_HEAD = [
  { id: 'title', label: 'NAME' },
  { id: 'phoneNumber', label: 'PHONE_NUMBER', width: 160 },
  { id: 'vehicleCount', label: 'VEHICLES', width: 100 },
  { id: 'ticketsSold', label: 'TICKETS_SOLD', width: 120 },
  { id: 'staffCount', label: 'USER_ACCOUNT', width: 120 },
  { id: 'totalEarned', label: 'TOTAL_EARNINGS', width: 140 },
  { id: 'totalPaid', label: 'TOTAL_PAID', width: 140 },
  { id: 'subscriptionPlan', label: 'PLAN', width: 120 },
  { id: 'status', label: 'STATUS', width: 140 },
];

const defaultFilters: IOrganizationFilters = {
  status: 'all',
  subscriptionPlans: [],
};

// ----------------------------------------------------------------------

export default function OrganizationListView() {
  const { t } = useTranslation('index');
  const router = useRouter();
  const table = useTable({ defaultRowsPerPage: 10, defaultOrderBy: 'title' });
  const { data: organizations = [] } = useGetOrganizations();

  const openFilters = useBoolean();

  const [view, setView] = useState<ViewMode>('grid');

  const [search, setSearch] = useState<{ query: string; results: IOrganizationItem[] }>({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: organizations,
        filters,
        comparator: getComparator(table.order, table.orderBy),
      }),
    [organizations, filters, table.order, table.orderBy]
  );

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 72 : 72 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length;

  const handleChangeView = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newView: ViewMode | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );

  const handleFilters = useCallback(
    (name: string, value: IOrganizationFilterValue) => {
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

  const handleSearch = useCallback(
    (inputValue: string) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = organizations.filter((organization) =>
          organization.title.toLowerCase().includes(inputValue.toLowerCase())
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      } else {
        setSearch((prevState) => ({
          ...prevState,
          results: [],
        }));
      }
    },
    [organizations]
  );

  const handleSelect = useCallback(
    (id: string) => {
      router.push(paths.dashboard.organizations.details(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.organizations.details(id));
    },
    [router]
  );

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="ORGANIZATIONS"
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_ORGANIZATIONS' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.organizations.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('NEW_ORGANIZATION')}
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
        <Stack
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-end', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <OrganizationSearch
            query={search.query}
            results={search.results}
            onSearch={handleSearch}
            onSelect={handleSelect}
          />

          <Stack direction="row" spacing={1} flexShrink={0} alignItems="center">
            <OrganizationFilters
              open={openFilters.value}
              onOpen={openFilters.onTrue}
              onClose={openFilters.onFalse}
              filters={filters}
              onFilters={handleFilters}
              canReset={canReset}
              onResetFilters={handleResetFilters}
              statusOptions={[
                { value: 'all', labelKey: 'ALL' },
                ...ORGANIZATION_STATUS_OPTIONS.map((option) => ({
                  value: option.value,
                  labelKey: ORGANIZATION_STATUS_LABEL_KEYS[option.value],
                })),
              ]}
              subscriptionPlanOptions={[...ORGANIZATION_SUBSCRIPTION_PLANS]}
            />

            <ToggleButtonGroup
              size="small"
              value={view}
              exclusive
              onChange={handleChangeView}
            >
              <ToggleButton value="list" aria-label={t('LIST_VIEW')}>
                <Iconify icon="solar:list-bold" />
              </ToggleButton>
              <ToggleButton value="grid" aria-label={t('GRID_VIEW')}>
                <Iconify icon="mingcute:dot-grid-fill" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        {canReset && (
          <OrganizationFiltersResult
            filters={filters}
            onResetFilters={handleResetFilters}
            canReset={canReset}
            onFilters={handleFilters}
            results={dataFiltered.length}
          />
        )}
      </Stack>

      {view === 'list' ? (
        <Card
          sx={{
            boxShadow: (theme) => theme.customShadows.z8,
          }}
        >
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1100 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  onSort={table.onSort}
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
                  {dataInPage.map((row) => (
                    <OrganizationTableRow
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
        <EmptyContent filled title="NO_DATA" sx={{ py: 10 }} />
      ) : (
        <OrganizationList organizations={dataFiltered} />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

type OrganizationSortable = IOrganizationItem & {
  phoneNumber: string;
};

function applyFilter({
  inputData,
  filters,
  comparator,
}: {
  inputData: IOrganizationItem[];
  filters: IOrganizationFilters;
  comparator: (a: any, b: any) => number;
}) {
  const { status, subscriptionPlans } = filters;

  let data = [...inputData];

  if (status !== 'all') {
    data = data.filter((organization) => organization.status === status);
  }

  if (subscriptionPlans.length) {
    data = data.filter((organization) =>
      subscriptionPlans.includes(organization.subscriptionPlan)
    );
  }

  const stabilized = data.map((el, index) => [el, index] as const);

  stabilized.sort((a, b) => {
    const toSortable = (organization: IOrganizationItem): OrganizationSortable => ({
      ...organization,
      phoneNumber: organization.company.phoneNumber,
    });

    const order = comparator(toSortable(a[0]), toSortable(b[0]));
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilized.map((el) => el[0]);
}
