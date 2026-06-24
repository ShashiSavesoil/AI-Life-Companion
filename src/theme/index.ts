export * from './colors';
export * from './spacing';
export * from './typography';
export * from './radius';
export * from './shadows';

import { lightColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radius } from './radius';
import { shadows } from './shadows';

export const colors = lightColors;

export const defaultTheme = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
};

export type Theme = typeof defaultTheme;
