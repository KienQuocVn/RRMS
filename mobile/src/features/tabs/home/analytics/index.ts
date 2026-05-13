import type { TabOwnedScreen } from '../../types';

export { default as RoomStatsScreen } from '@/app/(management)/(occupancy)/room-stats';
export { default as FinanceStatsScreen } from '@/app/(finance)/(billing)/finance-stats';
export { default as FinanceSummaryScreen } from '@/app/(finance)/(billing)/finance-summary';
export { default as ServiceSummaryScreen } from '@/app/(finance)/(billing)/service-summary';
export { default as ZaloHistoryScreen } from '@/app/(finance)/(banking)/zalo-history';
export { default as TransferHistoryScreen } from '@/app/(finance)/(banking)/transfer-history';

export const homeAnalyticsScreens: TabOwnedScreen[] = [
  {
    id: 'room-stats',
    tab: 'home',
    section: 'analytics',
    label: 'Thong ke phong',
    route: '/room-stats',
    source: 'app/(management)/(occupancy)/room-stats.tsx',
  },
  {
    id: 'finance-stats',
    tab: 'home',
    section: 'analytics',
    label: 'Thong ke tai chinh',
    route: '/finance-stats',
    source: 'app/(finance)/(billing)/finance-stats.tsx',
  },
  {
    id: 'finance-summary',
    tab: 'home',
    section: 'analytics',
    label: 'Tong ket thu chi',
    route: '/finance-summary',
    source: 'app/(finance)/(billing)/finance-summary.tsx',
  },
  {
    id: 'service-summary',
    tab: 'home',
    section: 'analytics',
    label: 'Tong ket dich vu',
    route: '/service-summary',
    source: 'app/(finance)/(billing)/service-summary.tsx',
  },
  {
    id: 'zalo-history',
    tab: 'home',
    section: 'analytics',
    label: 'Lich su gui zalo',
    route: '/zalo-history',
    source: 'app/(finance)/(banking)/zalo-history.tsx',
  },
  {
    id: 'transfer-history',
    tab: 'home',
    section: 'analytics',
    label: 'Lich su chuyen khoan',
    route: '/transfer-history',
    source: 'app/(finance)/(banking)/transfer-history.tsx',
  },
];
