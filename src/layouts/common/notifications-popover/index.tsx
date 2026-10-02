import { m } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'react-i18next';

import { useBoolean } from '@/hooks/use-boolean';
import { useGetNotifications } from '@/hooks/useGetNotifications.hook';
import { useResponsive } from '@/hooks/use-responsive';

import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import { varHover } from '@/components/animate';

import NotificationItem from './notification-item';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const { t } = useTranslation('index');

  const tabs = [
    {
      value: 'all',
      label: t('ALL'),
    },
    {
      value: 'unread',
      label: t('UNREAD'),
    },
  ];

  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');

  const [currentTab, setCurrentTab] = useState('all');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const { data: notificationsData = [] } = useGetNotifications();
  const [notifications, setNotifications] = useState(notificationsData);

  useEffect(() => {
    setNotifications(notificationsData);
  }, [notificationsData]);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  const filteredNotifications =
    currentTab === 'unread'
      ? notifications.filter((item) => item.isUnRead)
      : notifications;

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('NOTIFICATIONS')}
      </Typography>

      {!!totalUnRead && (
        <Tooltip title={t('MARK_ALL_AS_READ')}>
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Badge
              color={tab.value === 'unread' ? 'info' : 'default'}
              badgeContent={
                tab.value === 'unread' ? totalUnRead : notifications.length
              }
              sx={{ ml: 1 }}
            />
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {filteredNotifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2.5, pb: 0 }}
        >
          {renderTabs}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        {renderList}
      </Drawer>
    </>
  );
}
