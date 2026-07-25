/**
 * RRMS Mobile - Design System Tokens
 * Nguồn duy nhất cho tất cả design tokens trong app.
 * Tuân thủ: CODING_STANDARDS.md
 */

import { Platform } from 'react-native';

// ============================================================
// 1. BRAND COLORS
// ============================================================

/** Màu chủ đạo - Xanh lá RRMS */
const PRIMARY = '#6fceee';
const PRIMARY_DARK = '#4bcffa';
const PRIMARY_LIGHT = '#e8f8ee';

/** Màu phụ */
const SECONDARY = '#2196F3';
const SECONDARY_DARK = '#1976D2';

/** Màu trạng thái */
const SUCCESS = '#4bcffa';
const WARNING = '#FF9800';
const WARNING_LIGHT = '#FFF3E0';
const WARNING_BORDER = '#FFB74D';
const ERROR = '#F44336';
const INFO = '#2196F3';

/** Màu nền & viền */
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const GRAY_50 = '#FAFAFA';
const GRAY_100 = '#F5F5F5';
const GRAY_200 = '#EEEEEE';
const GRAY_300 = '#E0E0E0';
const GRAY_400 = '#BDBDBD';
const GRAY_500 = '#9E9E9E';
const GRAY_600 = '#757575';
const GRAY_700 = '#616161';
const GRAY_800 = '#424242';
const GRAY_900 = '#212121';

// ============================================================
// 2. EXPORTED COLOR PALETTE
// ============================================================

export const Colors = {
  // Brand
  primary: PRIMARY,
  primaryDark: PRIMARY_DARK,
  primaryLight: PRIMARY_LIGHT,
  secondary: SECONDARY,
  secondaryDark: SECONDARY_DARK,

  // Status
  success: SUCCESS,
  warning: WARNING,
  warningLight: WARNING_LIGHT,
  warningBorder: WARNING_BORDER,
  error: ERROR,
  info: INFO,

  // Neutrals
  white: WHITE,
  black: BLACK,
  gray50: GRAY_50,
  gray100: GRAY_100,
  gray200: GRAY_200,
  gray300: GRAY_300,
  gray400: GRAY_400,
  gray500: GRAY_500,
  gray600: GRAY_600,
  gray700: GRAY_700,
  gray800: GRAY_800,
  gray900: GRAY_900,

  // Semantic
  background: WHITE,
  surface: GRAY_50,
  border: GRAY_300,
  borderLight: GRAY_200,
  placeholder: GRAY_400,
  textPrimary: GRAY_900,
  textSecondary: GRAY_600,
  textDisabled: GRAY_400,
  textSuccess: SUCCESS,
  textLink: PRIMARY,
  inputBackground: WHITE,
  inputBorder: GRAY_300,
  inputBorderFocused: PRIMARY,

  // Zalo brand color
  zaloBlue: '#0068FF',

  // Light/Dark mode presets
  light: {
    text: '#11181C',
    background: '#fff',
    tint: PRIMARY,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: PRIMARY,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

// ============================================================
// 3. SPACING (8px Grid System)
// ============================================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// ============================================================
// 4. BORDER RADIUS
// ============================================================

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// ============================================================
// 5. FONT SIZES
// ============================================================

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

// ============================================================
// 6. FONT WEIGHTS
// ============================================================

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

// ============================================================
// 7. SHADOWS
// ============================================================

export const Shadows = {
  sm: Platform.select({
    web: {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    },
    default: {
      shadowColor: BLACK,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
  }),
  md: Platform.select({
    web: {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    default: {
      shadowColor: BLACK,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  }),
  lg: Platform.select({
    web: {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    },
    default: {
      shadowColor: BLACK,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  }),
};

// ============================================================
// 8. FONTS (Platform-specific)
// ============================================================

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'Roboto',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ============================================================
// 9. APP CONSTANTS
// ============================================================

export const AppConstants = {
  APP_NAME: 'RRMS',
  APP_TAGLINE: 'Quản lý NHÀ CHO THUÊ',
  APP_VERSION: '1.0.0',
  COPYRIGHT: 'Copyright @ rrms.vn',
  SUPPORT_PHONE: '1900-xxxx',
  SUPPORT_AVAILABLE: 'Chuyên viên luôn sẵn sàng hỗ trợ 24/7',
} as const;
