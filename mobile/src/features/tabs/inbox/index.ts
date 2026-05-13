export * from './messages';
export * from './settings';

import { inboxMessageScreens } from './messages';
import { inboxSettingsScreens } from './settings';

export const inboxTabScreens = [
  ...inboxMessageScreens,
  ...inboxSettingsScreens,
];
