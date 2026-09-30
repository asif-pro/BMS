import { useEffect, useMemo, useState, type ReactNode } from 'react';

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

import SeatLayoutBoard from '@/modules/Tickets/seat-layout-board';
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
      return 'Choose how seats are arranged on this vehicle.';
    }

    return `${layoutSeatSummary(layout)} · ${layoutSeatCount(layout)} seats`;
  }, [layout]);

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
        heading={isView ? 'Vehicle details' : isEdit ? 'Edit vehicle' : 'Add a new vehicle'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Fleet', href: paths.dashboard.vehicles.root },
          { name: 'Vehicles', href: paths.dashboard.vehicles.list },
          { name: isView ? currentVehicle?.name || 'Details' : isEdit ? 'Edit vehicle' : 'New vehicle' },
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
              Vehicle details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {isView
                ? 'Review fleet identity, specs, quantity, and seating layout for this coach.'
                : isEdit
                  ? 'Update fleet identity, specs, quantity, and seating layout for this coach.'
                  : 'Enter fleet identity, specs, quantity, and seating layout for this coach.'}
            </Typography>

            <Stack spacing={2}>
              {coverUrl && (
                <Card sx={{ overflow: 'hidden' }}>
                  <Image alt="Vehicle preview" src={coverUrl} ratio="4/3" />
                  <Stack spacing={0.5} sx={{ p: 2 }}>
                    <Typography variant="subtitle2" noWrap>
                      {name || 'Untitled vehicle'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {brand?.name || 'Brand'} · {model || 'Model'}
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
                title="Vehicle details"
                subheader={
                  isView
                    ? 'Review fleet identity, specs, quantity, and seating layout.'
                    : 'Enter fleet identity, specs, quantity, and seating layout.'
                }
              />
            )}

            <Stack spacing={3} sx={{ p: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field label="Vehicle name">
                  <TextField
                    fullWidth
                    value={name}
                    placeholder="Ex: Coach DHK-01"
                    disabled={readOnly}
                    onChange={(event) => setName(event.target.value)}
                    InputProps={{
                      startAdornment: <FieldIcon icon="solar:bus-bold" />,
                    }}
                  />
                </Field>

                <Field label="Plate number">
                  <TextField
                    fullWidth
                    value={plateNumber}
                    placeholder="Ex: DHK-1420"
                    disabled={readOnly}
                    onChange={(event) => setPlateNumber(event.target.value)}
                    InputProps={{
                      startAdornment: <FieldIcon icon="solar:card-bold" />,
                    }}
                  />
                </Field>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field label="Brand">
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
                        placeholder="Select brand"
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

                <Field label="Model">
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
                        placeholder="Ex: B11R"
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
                <Field label="Category">
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
                      <em>Select category</em>
                    </MenuItem>
                    {VEHICLE_BUS_TYPES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Field>

                <Field label="Engine type">
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
                      <em>Select engine type</em>
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
                <Field label="Number of seats">
                  <TextField
                    fullWidth
                    type="number"
                    value={seats}
                    placeholder="Ex: 40"
                    disabled={readOnly}
                    onChange={(event) => setSeats(event.target.value)}
                    inputProps={{ min: 1 }}
                    InputProps={{
                      startAdornment: <FieldIcon icon="mdi:seat-passenger" />,
                    }}
                    helperText={layout && !readOnly ? 'Filled from the selected seating layout' : ' '}
                  />
                </Field>

                <Field label="Number of vehicles">
                  <TextField
                    fullWidth
                    type="number"
                    value={quantity}
                    placeholder="Ex: 3"
                    disabled={readOnly}
                    onChange={(event) => setQuantity(event.target.value)}
                    inputProps={{ min: 1 }}
                    InputProps={{
                      startAdornment: <FieldIcon icon="mdi:bus-multiple" />,
                    }}
                    helperText={readOnly ? ' ' : 'How many identical units to add'}
                  />
                </Field>

                <Field label="Status">
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
                      <em>Select status</em>
                    </MenuItem>
                    {VEHICLE_STATUSES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Field>
              </Stack>

              <Field label="Seating layout">
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
                          {option.caption} · {layoutSeatCount(option)} seats
                        </Typography>
                      </Stack>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select seating layout"
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

              <Field label="Coach photo">
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
                      placeholder="Select coach photo"
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
              {isView ? 'Back' : 'Cancel'}
            </Button>

            {isView ? (
              <Button
                component={RouterLink}
                href={paths.dashboard.vehicles.edit(currentVehicle!.id)}
                size="large"
                variant="contained"
                startIcon={<Iconify icon="solar:pen-bold" />}
              >
                Edit
              </Button>
            ) : (
              <Button size="large" variant="contained" onClick={handleSubmit}>
                {isEdit ? 'Update' : 'Add vehicle'}
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

function LayoutPreview({ layout }: { layout: LayoutConfig }) {
  const seatCount = layoutSeatCount(layout);
  const previewScale =
    layout.id === 'double-decker' ? 0.32 : layout.id === '1+1' ? 0.55 : layout.id === '2+2-classic' ? 0.36 : 0.4;

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack spacing={0.25}>
          <Typography variant="subtitle2">{layout.label}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {layout.caption} · {seatCount} seats
          </Typography>
        </Stack>

        <Box
          sx={{
            borderRadius: 1.5,
            overflow: 'auto',
            bgcolor: 'background.neutral',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
          }}
        >
          <Box sx={{ zoom: previewScale }}>
            <SeatLayoutBoard layout={layout} />
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}
