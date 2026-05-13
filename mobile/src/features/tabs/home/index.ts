export * from './overview';
export * from './quick-actions';
export * from './management';
export * from './settings';
export * from './analytics';
export * from './rooms';

import { homeOverviewScreens } from './overview';
import { homeQuickActionScreens } from './quick-actions';
import { homeManagementScreens } from './management';
import { homeSettingsScreens } from './settings';
import { homeAnalyticsScreens } from './analytics';
import { homeRoomsScreens } from './rooms';

export const homeTabScreens = [
  ...homeOverviewScreens,
  ...homeQuickActionScreens,
  ...homeManagementScreens,
  ...homeSettingsScreens,
  ...homeAnalyticsScreens,
  ...homeRoomsScreens,
];
