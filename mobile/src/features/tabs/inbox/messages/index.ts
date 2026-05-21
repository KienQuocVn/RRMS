import type { TabOwnedScreen } from "../../types";

export { default as InboxTabScreen } from "@/app/(tabs)/inbox";
export { default as NewChatScreen } from "@/app/(mail-box-page)/(chat)/new-chat";

export const inboxMessageScreens: TabOwnedScreen[] = [
  {
    id: "inbox-tab",
    tab: "inbox",
    section: "messages",
    label: "Hop thu",
    route: "/inbox",
    source: "app/(tabs)/inbox.tsx",
    notes: "Tab wrapper re-exporting the mailbox inbox screen.",
  },
  {
    id: "new-chat",
    tab: "inbox",
    section: "messages",
    label: "Tao cuoc chat moi",
    route: "/new-chat",
    source: "app/(mail-box-page)/(chat)/new-chat.tsx",
  },
  {
    id: "notification-settings",
    tab: "inbox",
    section: "messages",
    label: "Cai dat thong bao",
    route: "/notification-settings",
    source: "app/(mail-box-page)/notification-settings.tsx",
    notes: "Shared screen used by inbox and more tab.",
  },
];
