import type { TabOwnedScreen } from "../../types";

export { default as MoreNotificationSettingsScreen } from "@/app/(mail-box-page)/notification-settings";
export { default as RepresentativeInfoScreen } from "@/app/(more-page)/settings/representative-info";
export { default as CompanyManagementScreen } from "@/app/(more-page)/settings/company-management";
export { default as DigitalSignatureScreen } from "@/app/(more-page)/settings/digital-signature";
export { default as ChangePasswordScreen } from "@/app/(more-page)/settings/change-password";
export { default as BrandSettingsScreen } from "@/app/(more-page)/settings/brand-settings";
export { default as PermissionsScreen } from "@/app/(more-page)/settings/permissions";
export { default as HelpCenterScreen } from "@/app/(more-page)/settings/help-center";
export { default as LinkPhoneScreen } from "@/app/(more-page)/settings/link-phone";
export { default as AppInfoScreen } from "@/app/(more-page)/settings/app-info";
export { default as PrivacyPolicyScreen } from "@/app/(more-page)/settings/privacy-policy";
export { default as TermsOfUseScreen } from '@/app/(more-page)/settings/terms-of-use';
export { default as ProfileScreen } from '@/app/(more-page)/(profile)/profile';
export { default as EditProfileScreen } from '@/app/(more-page)/(profile)/edit-profile';
export const moreSettingsScreens: TabOwnedScreen[] = [
    {
    id: 'profile',
    tab: 'more',
    section: 'settings',
    label: 'Ho so',
    route: '/profile',
    source: 'app/(more-page)/(profile)/profile.tsx',
  },

  {
    id: 'edit-profile',
    tab: 'more',
    section: 'settings',
    label: 'Chinh sua ho so',
    route: '/edit-profile',
    source: 'app/(more-page)/(profile)/edit-profile.tsx',
  },
  {
    id: "company-management",
    tab: "more",
    section: "settings",
    label: "Cong ty nhom",
    route: "/company-management",
    source: "app/(more-page)/settings/company-management.tsx",
  },
  {
    id: "brand-settings",
    tab: "more",
    section: "settings",
    label: "Cai dat thuong hieu",
    route: "/brand-settings",
    source: "app/(more-page)/settings/brand-settings.tsx",
  },
  {
    id: "representative-info",
    tab: "more",
    section: "settings",
    label: "Thong tin dai dien",
    route: "/representative-info",
    source: "app/(more-page)/settings/representative-info.tsx",
  },
  {
    id: "digital-signature",
    tab: "more",
    section: "settings",
    label: "Chu ky so",
    route: "/digital-signature",
    source: "app/(more-page)/settings/digital-signature.tsx",
  },

  {
    id: "change-password",
    tab: "more",
    section: "settings",
    label: "Doi mat khau",
    route: "/change-password",
    source: "app/(more-page)/settings/change-password.tsx",
  },

  {
    id: "link-phone",
    tab: "more",
    section: "settings",
    label: "Lien ket so dien thoai",
    route: "/link-phone",
    source: "app/(more-page)/settings/link-phone.tsx",
  },
  {
    id: "permissions",
    tab: "more",
    section: "settings",
    label: "Quyen phan mem",
    route: "/permissions",
    source: "app/(more-page)/settings/permissions.tsx",
  },
  {
    id: "help-center",
    tab: "more",
    section: "settings",
    label: "Trung tam tro giup",
    route: "/help-center",
    source: "app/(more-page)/settings/help-center.tsx",
  },
  {
    id: "app-info",
    tab: "more",
    section: "settings",
    label: "Thong tin phan mem",
    route: "/app-info",
    source: "app/(more-page)/settings/app-info.tsx",
  },
  {
    id: "privacy-policy",
    tab: "more",
    section: "settings",
    label: "Chinh sach bao mat",
    route: "/privacy-policy",
    source: "app/(more-page)/settings/privacy-policy.tsx",
  },
  {
    id: 'terms-of-use',
    tab: 'more',
    section: 'settings',
    label: 'Dieu khoan su dung',
    route: '/terms-of-use',
    source: 'app/(more-page)/settings/terms-of-use.tsx',
  },
  {
    id: "notification-settings",
    tab: "more",
    section: "settings",
    label: "Thong bao",
    route: "/notification-settings",
    source: "app/(settings)/(access)/notification-settings.tsx",
    notes: "Shared screen used by more and inbox tab.",
  },
];
