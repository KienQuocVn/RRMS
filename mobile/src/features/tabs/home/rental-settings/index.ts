import type { TabOwnedScreen } from '../../types';

export { default as RoomGroupsScreen } from '@/app/(home-page)/rental-settings/room-groups';
export { default as PriceIncreaseScreen } from "@/app/(home-page)/rental-settings/price-increase";
export { default as IncomeExpenseScreen } from "@/app/(home-page)/rental-settings/income-expense";
export { default as ToggleFeaturesScreen } from "@/app/(home-page)/rental-settings/toggle-features";
export { default as RulesSettingsScreen } from "@/app/(home-page)/rental-settings/rules-settings";
export { default as AmenitiesSettingsScreen } from "@/app/(home-page)/rental-settings/amenities-settings";
export { default as RentalSettingsScreen } from "@/app/(home-page)/tab-manage/management-menu/motel-settings";

export const homeRentalSettingsScreens: TabOwnedScreen[] = [
  {
    id: 'room-groups',
    tab: 'home',
    section: 'rental-settings',
    label: 'Nhom phong',
    route: '/(home-page)/rental-settings/room-groups',
    source: 'app/(home-page)/rental-settings/room-groups.tsx',
  },
    {
    id: "price-increase",
    tab: "home",
    section: "rental-settings",
    label: "Tang gia thue",
    route: "/(home-page)/rental-settings/price-increase",
    source: "app/(home-page)/rental-settings/price-increase.tsx",
  },
    {
    id: "income-expense",
    tab: "home",
    section: "rental-settings",
    label: "Cai dat thu chi",
    route: "/(home-page)/rental-settings/income-expense",
    source: "app/(home-page)/rental-settings/income-expense.tsx",
  },
    {
    id: "toggle-features",
    tab: "home",
    section: "rental-settings",
    label: "Bat tat tinh nang",
    route: "/(home-page)/rental-settings/toggle-features",
    source: "app/(home-page)/rental-settings/toggle-features.tsx",
  },

    {
    id: "rules-settings",
    tab: "home",
    section: "rental-settings",
    label: "Noi quy va gio giac",
    route: "/(home-page)/rental-settings/rules-settings",
    source: "app/(home-page)/rental-settings/rules-settings.tsx",
  },
    {
    id: "amenities-settings",
    tab: "home",
    section: "rental-settings",
    label: "Tien ich cho thue",
    route: "/(home-page)/rental-settings/amenities-settings",
    source: "app/(home-page)/rental-settings/amenities-settings.tsx",
  },
  {
    id: "rental-settings",
    tab: "home",
    section: "rental-settings",
    label: "Rental settings compatibility route",
    route: "/rental-settings",
    source: "app/(home-page)/tab-manage/expanded-menu/motel-settings.tsx",
    notes: "Re-export compatibility wrapper to motel-settings.",
  },
];
