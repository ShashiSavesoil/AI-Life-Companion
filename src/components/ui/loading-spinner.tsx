import { ActivityIndicator, StyleSheet, Text, type ViewProps, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

export interface LoadingSpinnerProps extends ViewProps {
  label?: string;
  size?: 'small' | 'large';
}

export function LoadingSpinner({ label, size = 'large', style, ...viewProps }: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, style]} accessibilityRole="progressbar" {...viewProps}>
      <ActivityIndicator size={size} color={colors.accent} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  label: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
});