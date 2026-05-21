import type { TabOwnedScreen } from '../../types';

export { default as MoreTabScreen } from '@/app/(more-page)/more';


export const moreAccountScreens: TabOwnedScreen[] = [
  {
    id: 'more-tab',
    tab: 'more',
    section: 'account',
    label: 'Them plus',
    route: '/more',
    source: 'app/(more-page)/more.tsx',
  },


];
