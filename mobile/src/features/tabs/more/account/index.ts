import type { TabOwnedScreen } from '../../types';

export { default as MoreTabScreen } from '@/app/(more-page)/more';
export { default as ProfileScreen } from '@/app/(account)/(profile)/profile';
export { default as EditProfileScreen } from '@/app/(account)/(profile)/edit-profile';
export { default as RepresentativeInfoScreen } from '@/app/(account)/(profile)/representative-info';
export { default as DigitalSignatureScreen } from '@/app/(account)/(profile)/digital-signature';
export { default as ChangePasswordScreen } from '@/app/(account)/(profile)/change-password';
export { default as LinkPhoneScreen } from '@/app/(account)/(profile)/link-phone';

export const moreAccountScreens: TabOwnedScreen[] = [
  {
    id: 'more-tab',
    tab: 'more',
    section: 'account',
    label: 'Them plus',
    route: '/more',
    source: 'app/(more-page)/more.tsx',
  },
  {
    id: 'profile',
    tab: 'more',
    section: 'account',
    label: 'Ho so',
    route: '/profile',
    source: 'app/(account)/(profile)/profile.tsx',
  },
  {
    id: 'representative-info',
    tab: 'more',
    section: 'account',
    label: 'Thong tin dai dien',
    route: '/representative-info',
    source: 'app/(account)/(profile)/representative-info.tsx',
  },
  {
    id: 'edit-profile',
    tab: 'more',
    section: 'account',
    label: 'Chinh sua ho so',
    route: '/edit-profile',
    source: 'app/(account)/(profile)/edit-profile.tsx',
  },
  {
    id: 'digital-signature',
    tab: 'more',
    section: 'account',
    label: 'Chu ky so',
    route: '/digital-signature',
    source: 'app/(account)/(profile)/digital-signature.tsx',
  },
  {
    id: 'change-password',
    tab: 'more',
    section: 'account',
    label: 'Doi mat khau',
    route: '/change-password',
    source: 'app/(account)/(profile)/change-password.tsx',
  },
  {
    id: 'link-phone',
    tab: 'more',
    section: 'account',
    label: 'Lien ket so dien thoai',
    route: '/link-phone',
    source: 'app/(account)/(profile)/link-phone.tsx',
  },
];
