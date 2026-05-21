import type { TabOwnedScreen } from '../../types';

export { default as FinanceSummaryScreen } from '@/app/(finance)/(billing)/finance-summary';
export { default as ServiceSummaryScreen } from '@/app/(finance)/(billing)/service-summary';
export { default as ZaloHistoryScreen } from '@/app/(finance)/(banking)/zalo-history';
export { default as TransferHistoryScreen } from '@/app/(finance)/(banking)/transfer-history';

export const homeAnalyticsScreens: TabOwnedScreen[] = [


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
