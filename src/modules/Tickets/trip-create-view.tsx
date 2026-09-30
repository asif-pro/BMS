import { useState, type ReactNode } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, type Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiStepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import type { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';

import Iconify from '@/components/iconify';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import { ticketPaths } from './paths';
import {
  DESTINATIONS,
  _operators,
  _ticketVehicles,
  formatTicketVehicleOption,
  type TicketVehicleOption,
} from './_mock';
import VehicleOptionLabel from './vehicle-option-label';
import type { TicketOperator } from './types';

// ----------------------------------------------------------------------

const STEPS = ['Details', 'Stoppages', 'Services'];

const STEP_COPY = [
  {
    title: 'Details',
    description: 'Name, vehicle, crew, and travel dates.',
  },
  {
    title: 'Stoppages',
    description: 'From and destination stay in place. Add cities between them, then drag to reorder.',
  },
  {
    title: 'Services',
    description: 'Choose what passengers get on this trip.',
  },
];

const STOPPAGE_CITIES = Array.from(
  new Set([
    ...DESTINATIONS,
    'Narsingdi',
    'Bhairab',
    'Brahmanbaria',
    'Cumilla',
    'Feni',
    'Mirsharai',
    'Tangail',
    'Sirajganj',
    'Gazipur',
    'Uttara',
    'Faridpur',
    'Jashore',
    'Mawa',
    'Madaripur',
    'Satkania',
    'Lohagara',
    'Chakaria',
    'Trishal',
  ])
).sort((a, b) => a.localeCompare(b));

const SERVICE_OPTIONS = [
  { value: 'Wi-Fi', label: 'Wi-Fi', icon: 'solar:wi-fi-bold' },
  { value: 'Food', label: 'Food', icon: 'solar:chef-hat-bold' },
  { value: 'Toilet', label: 'Toilet', icon: 'ph:toilet-bold' },
  { value: 'AC', label: 'AC', icon: 'solar:snowflake-bold' },
  { value: 'Extra luggage', label: 'Extra luggage', icon: 'solar:suitcase-bold' },
];

type StopRole = 'from' | 'stop' | 'destination';

type StopField = {
  id: string;
  city: string | null;
  role: StopRole;
};

const StepConnector = styled(MuiStepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  [`&.${stepConnectorClasses.active}, &.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// ----------------------------------------------------------------------

export default function TripCreateView() {
  const router = useRouter();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState<TicketVehicleOption | null>(null);
  const [driver, setDriver] = useState<TicketOperator | null>(null);
  const [conductor, setConductor] = useState<TicketOperator | null>(null);
  const [departure, setDeparture] = useState<Dayjs | null>(null);
  const [arrival, setArrival] = useState<Dayjs | null>(null);
  const [stops, setStops] = useState<StopField[]>([
    { id: 'from', city: null, role: 'from' },
    { id: 'destination', city: null, role: 'destination' },
  ]);
  const [services, setServices] = useState<string[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [nextStopId, setNextStopId] = useState(1);

  const handleNext = () => {
    setActiveStep((current) => current + 1);
  };

  const handleCreate = () => {
    router.push(ticketPaths.root);
  };

  const addStop = (index: number) => {
    const id = `stop-${nextStopId}`;
    setNextStopId((current) => current + 1);
    setStops((current) => {
      const next = [...current];
      const insertAt = Math.min(index + 1, current.length - 1);
      next.splice(insertAt, 0, { id, city: null, role: 'stop' });
      return next;
    });
  };

  const removeStop = (id: string) => {
    setStops((current) => current.filter((stop) => !(stop.id === id && stop.role === 'stop')));
  };

  const moveStop = (fromId: string, toId: string) => {
    if (fromId === toId) {
      return;
    }

    setStops((current) => {
      const from = current.findIndex((stop) => stop.id === fromId);
      const moving = current[from];

      if (!moving || moving.role !== 'stop') {
        return current;
      }

      const next = current.filter((stop) => stop.id !== fromId);
      let insertAt = next.findIndex((stop) => stop.id === toId);

      if (insertAt < 0) {
        return current;
      }

      if (next[insertAt].role === 'from') {
        insertAt += 1;
      }

      next.splice(insertAt, 0, moving);
      return next;
    });
  };

  const toggleService = (value: string) => {
    setServices((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const stepCopy = STEP_COPY[activeStep];

  return (
    <>
      <CustomBreadcrumbs
        heading="Create a new trip"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Trips', href: ticketPaths.root },
          { name: 'New trip' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stepper alternativeLabel activeStep={activeStep} connector={<StepConnector />} sx={{ mb: { xs: 3, md: 5 } }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

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
              {stepCopy.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {stepCopy.description}
            </Typography>
          </Box>
        )}

        <Box>
          <Card>
            {!mdUp && <CardHeader title={stepCopy.title} subheader={stepCopy.description} />}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3} sx={{ p: 3 }}>
                {activeStep === 0 && (
                  <>
                    <Field label="Trip name">
                      <TextField
                        fullWidth
                        value={name}
                        placeholder="Ex: Dhaka — Sylhet Night Coach"
                        onChange={(event) => setName(event.target.value)}
                        InputProps={{
                          startAdornment: <FieldIcon icon="solar:document-text-bold" />,
                        }}
                      />
                    </Field>

                    <Field label="Vehicle">
                      <Autocomplete
                        options={_ticketVehicles}
                        value={vehicle}
                        onChange={(_, value) => setVehicle(value)}
                        getOptionLabel={(option) => option.busNumber}
                        filterOptions={(options, state) => {
                          const query = state.inputValue.trim().toLowerCase();
                          if (!query) {
                            return options;
                          }

                          return options.filter((option) =>
                            formatTicketVehicleOption(option).toLowerCase().includes(query)
                          );
                        }}
                        isOptionEqualToValue={(option, selected) =>
                          option.busNumber === selected.busNumber
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option.busNumber}>
                            <VehicleOptionLabel option={option} />
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select vehicle"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <FieldIcon icon="solar:bus-bold" />
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                              endAdornment: (
                                <>
                                  {vehicle && (
                                    <Typography
                                      variant="caption"
                                      sx={{ color: 'text.disabled', mr: 0.5, whiteSpace: 'nowrap' }}
                                    >
                                      {vehicle.busModel}
                                    </Typography>
                                  )}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    </Field>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <Field label="Driver">
                        <StaffSelect
                          placeholder="Select driver"
                          value={driver}
                          options={_operators.filter((person) => person.id !== conductor?.id)}
                          onChange={setDriver}
                        />
                      </Field>

                      <Field label="Conductor">
                        <StaffSelect
                          placeholder="Select conductor"
                          value={conductor}
                          options={_operators.filter((person) => person.id !== driver?.id)}
                          onChange={setConductor}
                        />
                      </Field>
                    </Stack>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <Field label="Departure">
                        <DateTimePicker
                          ampm
                          format="DD/MM/YYYY hh:mm A"
                          value={departure}
                          onChange={setDeparture}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              placeholder: 'Select date and time',
                              InputProps: {
                                startAdornment: <FieldIcon icon="solar:calendar-bold" />,
                              },
                            },
                          }}
                        />
                      </Field>

                      <Field label="Arrival">
                        <DateTimePicker
                          ampm
                          format="DD/MM/YYYY hh:mm A"
                          value={arrival}
                          onChange={setArrival}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              placeholder: 'Select date and time',
                              InputProps: {
                                startAdornment: <FieldIcon icon="solar:calendar-mark-bold" />,
                              },
                            },
                          }}
                        />
                      </Field>
                    </Stack>
                  </>
                )}

                {activeStep === 1 && (
                  <Stack spacing={1.5}>
                    {stops.map((stop, index) => {
                      const taken = stops
                        .filter((item) => item.id !== stop.id && item.city)
                        .map((item) => item.city);
                      const locked = stop.role !== 'stop';
                      const placeholder =
                        stop.role === 'from' ? 'From' : stop.role === 'destination' ? 'Destination' : 'Select city';

                      return (
                        <Stack
                          key={stop.id}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => {
                            event.preventDefault();
                            moveStop(event.dataTransfer.getData('text/plain'), stop.id);
                            setDragId(null);
                          }}
                          sx={{
                            opacity: dragId === stop.id ? 0.45 : 1,
                          }}
                        >
                          {locked ? (
                            <Box sx={{ width: 28, flexShrink: 0 }} />
                          ) : (
                            <Box
                              component="span"
                              draggable
                              aria-label={`Drag ${stop.city || 'stoppage'}`}
                              onDragStart={(event) => {
                                event.dataTransfer.effectAllowed = 'move';
                                event.dataTransfer.setData('text/plain', stop.id);
                                setDragId(stop.id);
                              }}
                              onDragEnd={() => setDragId(null)}
                              sx={{
                                width: 28,
                                height: 40,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'text.disabled',
                                cursor: 'grab',
                                flexShrink: 0,
                                '&:active': { cursor: 'grabbing' },
                              }}
                            >
                              <Iconify icon="mingcute:dots-line" width={20} />
                            </Box>
                          )}

                          <Autocomplete
                            fullWidth
                            options={STOPPAGE_CITIES}
                            value={stop.city}
                            getOptionDisabled={(option) => taken.includes(option)}
                            onChange={(_, value) => {
                              setStops((current) =>
                                current.map((item) => (item.id === stop.id ? { ...item, city: value } : item))
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={placeholder}
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: (
                                    <>
                                      <FieldIcon
                                        icon={
                                          stop.role === 'destination'
                                            ? 'mingcute:location-fill'
                                            : 'solar:map-point-bold'
                                        }
                                      />
                                      {params.InputProps.startAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />

                          {stop.role === 'destination' ? (
                            <Box sx={{ width: 40, flexShrink: 0 }} />
                          ) : (
                            <IconButton aria-label="Add stoppage" color="primary" onClick={() => addStop(index)}>
                              <Iconify icon="mingcute:add-line" />
                            </IconButton>
                          )}

                          {locked ? (
                            <Box sx={{ width: 40, flexShrink: 0 }} />
                          ) : (
                            <IconButton aria-label="Remove stoppage" onClick={() => removeStop(stop.id)}>
                              <Iconify icon="mingcute:close-line" />
                            </IconButton>
                          )}
                        </Stack>
                      );
                    })}
                  </Stack>
                )}

                {activeStep === 2 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    }}
                  >
                    {SERVICE_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={services.includes(option.value)}
                            onChange={() => toggleService(option.value)}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={option.icon} sx={{ color: 'text.secondary' }} />
                            {option.label}
                          </Stack>
                        }
                      />
                    ))}
                  </Box>
                )}
              </Stack>
            </LocalizationProvider>
          </Card>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
            {activeStep > 0 && (
              <Button size="large" color="inherit" variant="outlined" onClick={() => setActiveStep((step) => step - 1)}>
                Back
              </Button>
            )}

            {activeStep < STEPS.length - 1 ? (
              <Button size="large" variant="contained" onClick={handleNext}>
                Continue
              </Button>
            ) : (
              <Button size="large" variant="contained" onClick={handleCreate}>
                Create trip
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

function StaffSelect({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string;
  value: TicketOperator | null;
  options: TicketOperator[];
  onChange: (value: TicketOperator | null) => void;
}) {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, nextValue) => onChange(nextValue)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Avatar alt={option.name} src={option.avatarUrl} sx={{ width: 24, height: 24, mr: 1 }} />
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {value ? (
                  <Avatar alt={value.name} src={value.avatarUrl} sx={{ width: 24, height: 24, ml: 1 }} />
                ) : (
                  <FieldIcon icon="solar:user-rounded-bold" />
                )}
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

function StepIcon({ active, completed }: { active?: boolean; completed?: boolean; icon?: ReactNode }) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 24,
        height: 24,
        color: 'text.disabled',
        ...(active && { color: 'primary.main' }),
      }}
    >
      {completed ? (
        <Iconify icon="eva:checkmark-fill" sx={{ color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'currentColor',
          }}
        />
      )}
    </Stack>
  );
}
