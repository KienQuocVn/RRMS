export * from './overview';
export * from './quick-actions';
export * from './management';
export * from './rooms';
export * from './rental-settings';
export * from './other-actions';
export * from './expanded-menu';

import { homeOverviewScreens } from './overview';
import { homeQuickActionScreens } from './quick-actions';
import { homeManagementScreens } from './management';
import { homeRoomsScreens } from './rooms';
import { homeRentalSettingsScreens } from './rental-settings';
import { homeOtherActionsScreens } from './other-actions';
import { homeExpandedMenuScreens } from './expanded-menu';

export const homeTabScreens = [
  ...homeOverviewScreens,
  ...homeQuickActionScreens,
  ...homeManagementScreens,
  ...homeRoomsScreens,
  ...homeRentalSettingsScreens,
  ...homeOtherActionsScreens,
  ...homeExpandedMenuScreens,
];
