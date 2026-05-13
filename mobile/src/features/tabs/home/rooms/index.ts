import type { TabOwnedScreen } from '../../types';

export { default as RoomsTabScreen } from '@/app/(tabs)/rooms/index';
export { default as AddRoomScreen } from '@/app/(tabs)/rooms/add';
export { default as RoomDetailScreen } from '@/app/(tabs)/rooms/[id]';

export const homeRoomsScreens: TabOwnedScreen[] = [
  {
    id: 'rooms-tab',
    tab: 'home',
    section: 'rooms',
    label: 'Danh sach phong tab an',
    route: '/rooms',
    source: 'app/(tabs)/rooms/index.tsx',
  },
  {
    id: 'add-room',
    tab: 'home',
    section: 'rooms',
    label: 'Them phong',
    route: '/rooms/add',
    source: 'app/(tabs)/rooms/add.tsx',
  },
  {
    id: 'room-detail',
    tab: 'home',
    section: 'rooms',
    label: 'Chi tiet phong',
    route: '/rooms/[id]',
    source: 'app/(tabs)/rooms/[id].tsx',
  },
];
