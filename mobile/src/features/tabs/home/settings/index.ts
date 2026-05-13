import type { TabOwnedScreen } from '../../types';

export { default as MotelSettingsScreen } from '@/app/(settings)/(configuration)/motel-settings';
export { default as RentalSettingsScreen } from '@/app/(settings)/(configuration)/rental-settings';
export { default as ServicesSettingsScreen } from '@/app/(settings)/(configuration)/services-settings';
export { default as InvoiceSettingsScreen } from '@/app/(settings)/(configuration)/invoice-settings';
export { default as TenantAppSettingsScreen } from '@/app/(settings)/(configuration)/tenant-app-settings';
export { default as ToggleFeaturesScreen } from '@/app/(settings)/(configuration)/toggle-features';
export { default as RoomGroupsScreen } from '@/app/(management)/(occupancy)/room-groups';
export { default as PriceIncreaseScreen } from '@/app/(settings)/(policies)/price-increase';
export { default as RulesSettingsScreen } from '@/app/(settings)/(policies)/rules-settings';
export { default as AmenitiesSettingsScreen } from '@/app/(settings)/(policies)/amenities-settings';
export { default as BankAccountScreen } from '@/app/(finance)/(banking)/bank-account';
export { default as IncomeExpenseScreen } from '@/app/(finance)/(bookkeeping)/income-expense';

export const homeSettingsScreens: TabOwnedScreen[] = [
  {
    id: 'motel-settings',
    tab: 'home',
    section: 'settings',
    label: 'Cai dat nha tro',
    route: '/motel-settings',
    source: 'app/(settings)/(configuration)/motel-settings.tsx',
  },
  {
    id: 'rental-settings',
    tab: 'home',
    section: 'settings',
    label: 'Rental settings compatibility route',
    route: '/rental-settings',
    source: 'app/(settings)/(configuration)/rental-settings.tsx',
    notes: 'Re-export compatibility wrapper to motel-settings.',
  },
  {
    id: 'services-settings',
    tab: 'home',
    section: 'settings',
    label: 'Cai dat dich vu',
    route: '/services-settings',
    source: 'app/(settings)/(configuration)/services-settings.tsx',
  },
  {
    id: 'invoice-settings',
    tab: 'home',
    section: 'settings',
    label: 'Cai dat hoa don',
    route: '/invoice-settings',
    source: 'app/(settings)/(configuration)/invoice-settings.tsx',
  },
  {
    id: 'tenant-app-settings',
    tab: 'home',
    section: 'settings',
    label: 'Cai dat app khach thue',
    route: '/tenant-app-settings',
    source: 'app/(settings)/(configuration)/tenant-app-settings.tsx',
  },
  {
    id: 'toggle-features',
    tab: 'home',
    section: 'settings',
    label: 'Bat tat tinh nang',
    route: '/toggle-features',
    source: 'app/(settings)/(configuration)/toggle-features.tsx',
  },
  {
    id: 'room-groups',
    tab: 'home',
    section: 'settings',
    label: 'Nhom phong',
    route: '/room-groups',
    source: 'app/(management)/(occupancy)/room-groups.tsx',
  },
  {
    id: 'price-increase',
    tab: 'home',
    section: 'settings',
    label: 'Tang gia thue',
    route: '/price-increase',
    source: 'app/(settings)/(policies)/price-increase.tsx',
  },
  {
    id: 'rules-settings',
    tab: 'home',
    section: 'settings',
    label: 'Noi quy va gio giac',
    route: '/rules-settings',
    source: 'app/(settings)/(policies)/rules-settings.tsx',
  },
  {
    id: 'amenities-settings',
    tab: 'home',
    section: 'settings',
    label: 'Tien ich cho thue',
    route: '/amenities-settings',
    source: 'app/(settings)/(policies)/amenities-settings.tsx',
  },
  {
    id: 'bank-account',
    tab: 'home',
    section: 'settings',
    label: 'Tai khoan ngan hang',
    route: '/bank-account',
    source: 'app/(finance)/(banking)/bank-account.tsx',
  },
  {
    id: 'income-expense',
    tab: 'home',
    section: 'settings',
    label: 'Cai dat thu chi',
    route: '/income-expense',
    source: 'app/(finance)/(bookkeeping)/income-expense.tsx',
  },
];
