import { StyleSheet, TextInput } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

interface ReflectionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function ReflectionInput({
  value,
  onChangeText,
  placeholder,
}: ReflectionInputProps) {
  return (
    <TextInput
      style={styles.input}
      multiline
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      textAlignVertical="top"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.medium,
    padding: spacing.lg,
    fontSize: typography.fontSize.bodyLarge,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
});