export const typography = {
  fontFamily: {
    body: 'System',
    heading: 'System',
    mono: 'Menlo',
  },
  fontWeight: {
    regular: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
  },
  fontSize: {
    caption: 12,
    label: 13,
    body: 16,
    bodyLarge: 18,
    title3: 20,
    title2: 24,
    title1: 28,
    display: 34,
  },
  lineHeight: {
    caption: 16,
    label: 18,
    body: 24,
    bodyLarge: 26,
    title3: 28,
    title2: 32,
    title1: 36,
    display: 42,
  },
  letterSpacing: {
    normal: 0,
    tight: -0.2,
    relaxed: 0.2,
  },
} as const;

export type Typography = typeof typography;
