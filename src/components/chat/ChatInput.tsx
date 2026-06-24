import { StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { colors, radius, spacing, typography } from '@/theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type your message..."
        placeholderTextColor={colors.textSecondary}
        multiline
        maxLength={500}
        editable={!disabled}
      />
      <Button
        variant={text.trim() ? 'primary' : 'secondary'}
        size="sm"
        onPress={handleSend}
        disabled={!text.trim() || disabled}
        style={styles.sendButton}
      >
        Send
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    paddingBottom: spacing.xl, // Safe area padding
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.large,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
  },
  sendButton: {
    marginBottom: 2, // Align with the bottom of the single-line input
  },
});