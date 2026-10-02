import type { INotificationItem } from '@/interfaces/notification.interface';

export const _notifications: INotificationItem[] = [
  {
    id: '1',
    title: '<p><strong>Bus #102</strong> completed its morning route successfully.</p>',
    category: 'Fleet Operations',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    isUnRead: true,
    type: 'delivery',
    avatarUrl: null,
  },
  {
    id: '2',
    title: '<p><strong>Driver John Doe</strong> reported maintenance required for Bus #405.</p>',
    category: 'Maintenance',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isUnRead: true,
    type: 'mail',
    avatarUrl: null,
  },
  {
    id: '3',
    title: '<p><strong>System Schedule</strong> updated for route Downtown - Airport line.</p>',
    category: 'Schedules',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    isUnRead: false,
    type: 'chat',
    avatarUrl: null,
  },
];
