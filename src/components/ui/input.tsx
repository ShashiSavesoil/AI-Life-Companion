import { type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
  type TextInputProps,
  type ViewProps,
  View,
} from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  containerStyle?: ViewProps['style'];
  inputStyle?: TextInputProps['style'];
}

export function Input({
  label,
  helperText,
  error,
  leading,
  trailing,
  placeholderTextColor = colors.placeholder,
  containerStyle,
  inputStyle,
  ...textInputProps
}: InputProps) {
  const messageColor = error ? colors.danger : colors.textSecondary;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputContainer, containerStyle]}>
        {leading ? <View style={styles.iconContainer}>{leading}</View> : null}
        <TextInput
          placeholderTextColor={placeholderTextColor}
          style={[styles.input, inputStyle]}
          {...textInputProps}
        />
        {trailing ? <View style={styles.iconContainer}>{trailing}</View> : null}
      </View>
      {helperText || error ? (
        <Text style={[styles.message, { color: messageColor }]}>{error ?? helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.label,
    lineHeight: typography.lineHeight.label,
    fontFamily: typography.fontFamily.body,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.elevated,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.fontFamily.body,
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  message: {
    fontSize: typography.fontSize.caption,
    lineHeight: typography.lineHeight.caption,
    fontFamily: typography.fontFamily.body,
  },
});