export * from './overview';
export * from './quick-actions';
export * from './management';
export * from './rental-settings';
export * from './other-actions';
export * from './expanded-menu';

import { homeOverviewScreens } from './overview';
import { homeQuickActionScreens } from './quick-actions';
import { homeManagementScreens } from './management';
import { homeRentalSettingsScreens } from './rental-settings';
import { homeOtherActionsScreens } from './other-actions';
import { homeExpandedMenuScreens } from './expanded-menu';

export const homeTabScreens = [
  ...homeOverviewScreens,
  ...homeQuickActionScreens,
  ...homeManagementScreens,
  ...homeRentalSettingsScreens,
  ...homeOtherActionsScreens,
  ...homeExpandedMenuScreens,
];
