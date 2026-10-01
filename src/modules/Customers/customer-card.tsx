import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from '@/hooks/use-boolean';
import { useTranslation } from 'react-i18next';

import Iconify from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import type { ICustomerItem } from './types';

// ----------------------------------------------------------------------

type Props = {
  customer: ICustomerItem;
  onDelete: VoidFunction;
  onView: VoidFunction;
};

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
      <Iconify icon={icon} width={16} sx={{ color: 'text.disabled', mt: 0.25, flexShrink: 0 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography variant="body2" noWrap title={value}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function CustomerCard({ customer, onDelete, onView }: Props) {
  const { t } = useTranslation('index');
  const { name, avatarUrl, phoneNumber, address, ticketsPurchased } = customer;

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <Card
        onClick={onView}
        sx={{
          p: 3,
          height: 1,
          cursor: 'pointer',
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.card,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['box-shadow', 'transform'], {
              duration: theme.transitions.duration.shorter,
            }),
          '& *': { cursor: 'inherit' },
          '&:hover': {
            boxShadow: (theme) => theme.customShadows.z8,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            popover.onOpen(event);
          }}
          sx={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer' }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ pr: 4, mb: 2.5 }}>
          <Avatar alt={name} src={avatarUrl} sx={{ width: 56, height: 56 }} />

          <ListItemText
            primary={name}
            secondary={t('TICKETS_PURCHASED_COUNT', { count: ticketsPurchased })}
            primaryTypographyProps={{ noWrap: true, typography: 'subtitle1' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
              noWrap: true,
            }}
          />
        </Stack>

        <Divider sx={{ borderStyle: 'dashed', mb: 2.5 }} />

        <Stack spacing={1.75}>
          <InfoRow icon="solar:phone-bold" label={t('PHONE')} value={phoneNumber} />
          <InfoRow icon="solar:map-point-bold" label={t('ADDRESS')} value={address} />
        </Stack>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onView();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t('VIEW')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('DELETE')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('DELETE')}
        content={t('DELETE_CONFIRM_QUESTION')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDelete();
              confirm.onFalse();
            }}
          >
            {t('DELETE')}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

type CustomerCardListProps = {
  customers: ICustomerItem[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
};

export function CustomerCardList({ customers, onDelete, onView }: CustomerCardListProps) {
  if (!customers.length) {
    return null;
  }

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
      sx={{
        p: 3,
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'grey.100' : 'background.neutral',
      }}
    >
      {customers.map((item) => (
        <CustomerCard
          key={item.id}
          customer={item}
          onView={() => onView(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </Box>
  );
}
