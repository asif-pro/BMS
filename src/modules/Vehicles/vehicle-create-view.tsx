import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Autocomplete from '@mui/material/Autocomplete';
import { type Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from '@/routes/paths';
import { useParams, usePathname, useRouter } from '@/routes/hooks';
import { RouterLink } from '@/routes/components';

import Image from '@/components/image';
import Iconify from '@/components/iconify';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import LayoutPreview from '@/modules/Tickets/layout-preview';
import {
  layoutSeatCount,
  layoutSeatSummary,
  SEAT_LAYOUTS,
  type LayoutConfig,
} from '@/modules/Tickets/seat-layouts';

import {
  getVehicleById,
  VEHICLE_BRANDS,
  VEHICLE_BUS_TYPES,
  VEHICLE_COVERS,
  VEHICLE_ENGINE_TYPES,
  VEHICLE_MODELS,
  VEHICLE_STATUSES,
} from './_mock';
import type { VehicleBusType, VehicleEngineType, VehicleStatus } from './types';

// ----------------------------------------------------------------------

type BrandOption = (typeof VEHICLE_BRANDS)[number];

const COVER_LABELS: Record<string, string> = {
  '/assets/images/buses/highway-coach.jpg': 'Highway coach',
  '/assets/images/buses/ac-coach.jpg': 'AC coach',
  '/assets/images/buses/sleeper.jpg': 'Sleeper',
  '/assets/images/buses/double-decker.jpg': 'Double decker',
  '/assets/images/buses/night-bus.jpg': 'Night bus',
  '/assets/images/buses/blue-bus.jpg': 'Blue bus',
  '/assets/images/buses/yellow-bus.jpg': 'Yellow bus',
  '/assets/images/buses/orange-coach.jpg': 'Orange coach',
  '/assets/images/buses/desert-coach.jpg': 'Desert coach',
  '/assets/images/buses/minibus.jpg': 'Minibus',
  '/assets/images/buses/double-decker-city.jpg': 'City double decker',
  '/assets/images/buses/pink-coach.jpg': 'Pink coach',
};

// ----------------------------------------------------------------------

export default function VehicleCreateView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const currentVehicle = useMemo(() => getVehicleById(id), [id]);
  const isEdit = Boolean(currentVehicle) && pathname.endsWith('/edit');
  const isView = Boolean(currentVehicle) && !isEdit;
  const readOnly = isView;

  const [name, setName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [brand, setBrand] = useState<BrandOption | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [seats, setSeats] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [engineType, setEngineType] = useState<VehicleEngineType | ''>('');
  const [busType, setBusType] = useState<VehicleBusType | ''>('');
  const [status, setStatus] = useState<VehicleStatus | ''>('active');
  const [layout, setLayout] = useState<LayoutConfig | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!currentVehicle) {
      return;
    }

    const brandOption =
      VEHICLE_BRANDS.find((item) => item.name === currentVehicle.brand) ?? null;
    const layoutOption =
      SEAT_LAYOUTS.find((item) => item.id === currentVehicle.layoutId) ?? null;

    setName(currentVehicle.name);
    setPlateNumber(currentVehicle.plateNumber);
    setBrand(brandOption);
    setModel(currentVehicle.model);
    setSeats(String(currentVehicle.seats));
    setQuantity(String(currentVehicle.quantity));
    setEngineType(currentVehicle.engineType);
    setBusType(currentVehicle.busType);
    setStatus(currentVehicle.status);
    setLayout(layoutOption);
    setCoverUrl(currentVehicle.coverUrl);
  }, [currentVehicle]);

  const layoutHint = useMemo(() => {
    if (!layout) {
      return t('CHOOSE_SEATS_ARRANGED_HINT');
    }

    return `${layoutSeatSummary(layout)} · ${t('SEATS_COUNT', { count: layoutSeatCount(layout) })}`;
  }, [layout, t]);

  const handleLayoutChange = (value: LayoutConfig | null) => {
    setLayout(value);

    if (value) {
      setSeats(String(layoutSeatCount(value)));
    }
  };

  const handleSubmit = () => {
    router.push(paths.dashboard.vehicles.list);
  };

  return (
    <>
      <CustomBreadcrumbs
        heading={isView ? t('VEHICLE_DETAILS') : isEdit ? t('EDIT_VEHICLE') : t('ADD_A_NEW_VEHICLE')}
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_FLEET', href: paths.dashboard.vehicles.root },
          { name: 'NAV_VEHICLES', href: paths.dashboard.vehicles.list },
          { name: isView ? currentVehicle?.name || t('DETAILS') : isEdit ? t('EDIT_VEHICLE') : t('NEW_VEHICLE') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', md: '280px minmax(0, 1fr)' },
        }}
      >
        {mdUp && (
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {t('VEHICLE_DETAILS')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {isView
                ? t('VEHICLE_DETAILS_DESC_VIEW')
                : isEdit
                  ? t('VEHICLE_DETAILS_DESC_EDIT')
                  : t('VEHICLE_DETAILS_DESC_CREATE')}
            </Typography>

            <Stack spacing={2}>
              {coverUrl && (
                <Card sx={{ overflow: 'hidden' }}>
                  <Image alt={t('VEHICLE_PREVIEW')} src={coverUrl} ratio="4/3" />
                  <Stack spacing={0.5} sx={{ p: 2 }}>
                    <Typography variant="subtitle2" noWrap>
                      {name || t('UNTITLED_VEHICLE')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {brand?.name || t('BRAND')} · {model || t('MODEL')}
                    </Typography>
                  </Stack>
                </Card>
              )}

              {layout && <LayoutPreview layout={layout} />}
            </Stack>
          </Box>
        )}

        <Box>
          <Card>
            {!mdUp && (
              <CardHeader
                title={t('VEHICLE_DETAILS')}
                subheader={
                  isView
                    ? t('REVIEW_FLEET_SHORT_DESC')
                    : t('ENTER_FLEET_SHORT_DESC')
                }
              />
            )}

            <Stack spacing={3} sx={{ p: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field label={t('VEHICLE_NAME')}>
                  <TextField
                    fullWidth
                    value={name}
                    placeholder={t('VEHICLE_NAME_PLACEHOLDER')}
                    disabled={readOnly}
                    onChange={(event) => setName(event.target.value)}
                    InputProps={{
                      startAdornment: <FieldIcon icon="solar:bus-bold" />,
                    }}
                  />
                </Field>

                <Field label={t('PLATE_NUMBER')}>
                  <TextField
                    fullWidth
                    value={plateNumber}
                    placeholder={t('PLATE_NUMBER_PLACEHOLDER')}
                    disabled={readOnly}
                    onChange={(event) => setPlateNumber(event.target.value)}
                    InputProps={{
                      startAdornment: <FieldIcon icon="solar:card-bold" />,
                    }}
                  />
                </Field>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field label={t('BRAND')}>
                  <Autocomplete
                    options={[...VEHICLE_BRANDS]}
                    value={brand}
                    disabled={readOnly}
                    onChange={(_, value) => setBrand(value)}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, selected) => option.name === selected.name}
                    renderOption={(props, option) => (
                      <li {...props} key={option.name}>
                        <Avatar
                          alt={option.name}
                          src={option.logo}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t('SELECT_BRAND')}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              {brand ? (
                                <Avatar
                                  alt={brand.name}
                                  src={brand.logo}
                                  sx={{ width: 24, height: 24, ml: 1 }}
                                />
                              ) : (
                                <FieldIcon icon="solar:tag-bold" />
                              )}
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Field>

                <Field label={t('MODEL')}>
                  <Autocomplete
                    freeSolo
                    options={VEHICLE_MODELS}
                    value={model}
                    disabled={readOnly}
                    onChange={(_, value) => setModel(value)}
                    onInputChange={(_, value) => setModel(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t('MODEL_PLACEHOLDER')}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <FieldIcon icon="mdi:bus" />
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Field>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field label={t('CATEGORY')}>
                  <TextField
                    select
                    fullWidth
                    value={busType}
                    disabled={readOnly}
                    onChange={(event) => setBusType(event.target.value as VehicleBusType)}
                    SelectProps={{ displayEmpty: true }}
                    InputProps={{
                      startAdornment: <FieldIcon icon="solar:bookmark-square-bold" />,
                    }}
                  >
                    <MenuItem value="">
                      <em>{t('SELECT_CATEGORY')}</em>
                    </MenuItem>
                    {VEHICLE_BUS_TYPES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Field>

                <Field label={t('ENGINE_TYPE')}>
                  <TextField
                    select
                    fullWidth
                    value={engineType}
                    disabled={readOnly}
                    onChange={(event) => setEngineType(event.target.value as VehicleEngineType)}
                    SelectProps={{ displayEmpty: true }}
                    InputProps={{
                      startAdornment: <FieldIcon icon="mdi:engine" />,
                    }}
                  >
                    <MenuItem value="">
                      <em>{t('SELECT_ENGINE_TYPE')}</em>
                    </MenuItem>
                    {VEHICLE_ENGINE_TYPES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Field>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field label={t('NUMBER_OF_SEATS')}>
                  <TextField
                    fullWidth
                    type="number"
                    value={seats}
                    placeholder={t('SEATS_PLACEHOLDER')}
                    disabled={readOnly}
                    onChange={(event) => setSeats(event.target.value)}
                    inputProps={{ min: 1 }}
                    InputProps={{
                      startAdornment: <FieldIcon icon="mdi:seat-passenger" />,
                    }}
                    helperText={layout && !readOnly ? t('FILLED_FROM_LAYOUT') : ' '}
                  />
                </Field>

                <Field label={t('NUMBER_OF_VEHICLES')}>
                  <TextField
                    fullWidth
                    type="number"
                    value={quantity}
                    placeholder={t('QUANTITY_PLACEHOLDER')}
                    disabled={readOnly}
                    onChange={(event) => setQuantity(event.target.value)}
                    inputProps={{ min: 1 }}
                    InputProps={{
                      startAdornment: <FieldIcon icon="mdi:bus-multiple" />,
                    }}
                    helperText={readOnly ? ' ' : t('UNITS_TO_ADD_HELPER')}
                  />
                </Field>

                <Field label={t('STATUS')}>
                  <TextField
                    select
                    fullWidth
                    value={status}
                    disabled={readOnly}
                    onChange={(event) => setStatus(event.target.value as VehicleStatus)}
                    SelectProps={{ displayEmpty: true }}
                    InputProps={{
                      startAdornment: <FieldIcon icon="solar:flag-bold" />,
                    }}
                  >
                    <MenuItem value="">
                      <em>{t('SELECT_STATUS')}</em>
                    </MenuItem>
                    {VEHICLE_STATUSES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option === 'active' ? t('ACTIVE') : option === 'inactive' ? t('INACTIVE') : t('MAINTENANCE')}
                      </MenuItem>
                    ))}
                  </TextField>
                </Field>
              </Stack>

              <Field label={t('SEATING_LAYOUT')}>
                <Autocomplete
                  options={SEAT_LAYOUTS}
                  value={layout}
                  disabled={readOnly}
                  onChange={(_, value) => handleLayoutChange(value)}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, selected) => option.id === selected.id}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Stack sx={{ py: 0.5 }}>
                        <Typography variant="body2">{option.label}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {option.caption} · {t('SEATS_COUNT', { count: layoutSeatCount(option) })}
                        </Typography>
                      </Stack>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('SELECT_SEATING_LAYOUT')}
                      helperText={readOnly ? ' ' : layoutHint}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FieldIcon icon="solar:widget-5-bold" />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Field>

              <Field label={t('COACH_PHOTO')}>
                <Autocomplete
                  options={VEHICLE_COVERS}
                  value={coverUrl}
                  disabled={readOnly}
                  onChange={(_, value) => setCoverUrl(value)}
                  getOptionLabel={(option) => COVER_LABELS[option] || option}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      <Box
                        component="img"
                        src={option}
                        alt={COVER_LABELS[option]}
                        sx={{
                          width: 48,
                          height: 36,
                          borderRadius: 0.75,
                          objectFit: 'cover',
                          mr: 1.5,
                          flexShrink: 0,
                        }}
                      />
                      {COVER_LABELS[option] || option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('SELECT_COACH_PHOTO')}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FieldIcon icon="solar:gallery-bold" />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Field>
            </Stack>
          </Card>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
            <Button
              component={RouterLink}
              href={paths.dashboard.vehicles.list}
              size="large"
              color="inherit"
              variant="outlined"
            >
              {isView ? t('BACK') : t('CANCEL')}
            </Button>

            {isView ? (
              <Button
                component={RouterLink}
                href={paths.dashboard.vehicles.edit(currentVehicle!.id)}
                size="large"
                variant="contained"
                startIcon={<Iconify icon="solar:pen-bold" />}
              >
                {t('EDIT')}
              </Button>
            ) : (
              <Button size="large" variant="contained" onClick={handleSubmit}>
                {isEdit ? t('UPDATE') : t('ADD_VEHICLE')}
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack spacing={1.5} sx={{ width: 1 }}>
      <Typography variant="subtitle2">{label}</Typography>
      {children}
    </Stack>
  );
}

function FieldIcon({ icon }: { icon: string }) {
  return (
    <InputAdornment position="start">
      <Iconify icon={icon} sx={{ color: 'text.disabled' }} />
    </InputAdornment>
  );
}
