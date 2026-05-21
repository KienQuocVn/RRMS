import type { TabOwnedScreen } from '../../types';

export { default as HomeTabScreen } from '@/app/(tabs)/(home)/index';
export { default as RoomStatsScreen } from '@/app/(home-page)/tab-overview/room-status/rooms-for-rent';
export { default as FinanceStatsScreen } from '@/app/(home-page)/tab-overview/financial-statistics/finance-stats';

export const homeOverviewScreens: TabOwnedScreen[] = [
  {
    id: 'home-tab',
    tab: 'home',
    section: 'overview',
    label: 'Trang chu',
    route: '/(tabs)/(home)',
    source: 'app/(tabs)/(home)/index.tsx',
  },
    {
    id: 'room-stats',
    tab: 'home',
    section: 'overview',
    label: 'Thong ke phong',
    route: '/tab-overview/room-stats',
    source: 'app/(home-page)/tab-overview/room-stats.tsx',
  },
    {
    id: 'finance-stats',
    tab: 'home',
    section: 'overview',
    label: 'Thong ke tai chinh',
    route: '/tab-overview/finance-stats',
    source: 'app/(home-page)/tab-overview/finance-stats.tsx',
  },
];
