import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from '@/routes/paths';

import { useBoolean } from '@/hooks/use-boolean';

import Iconify from '@/components/iconify';
import EmptyContent from '@/components/empty-content';
import { useSnackbar } from '@/components/snackbar';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import {
  _organizations,
  ORGANIZATION_LOCATIONS,
  ORGANIZATION_SORT_OPTIONS,
  ORGANIZATION_SIZE_OPTIONS,
  ORGANIZATION_SERVICE_OPTIONS,
  ORGANIZATION_CATEGORY_OPTIONS,
  ORGANIZATION_PARTNERSHIP_OPTIONS,
} from './_mock';
import OrganizationList from './organization-list';
import OrganizationSort from './organization-sort';
import OrganizationSearch from './organization-search';
import OrganizationFilters from './organization-filters';
import OrganizationFiltersResult from './organization-filters-result';
import type {
  IOrganizationItem,
  IOrganizationFilters,
  IOrganizationFilterValue,
} from './types';

// ----------------------------------------------------------------------

const defaultFilters: IOrganizationFilters = {
  categories: [],
  locations: [],
  services: [],
  size: 'all',
  partnershipTypes: [],
};

// ----------------------------------------------------------------------

export default function OrganizationListView() {
  const { t } = useTranslation('index');
  const { enqueueSnackbar } = useSnackbar();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [search, setSearch] = useState<{ query: string; results: IOrganizationItem[] }>({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: _organizations,
    filters,
    sortBy,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length && canReset;

  const handleFilters = useCallback((name: string, value: IOrganizationFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearch((prevState) => ({
      ...prevState,
      query: inputValue,
    }));

    if (inputValue) {
      const results = _organizations.filter((organization) =>
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
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      enqueueSnackbar(t('VIEW_ORGANIZATION', { id }));
    },
    [enqueueSnackbar, t]
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
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => enqueueSnackbar(t('NEW_ORGANIZATION'))}
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

          <Stack direction="row" spacing={1} flexShrink={0}>
            <OrganizationFilters
              open={openFilters.value}
              onOpen={openFilters.onTrue}
              onClose={openFilters.onFalse}
              filters={filters}
              onFilters={handleFilters}
              canReset={canReset}
              onResetFilters={handleResetFilters}
              locationOptions={ORGANIZATION_LOCATIONS}
              categoryOptions={ORGANIZATION_CATEGORY_OPTIONS}
              serviceOptions={ORGANIZATION_SERVICE_OPTIONS.map((option) => option.label)}
              sizeOptions={['all', ...ORGANIZATION_SIZE_OPTIONS.map((option) => option.label)]}
              partnershipTypeOptions={ORGANIZATION_PARTNERSHIP_OPTIONS.map((option) => option.label)}
            />

            <OrganizationSort
              sort={sortBy}
              onSort={handleSortBy}
              sortOptions={ORGANIZATION_SORT_OPTIONS}
            />
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

      {notFound && <EmptyContent filled title="NO_DATA" sx={{ py: 10 }} />}

      <OrganizationList organizations={dataFiltered} />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  sortBy,
}: {
  inputData: IOrganizationItem[];
  filters: IOrganizationFilters;
  sortBy: string;
}) {
  const { partnershipTypes, size, categories, locations, services } = filters;

  let data = inputData;

  if (sortBy === 'latest') {
    data = orderBy(data, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    data = orderBy(data, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    data = orderBy(data, ['totalViews'], ['desc']);
  }

  if (partnershipTypes.length) {
    data = data.filter((organization) =>
      organization.partnershipTypes.some((item) => partnershipTypes.includes(item))
    );
  }

  if (size !== 'all') {
    data = data.filter((organization) => organization.size === size);
  }

  if (categories.length) {
    data = data.filter((organization) => categories.includes(organization.category));
  }

  if (locations.length) {
    data = data.filter((organization) =>
      organization.locations.some((item) => locations.includes(item))
    );
  }

  if (services.length) {
    data = data.filter((organization) =>
      organization.services.some((item) => services.includes(item))
    );
  }

  return data;
}
