import type { TabOwnedScreen } from '../../types';

export { default as InboxTabScreen } from '@/app/(tabs)/inbox';
export { default as NewChatScreen } from '@/app/(communication)/(chat)/new-chat';

export const inboxMessageScreens: TabOwnedScreen[] = [
  {
    id: 'inbox-tab',
    tab: 'inbox',
    section: 'messages',
    label: 'Hop thu',
    route: '/inbox',
    source: 'app/(tabs)/inbox.tsx',
  },
  {
    id: 'new-chat',
    tab: 'inbox',
    section: 'messages',
    label: 'Tao cuoc chat moi',
    route: '/new-chat',
    source: 'app/(communication)/(chat)/new-chat.tsx',
  },
];
