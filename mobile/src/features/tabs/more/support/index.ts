import type { TabOwnedScreen } from '../../types';

export { default as HelpCenterScreen } from '@/app/(account)/(support)/help-center';
export { default as AppInfoScreen } from '@/app/(account)/(support)/app-info';
export { default as PrivacyPolicyScreen } from '@/app/(account)/(legal)/privacy-policy';
export { default as TermsOfUseScreen } from '@/app/(account)/(legal)/terms-of-use';

export const moreSupportScreens: TabOwnedScreen[] = [
  {
    id: 'help-center',
    tab: 'more',
    section: 'support',
    label: 'Trung tam tro giup',
    route: '/help-center',
    source: 'app/(account)/(support)/help-center.tsx',
  },
  {
    id: 'app-info',
    tab: 'more',
    section: 'support',
    label: 'Thong tin phan mem',
    route: '/app-info',
    source: 'app/(account)/(support)/app-info.tsx',
  },
  {
    id: 'privacy-policy',
    tab: 'more',
    section: 'support',
    label: 'Chinh sach bao mat',
    route: '/privacy-policy',
    source: 'app/(account)/(legal)/privacy-policy.tsx',
  },
  {
    id: 'terms-of-use',
    tab: 'more',
    section: 'support',
    label: 'Dieu khoan su dung',
    route: '/terms-of-use',
    source: 'app/(account)/(legal)/terms-of-use.tsx',
  },
];
