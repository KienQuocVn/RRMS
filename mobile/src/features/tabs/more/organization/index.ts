import type { TabOwnedScreen } from '../../types';

export { default as CompanyManagementScreen } from '@/app/(management)/(buildings)/company-management';
export { default as BrandSettingsScreen } from '@/app/(settings)/(configuration)/brand-settings';

export const moreOrganizationScreens: TabOwnedScreen[] = [
  {
    id: 'company-management',
    tab: 'more',
    section: 'organization',
    label: 'Cong ty nhom',
    route: '/company-management',
    source: 'app/(management)/(buildings)/company-management.tsx',
  },
  {
    id: 'brand-settings',
    tab: 'more',
    section: 'organization',
    label: 'Cai dat thuong hieu',
    route: '/brand-settings',
    source: 'app/(settings)/(configuration)/brand-settings.tsx',
  },
];
