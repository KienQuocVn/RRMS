import type { TabOwnedScreen } from '../types';

export { default as TasksTabScreen } from '@/app/(tabs)/tasks';

export const tasksTabScreens: TabOwnedScreen[] = [
  {
    id: 'tasks-tab',
    tab: 'tasks',
    section: 'root',
    label: 'Cong viec',
    route: '/tasks',
    source: 'app/(tabs)/tasks.tsx',
    notes: 'Tab wrapper re-exporting the job tasks screen.',
  },
];
