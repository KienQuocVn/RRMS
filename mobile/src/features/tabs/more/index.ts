export * from './account';
export * from './organization';
export * from './settings';
export * from './support';

import { moreAccountScreens } from './account';
import { moreOrganizationScreens } from './organization';
import { moreSettingsScreens } from './settings';
import { moreSupportScreens } from './support';

export const moreTabScreens = [
  ...moreAccountScreens,
  ...moreOrganizationScreens,
  ...moreSettingsScreens,
  ...moreSupportScreens,
];
