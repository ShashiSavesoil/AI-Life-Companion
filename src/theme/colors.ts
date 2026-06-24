export const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  slate: '#111827',
  graphite: '#3B4758',
  mist: '#F5F6F8',
  pearl: '#E7E9EE',
  smoke: '#D4DAE4',
  sky: '#0A84FF',
  skyDark: '#0059D6',
  success: '#34C759',
  warning: '#FFD60A',
  danger: '#FF453A',
  overlay: 'rgba(15, 23, 42, 0.32)',
} as const;

export const lightColors = {
  background: baseColors.white,
  surface: baseColors.mist,
  elevated: baseColors.white,
  border: baseColors.smoke,
  textPrimary: '#131A28',
  textSecondary: '#5A6579',
  textTertiary: '#8F98A8',
  placeholder: '#B0B8C8',
  accent: baseColors.sky,
  accentStrong: baseColors.skyDark,
  success: baseColors.success,
  warning: baseColors.warning,
  danger: baseColors.danger,
  muted: baseColors.pearl,
  overlay: baseColors.overlay,
  shadow: '#000000',
  white: baseColors.white,
  black: baseColors.black,
} as const;

export const darkColors = {
  background: '#090B0F',
  surface: '#11161F',
  elevated: '#161B26',
  border: '#2D3340',
  textPrimary: '#F7F7F8',
  textSecondary: '#B1B9C6',
  textTertiary: '#8C95A4',
  placeholder: '#6D7483',
  accent: '#4EA1FF',
  accentStrong: '#7FBCFF',
  success: '#30D158',
  warning: '#FFD86F',
  danger: '#FF6B6B',
  muted: '#1B202A',
  overlay: 'rgba(0, 0, 0, 0.48)',
  shadow: '#000000',
  white: baseColors.white,
  black: baseColors.black,
} as const;

export const themeColors = {
  light: lightColors,
  dark: darkColors,
} as const;

export type ThemeColors = typeof lightColors;
export type ThemeMode = keyof typeof themeColors;
