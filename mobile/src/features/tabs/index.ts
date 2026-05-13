export * from './types';
export * from './home';
export * from './inbox';
export * from './tasks';
export * from './find-tenants';
export * from './more';

import { homeTabScreens } from './home';
import { inboxTabScreens } from './inbox';
import { tasksTabScreens } from './tasks';
import { findTenantsTabScreens } from './find-tenants';
import { moreTabScreens } from './more';

export const screensByTab = {
  home: homeTabScreens,
  inbox: inboxTabScreens,
  tasks: tasksTabScreens,
  'find-tenants': findTenantsTabScreens,
  more: moreTabScreens,
} as const;

export const tabScreenRegistry = [
  ...homeTabScreens,
  ...inboxTabScreens,
  ...tasksTabScreens,
  ...findTenantsTabScreens,
  ...moreTabScreens,
];
