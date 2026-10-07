import type { TabOwnedScreen } from "../../types";

export { default as DepositScreen } from "@/app/(home-page)/tab-manage/quick-actions/deposit";
export { default as ContractScreen } from "@/app/(home-page)/tab-manage/quick-actions/contract";
export { default as CheckoutScreen } from "@/app/(home-page)/tab-manage/quick-actions/checkout";
export { default as ReportEndContractScreen } from "@/app/(home-page)/tab-manage/quick-actions/report-end-contract";
export { default as EndContractScreen } from "@/app/(home-page)/tab-manage/quick-actions/end-contract";
export { default as InvoiceScreen } from "@/app/(home-page)/tab-manage/quick-actions/invoice";
export { default as BillScreen } from "@/app/(home-page)/tab-manage/quick-actions/bill";
export { default as CollectScreen } from "@/app/(home-page)/tab-manage/quick-actions/collect";

export const homeQuickActionScreens: TabOwnedScreen[] = [
  {
    id: "deposit",
    tab: "home",
    section: "quick-actions",
    label: "Coc giu cho",
    route: "/tab-manage/quick-actions/deposit",
    source: "app/(home-page)/tab-manage/quick-actions/deposit.tsx",
  },
  {
    id: "contract",
    tab: "home",
    section: "quick-actions",
    label: "Lap hop dong moi",
    route: "/tab-manage/quick-actions/contract",
    source: "app/(home-page)/tab-manage/quick-actions/contract.tsx",
  },
  {
    id: "checkout",
    tab: "home",
    section: "quick-actions",
    label: "Thanh ly tra phong",
    route: "/tab-manage/quick-actions/checkout",
    source: "app/(home-page)/tab-manage/quick-actions/checkout.tsx",
  },
  {
    id: "report-end-contract",
    tab: "home",
    section: "quick-actions",
    label: "Bao ket thuc hop dong",
    route: "/tab-manage/quick-actions/report-end-contract",
    source: "app/(home-page)/tab-manage/quick-actions/report-end-contract.tsx",
  },
  {
    id: "end-contract",
    tab: "home",
    section: "quick-actions",
    label: "Ket thuc hop dong",
    route: "/tab-manage/quick-actions/end-contract",
    source: "app/(home-page)/tab-manage/quick-actions/end-contract.tsx",
  },
  {
    id: "invoice",
    tab: "home",
    section: "quick-actions",
    label: "Lap hoa don",
    route: "/tab-manage/quick-actions/invoice",
    source: "app/(home-page)/tab-manage/quick-actions/invoice.tsx",
  },
  {
    id: "bill",
    tab: "home",
    section: "quick-actions",
    label: "Chot va lap hoa don",
    route: "/tab-manage/quick-actions/bill",
    source: "app/(home-page)/tab-manage/quick-actions/bill.tsx",
  },
  {
    id: "collect",
    tab: "home",
    section: "quick-actions",
    label: "Hoa don can thu tien",
    route: "/tab-manage/quick-actions/collect",
    source: "app/(home-page)/tab-manage/quick-actions/collect.tsx",
  },
];
