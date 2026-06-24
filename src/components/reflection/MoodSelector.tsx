import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { colors, radius, spacing, typography } from '@/theme';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😣', label: 'Stressed' },
];

interface MoodSelectorProps {
  onSelect?: (mood: string) => void;
}

export default function MoodSelector({
  onSelect,
}: MoodSelectorProps) {
  const [selected, setSelected] = useState<string>();

  return (
    <View style={styles.container}>
      {MOODS.map((mood) => {
        const active = selected === mood.label;

        return (
          <Pressable
            key={mood.label}
            onPress={() => {
              setSelected(mood.label);
              onSelect?.(mood.label);
            }}
            style={[
              styles.card,
              active && styles.activeCard,
            ]}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>

            <Text
              style={[
                styles.label,
                active && styles.activeLabel,
              ]}
            >
              {mood.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
  },

  card: {
    width: 60,
    paddingVertical: spacing.md,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },

  activeCard: {
    borderColor: colors.accent,
    backgroundColor: '#E8F1FF',
  },

  emoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },

  label: {
    fontSize: typography.fontSize.label,
    color: colors.textSecondary,
  },

  activeLabel: {
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
  },
});