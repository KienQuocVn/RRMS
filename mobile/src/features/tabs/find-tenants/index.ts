import type { TabOwnedScreen } from '../types';

export { default as FindTenantsTabScreen } from '@/app/(tabs)/find-tenants';

export const findTenantsTabScreens: TabOwnedScreen[] = [
  {
    id: 'find-tenants-tab',
    tab: 'find-tenants',
    section: 'root',
    label: 'Tim khach',
    route: '/find-tenants',
    source: 'app/(tabs)/find-tenants.tsx',
    notes: 'Tab wrapper re-exporting the find tenants screen.',
  },
];
