import { useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';

import Label from '@/components/label';
import Image from '@/components/image';
import Iconify from '@/components/iconify';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import { SEAT_LAYOUTS } from '@/modules/Tickets/seat-layouts';

import type { VehicleItem, VehicleStatus } from './types';

// ----------------------------------------------------------------------

type Props = {
  vehicle: VehicleItem;
  onDelete: (id: string) => void;
};

export default function VehicleCard({ vehicle, onDelete }: Props) {
  const router = useRouter();
  const popover = usePopover();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    id,
    name,
    plateNumber,
    brand,
    brandLogoUrl,
    model,
    seats,
    engineType,
    busType,
    layoutId,
    coverUrl,
    status,
  } = vehicle;

  const layoutLabel =
    SEAT_LAYOUTS.find((layout) => layout.id === layoutId)?.label ?? layoutId;

  const handleView = () => {
    popover.onClose();
    router.push(paths.dashboard.vehicles.details(id));
  };

  const handleEdit = () => {
    popover.onClose();
    router.push(paths.dashboard.vehicles.edit(id));
  };

  const handleDeleteClick = () => {
    popover.onClose();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setConfirmOpen(false);
  };

  return (
    <>
      <Paper
        onClick={handleView}
        sx={{
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.neutral',
          height: 1,
          cursor: 'pointer',
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
            <Avatar
              alt={brand}
              src={brandLogoUrl}
              sx={{ width: 48, height: 48, bgcolor: 'background.paper' }}
            />

            <ListItemText
              primary={name}
              secondary={plateNumber}
              primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />

            <IconButton
              size="small"
              color={popover.open ? 'inherit' : 'default'}
              onClick={(event) => {
                event.stopPropagation();
                popover.onOpen(event);
              }}
              sx={{ alignSelf: 'flex-start' }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>

          <Stack
            rowGap={1.5}
            columnGap={2}
            flexWrap="wrap"
            direction="row"
            alignItems="center"
            sx={{ color: 'text.secondary', typography: 'caption' }}
          >
            <MetaItem icon="mdi:bus" label={model} />
            <MetaItem icon="solar:tag-bold" label={brand} />
            <MetaItem icon="mdi:seat-passenger" label={`${seats} seats`} />
            <MetaItem icon="mdi:engine" label={engineType} />
            <MetaItem icon="solar:bookmark-square-bold" label={busType} />
            <MetaItem icon="solar:widget-5-bold" label={layoutLabel} />
          </Stack>
        </Stack>

        <Label
          variant="filled"
          color={statusColor(status)}
          sx={{
            right: 16,
            zIndex: 9,
            bottom: 16,
            position: 'absolute',
            textTransform: 'capitalize',
          }}
        >
          {status}
        </Label>

        <Box sx={{ p: 1, position: 'relative' }}>
          <Image alt={name} src={coverUrl} ratio="1/1" sx={{ borderRadius: 1.5 }} />
        </Box>
      </Paper>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleView}>
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete vehicle?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete <strong>{name}</strong> ({plateNumber})? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => setConfirmOpen(false)}
            startIcon={<Iconify icon="mingcute:close-line" />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function MetaItem({ icon, label }: { icon: string; label: string }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ minWidth: 0 }}>
      <Iconify width={16} icon={icon} sx={{ mr: 0.5, flexShrink: 0 }} />
      <Box
        component="span"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {label}
      </Box>
    </Stack>
  );
}

function statusColor(status: VehicleStatus): 'success' | 'warning' | 'default' {
  if (status === 'active') return 'success';
  if (status === 'maintenance') return 'warning';
  return 'default';
}
