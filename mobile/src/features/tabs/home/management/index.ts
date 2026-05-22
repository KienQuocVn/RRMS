import type { TabOwnedScreen } from "../../types";

export { default as RoomsListScreen } from "@/app/(home-page)/tab-manage/management-menu/rooms-list";
export { default as ContractsListScreen } from "@/app/(home-page)/tab-manage/management-menu/contracts-list";
export { default as InvoicesListScreen } from "@/app/(home-page)/tab-manage/management-menu/invoices-list";
export { default as TenantsListScreen } from "@/app/(home-page)/tab-manage/management-menu/tenants-list";
export { default as AssetsListScreen } from "@/app/(home-page)/tab-manage/management-menu/assets-list/assets";
export { default as VehiclesListScreen } from "@/app/(home-page)/tab-manage/management-menu/vehicles-list";

export const homeManagementScreens: TabOwnedScreen[] = [
  {
    id: "add-building",
    tab: "home",
    section: "management",
    label: "Them toa nha",
    route: "/add-building/add-building",
    source: "app/(home-page)/menu-management-home/add-building/add-building.tsx",
  },
  {
    id: "edit-building",
    tab: "home",
    section: "management",
    label: "Sua toa nha",
    route: "/edit-building/edit-building",
    source: "app/(home-page)/menu-management-home/edit-building/edit-building.tsx",
  },

  {
    id: "rooms-list",
    tab: "home",
    section: "management",
    label: "Quan ly phong",
    route: "/tab-manage/management-menu/rooms-list",
    source: "app/(home-page)/tab-manage/management-menu/rooms-list.tsx",
  },
  {
    id: "contracts-list",
    tab: "home",
    section: "management",
    label: "Quan ly hop dong",
    route: "/tab-manage/management-menu/contracts-list",
    source: "app/(home-page)/tab-manage/management-menu/contracts-list.tsx",
  },
  {
    id: "invoices-list",
    tab: "home",
    section: "management",
    label: "Quan ly hoa don",
    route: "/tab-manage/management-menu/invoices-list",
    source: "app/(home-page)/tab-manage/management-menu/invoices-list.tsx",
  },
  {
    id: "tenants-list",
    tab: "home",
    section: "management",
    label: "Quan ly khach thue",
    route: "/tab-manage/management-menu/tenants-list",
    source: "app/(home-page)/tab-manage/management-menu/tenants-list.tsx",
  },
  {
    id: "assets-list",
    tab: "home",
    section: "management",
    label: "Quan ly tai san",
    route: "/tab-manage/management-menu/assets-list/assets",
    source: "app/(home-page)/tab-manage/management-menu/assets-list/assets.tsx",
  },
  {
    id: "vehicles-list",
    tab: "home",
    section: "management",
    label: "Danh sach xe",
    route: "/tab-manage/management-menu/vehicles-list",
    source: "app/(home-page)/tab-manage/management-menu/vehicles-list.tsx",
  },
  {
    id: "services",
    tab: "home",
    section: "settings",
    label: "Cai dat dich vu",
    route: "/tab-manage/management-menu/service-settings/services",
    source: "app/(home-page)/tab-manage/management-menu/service-settings/services.tsx",
  },
  {
    id: "tenant-app-settings",
    tab: "home",
    section: "settings",
    label: "Cai dat app khach thue",
    route: "/tab-manage/management-menu/tenant-app-settings",
    source: "app/(home-page)/tab-manage/management-menu/tenant-app-settings.tsx",
  },
  {
    id: "invoice-settings",
    tab: "home",
    section: "settings",
    label: "Cai dat hoa don",
    route: "/tab-manage/management-menu/invoice-settings",
    source: "app/(home-page)/tab-manage/management-menu/invoice-settings.tsx",
  },
  {
    id: "motel-settings",
    tab: "home",
    section: "settings",
    label: "Cai dat nha tro",
    route: "/tab-manage/management-menu/motel-settings",
    source: "app/(home-page)/tab-manage/management-menu/motel-settings.tsx",
  },
];
