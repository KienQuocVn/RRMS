import type { TabOwnedScreen } from '../../types';

export { default as PermissionsScreen } from '@/app/(settings)/(access)/permissions';
export { default as MoreNotificationSettingsScreen } from '@/app/(settings)/(access)/notification-settings';

export const moreSettingsScreens: TabOwnedScreen[] = [
  {
    id: 'permissions',
    tab: 'more',
    section: 'settings',
    label: 'Quyen phan mem',
    route: '/permissions',
    source: 'app/(settings)/(access)/permissions.tsx',
  },
  {
    id: 'notification-settings',
    tab: 'more',
    section: 'settings',
    label: 'Thong bao',
    route: '/notification-settings',
    source: 'app/(settings)/(access)/notification-settings.tsx',
    notes: 'Shared screen used by more and inbox tab.',
  },
];
