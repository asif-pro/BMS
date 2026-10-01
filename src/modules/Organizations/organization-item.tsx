import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';

import { fTaka } from '@/utils/format-number';
import { fDate } from '@/utils/format-time';

import Iconify from '@/components/iconify';
import CustomPopover, { usePopover } from '@/components/custom-popover';

import type { IOrganizationItem } from './types';

// ----------------------------------------------------------------------

type Props = {
  organization: IOrganizationItem;
  onView: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

export default function OrganizationItem({ organization, onView, onEdit, onDelete }: Props) {
  const { t } = useTranslation('index');
  const popover = usePopover();

  const { title, company, createdAt, contacts, size, partnershipTypes, fee, category } =
    organization;

  return (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            alt={company.name}
            src={company.logo}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2, bgcolor: 'background.neutral' }}
          >
            {company.name.charAt(0)}
          </Avatar>

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link component="button" onClick={onView} color="inherit" underline="hover">
                {title}
              </Link>
            }
            secondary={t('JOINED_DATE', { date: fDate(createdAt) })}
            primaryTypographyProps={{
              typography: 'subtitle1',
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption' }}
          >
            <Iconify width={16} icon="solar:users-group-rounded-bold" />
            {t('CONTACTS_COUNT', { count: contacts.length })}
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
          {[
            {
              label: size,
              icon: <Iconify width={16} icon="solar:bus-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: partnershipTypes.join(', '),
              icon: <Iconify width={16} icon="solar:handshake-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: fee.negotiable ? t('NEGOTIABLE') : fTaka(fee.price),
              icon: <Iconify width={16} icon="solar:wad-of-money-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: category,
              icon: <Iconify width={16} icon="solar:tag-horizontal-bold" sx={{ flexShrink: 0 }} />,
            },
          ].map((item) => (
            <Stack
              key={item.label}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t('VIEW')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('EDIT')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('DELETE')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
