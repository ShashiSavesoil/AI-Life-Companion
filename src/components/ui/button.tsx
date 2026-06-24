import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const variantStyles = {
  primary: {
    backgroundColor: colors.accent,
    textColor: colors.white,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surface,
    textColor: colors.textPrimary,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    textColor: colors.accent,
    borderColor: 'transparent',
  },
} as const;

const sizeStyles = {
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSize.label,
  },
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    fontSize: typography.fontSize.body,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
    fontSize: typography.fontSize.bodyLarge,
  },
} as const;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  style,
  accessibilityLabel,
  ...pressableProps
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: variantStyle.backgroundColor, borderColor: variantStyle.borderColor },
        fullWidth && styles.fullWidth,
        size === 'sm' && styles.small,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      <View style={styles.labelContainer}>
        {iconLeft ? <View style={styles.iconLeft}>{iconLeft}</View> : null}
        <Text
          style={[
            styles.label,
            { color: variantStyle.textColor, fontSize: sizeStyle.fontSize },
          ]}
        >
          {children}
        </Text>
        {iconRight ? <View style={styles.iconRight}>{iconRight}</View> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.medium,
    borderWidth: 1,
    minHeight: 48,
    gap: spacing.sm,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  small: {
    minHeight: 40,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    marginLeft: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.body,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.body,
  },
});