import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/card';
import { colors, spacing, typography } from '@/theme';

interface QuestionCardProps {
  title: string;
  question: string;
}

export default function QuestionCard({
  title,
  question,
}: QuestionCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.question}>
        {question}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    marginVertical: spacing.lg,
    gap: spacing.md,
  },

  title: {
    fontSize: typography.fontSize.body,
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },

  question: {
    fontSize: typography.fontSize.title3,
    lineHeight: typography.lineHeight.title3,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
});