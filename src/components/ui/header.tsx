import { type ReactNode } from 'react';
import { AccessibilityRole, StyleSheet, Text, type ViewStyle, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  centered?: boolean;
  style?: ViewStyle;
}

export function Header({ title, subtitle, leading, trailing, centered = false, style }: HeaderProps) {
  return (
    <View style={[styles.header, centered && styles.centered, style]} accessibilityRole="header">
      <View style={styles.topRow}>
        <View style={styles.region}>{leading}</View>
        <View style={[styles.titleContainer, centered && styles.titleContainerCentered]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.region}>{trailing}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: 'transparent',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  region: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  titleContainerCentered: {
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.title3,
    lineHeight: typography.lineHeight.title3,
    fontWeight: typography.fontWeight.semibold,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
  centered: {
    alignItems: 'center',
  },
});