import type { TabOwnedScreen } from '../../types';

export { default as InboxNotificationSettingsScreen } from '@/app/(settings)/(access)/notification-settings';

export const inboxSettingsScreens: TabOwnedScreen[] = [
  {
    id: 'notification-settings',
    tab: 'inbox',
    section: 'settings',
    label: 'Cai dat thong bao',
    route: '/notification-settings',
    source: 'app/(settings)/(access)/notification-settings.tsx',
    notes: 'Shared screen used by inbox and more tab.',
  },
];
