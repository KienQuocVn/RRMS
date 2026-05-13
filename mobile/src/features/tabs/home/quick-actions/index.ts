import type { TabOwnedScreen } from '../../types';

export { default as DepositScreen } from '@/app/(finance)/(contracts)/deposit';
export { default as ContractScreen } from '@/app/(finance)/(contracts)/contract';
export { default as CheckoutScreen } from '@/app/(finance)/(billing)/checkout';
export { default as InvoiceScreen } from '@/app/(finance)/(billing)/invoice';
export { default as BillScreen } from '@/app/(finance)/(billing)/bill';
export { default as CollectScreen } from '@/app/(finance)/(billing)/collect';

export const homeQuickActionScreens: TabOwnedScreen[] = [
  {
    id: 'deposit',
    tab: 'home',
    section: 'quick-actions',
    label: 'Coc giu cho',
    route: '/deposit',
    source: 'app/(finance)/(contracts)/deposit.tsx',
  },
  {
    id: 'contract',
    tab: 'home',
    section: 'quick-actions',
    label: 'Lap hop dong moi',
    route: '/contract',
    source: 'app/(finance)/(contracts)/contract.tsx',
  },
  {
    id: 'checkout',
    tab: 'home',
    section: 'quick-actions',
    label: 'Thanh ly tra phong',
    route: '/checkout',
    source: 'app/(finance)/(billing)/checkout.tsx',
  },
  {
    id: 'invoice',
    tab: 'home',
    section: 'quick-actions',
    label: 'Lap hoa don',
    route: '/invoice',
    source: 'app/(finance)/(billing)/invoice.tsx',
  },
  {
    id: 'bill',
    tab: 'home',
    section: 'quick-actions',
    label: 'Chot va lap hoa don',
    route: '/bill',
    source: 'app/(finance)/(billing)/bill.tsx',
  },
  {
    id: 'collect',
    tab: 'home',
    section: 'quick-actions',
    label: 'Hoa don can thu tien',
    route: '/collect',
    source: 'app/(finance)/(billing)/collect.tsx',
  },
];
