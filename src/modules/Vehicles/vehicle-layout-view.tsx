import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import SeatLayoutBoard from '@/modules/Tickets/seat-layout-board';
import {
  layoutSeatCount,
  layoutSeatSummary,
  SEAT_LAYOUTS,
  type LayoutConfig,
} from '@/modules/Tickets/seat-layouts';

// ----------------------------------------------------------------------

export default function VehicleLayoutView() {
  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading="Vehicle layouts"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vehicles', href: paths.dashboard.vehicles.root },
          { name: 'Layout' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Choose a layout to inspect its full seat map.
      </Typography>

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {SEAT_LAYOUTS.map((layout) => (
          <LayoutCard key={layout.id} layout={layout} />
        ))}
      </Box>
    </Container>
  );
}

// ----------------------------------------------------------------------

function LayoutCard({ layout }: { layout: LayoutConfig }) {
  const seatCount = layoutSeatCount(layout);
  const previewScale =
    layout.id === 'double-decker' ? 0.4 : layout.id === '1+1' ? 0.7 : layout.id === '2+2-classic' ? 0.46 : 0.52;

  return (
    <Link
      component={RouterLink}
      href={paths.dashboard.vehicles.layoutDetails(layout.slug)}
      underline="none"
      color="inherit"
      sx={{ display: 'block', minWidth: 0 }}
    >
      <Paper
        sx={{
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.neutral',
          height: 1,
          transition: (theme) =>
            theme.transitions.create(['box-shadow', 'transform'], {
              duration: theme.transitions.duration.shorter,
            }),
          '&:hover': {
            boxShadow: (theme) => theme.customShadows.z8,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Stack
          spacing={2}
          sx={{
            px: 2,
            pb: 1,
            pt: 2.5,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Iconify icon="mdi:bus-side" width={22} />
            </Avatar>

            <ListItemText
              primary={layout.label}
              secondary={`${seatCount} seats`}
              primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />
          </Stack>

          <Stack
            rowGap={1.5}
            columnGap={3}
            flexWrap="wrap"
            direction="row"
            alignItems="center"
            sx={{ color: 'text.secondary', typography: 'caption' }}
          >
            <Stack direction="row" alignItems="center">
              <Iconify
                width={16}
                icon="solar:widget-5-bold"
                sx={{ mr: 0.5, flexShrink: 0 }}
              />
              {layoutSeatSummary(layout)}
            </Stack>

            <Stack direction="row" alignItems="center">
              <Iconify
                width={16}
                icon="solar:layers-minimalistic-bold"
                sx={{ mr: 0.5, flexShrink: 0 }}
              />
              {layout.caption}
            </Stack>
          </Stack>
        </Stack>

        <Label
          variant="filled"
          sx={{
            right: 16,
            zIndex: 9,
            bottom: 16,
            position: 'absolute',
          }}
        >
          {seatCount} seats
        </Label>

        <Box sx={{ p: 1, position: 'relative' }}>
          <Box
            sx={{
              borderRadius: 1.5,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ zoom: previewScale }}>
              <SeatLayoutBoard layout={layout} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Link>
  );
}
