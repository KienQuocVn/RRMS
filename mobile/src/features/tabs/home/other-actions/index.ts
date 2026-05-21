import type { TabOwnedScreen } from '../../types';

export { default as FinanceSummaryScreen } from '@/app/(home-page)/other-actions/finance-summary';
export { default as ServiceSummaryScreen } from '@/app/(home-page)/other-actions/service-summary';
export { default as ZaloHistoryScreen } from '@/app/(home-page)/other-actions/zalo-history';
export { default as TransferHistoryScreen } from '@/app/(home-page)/other-actions/transfer-history';

export const homeOtherActionsScreens: TabOwnedScreen[] = [
  {
    id: 'finance-summary',
    tab: 'home',
    section: 'other-actions',
    label: 'Tong ket thu chi',
    route: '/other-actions/finance-summary',
    source: 'app/(home-page)/other-actions/finance-summary.tsx',
  },
    {
    id: 'service-summary',
    tab: 'home',
    section: 'other-actions',
    label: 'Tong ket dich vu',
    route: '/other-actions/service-summary',
    source: 'app/(home-page)/other-actions/service-summary.tsx',
  },
  
  {
    id: 'zalo-history',
    tab: 'home',
    section: 'other-actions',
    label: 'Lich su gui zalo',
    route: '/other-actions/zalo-history',
    source: 'app/(home-page)/other-actions/zalo-history.tsx',
  },
  {
    id: 'transfer-history',
    tab: 'home',
    section: 'other-actions',
    label: 'Lich su chuyen khoan',
    route: '/other-actions/transfer-history',
    source: 'app/(home-page)/other-actions/transfer-history.tsx',
  },
];
