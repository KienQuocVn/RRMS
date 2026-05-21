export * from './account';
export * from './settings';

import { moreAccountScreens } from './account';
import { moreSettingsScreens } from './settings';

export const moreTabScreens = [
  ...moreAccountScreens,
  ...moreSettingsScreens,
];
