import type { TabOwnedScreen } from '../../types';

export const homeOverviewScreens: TabOwnedScreen[] = [
  {
    id: 'home-tab',
    tab: 'home',
    section: 'overview',
    label: 'Trang chu',
    route: '/(tabs)/(home)',
    source: 'app/(tabs)/(home)/index.tsx',
  },

];
