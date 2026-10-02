import { m } from 'framer-motion';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useTranslation } from 'react-i18next';

import { useGetContacts } from '@/hooks/useGetContacts.hook';

import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import { varHover } from '@/components/animate';
import CustomPopover, { usePopover } from '@/components/custom-popover';

// ----------------------------------------------------------------------

export default function ContactsPopover() {
  const { t } = useTranslation('index');
  const popover = usePopover();
  const { data: contacts = [] } = useGetContacts();

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={popover.open ? 'inherit' : 'default'}
        onClick={popover.onOpen}
        sx={{
          ...(popover.open && {
            bgcolor: (theme) => theme.palette.action.selected,
          }),
        }}
      >
        <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 320 }}>
        <Typography variant="h6" sx={{ p: 1.5 }}>
          {t('CONTACTS')}{' '}
          <Typography component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            ({contacts.length})
          </Typography>
        </Typography>

        <Scrollbar sx={{ maxHeight: 320 }}>
          {contacts.map((contact) => (
            <MenuItem key={contact.id} sx={{ p: 1 }}>
              <Badge
                variant="dot"
                color={contact.status === 'online' ? 'success' : 'warning'}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{ mr: 2 }}
              >
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: 14 }}>
                  {contact.name.charAt(0)}
                </Avatar>
              </Badge>

              <ListItemText
                primary={contact.name}
                secondary={contact.role}
                primaryTypographyProps={{ typography: 'subtitle2' }}
                secondaryTypographyProps={{ typography: 'caption', color: 'text.disabled' }}
              />
            </MenuItem>
          ))}
        </Scrollbar>
      </CustomPopover>
    </>
  );
}
