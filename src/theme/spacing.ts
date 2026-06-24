export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  gutter: 20,
  flow: 56,
} as const;

export type Spacing = typeof spacing;
