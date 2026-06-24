import { type ReactNode } from 'react';
import { StyleSheet, type ViewProps, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

export interface CardProps extends ViewProps {
  children: ReactNode;
  elevated?: boolean;
  borderless?: boolean;
  padding?: number;
}

export function Card({ children, elevated = true, borderless = false, padding, style, ...viewProps }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        borderless && styles.borderless,
        { padding: padding ?? spacing.lg },
        style,
      ]}
      {...viewProps}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  elevated: {
    ...shadows.low,
  },
  borderless: {
    borderWidth: 0,
  },
});