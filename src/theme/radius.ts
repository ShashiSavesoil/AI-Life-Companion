export const radius = {
  small: 8,
  medium: 16,
  large: 24,
  pill: 999,
} as const;

export type Radius = typeof radius;
