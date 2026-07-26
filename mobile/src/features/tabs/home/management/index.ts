import type { TabOwnedScreen } from "../../types";

export { default as RoomsListScreen } from "@/app/(home-page)/tab-manage/management-menu/rooms/rooms-list";
export { default as ContractsListScreen } from "@/app/(home-page)/tab-manage/management-menu/contracts";
export { default as InvoicesListScreen } from "@/app/(home-page)/tab-manage/management-menu/invoices";
export { default as TenantsListScreen } from "@/app/(home-page)/tab-manage/management-menu/tenants";
export { default as AssetsListScreen } from "@/app/(home-page)/tab-manage/management-menu/assets-list/assets";
export { default as VehiclesListScreen } from "@/app/(home-page)/tab-manage/management-menu/vehicles";

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
    route: "/tab-manage/management-menu/rooms/rooms-list",
    source: "app/(home-page)/tab-manage/management-menu/rooms/rooms-list.tsx",
  },
  {
    id: "contracts",
    tab: "home",
    section: "management",
    label: "Quan ly hop dong",
    route: "/tab-manage/management-menu/contracts",
    source: "app/(home-page)/tab-manage/management-menu/contracts/index.tsx",
  },
  {
    id: "invoices",
    tab: "home",
    section: "management",
    label: "Quan ly hoa don",
    route: "/tab-manage/management-menu/invoices",
    source: "app/(home-page)/tab-manage/management-menu/invoices/index.tsx",
  },
  {
    id: "tenants",
    tab: "home",
    section: "management",
    label: "Quan ly khach thue",
    route: "/tab-manage/management-menu/tenants",
    source: "app/(home-page)/tab-manage/management-menu/tenants/index.tsx",
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
    id: "vehicles",
    tab: "home",
    section: "management",
    label: "Danh sach xe",
    route: "/tab-manage/management-menu/vehicles",
    source: "app/(home-page)/tab-manage/management-menu/vehicles/index.tsx",
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
