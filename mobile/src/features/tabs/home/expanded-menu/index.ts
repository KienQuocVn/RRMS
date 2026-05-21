import type { TabOwnedScreen } from "../../types";

export { default as BankAccountScreen } from "@/app/(home-page)/tab-manage/expanded-menu/bank-account";

export const homeExpandedMenuScreens: TabOwnedScreen[] = [
  {
    id: "bank-account",
    tab: "home",
    section: "settings",
    label: "Tai khoan ngan hang",
    route: "/tab-manage/expanded-menu/bank-account",
    source: "app/(home-page)/tab-manage/expanded-menu/bank-account.tsx",
  },
    {
    id: "broker-management",
    tab: "home",
    section: "settings",
    label: "Quan ly moi gioi",
    route: "/tab-manage/expanded-menu/broker-management",
    source: "app/(home-page)/tab-manage/expanded-menu/broker-management.tsx",
  },
];
