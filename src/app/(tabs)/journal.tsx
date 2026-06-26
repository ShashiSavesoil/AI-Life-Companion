import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { getReflections } from '@/services/reflection-storage';
import { ReflectionEntry } from '@/types/reflection';
import { spacing, colors, typography, radius } from '@/theme';

// Helper to translate backend psychological dimensions into human-friendly UI labels
const formatDimension = (dimension: string) => {
  const map: Record<string, string> = {
    emotional_wellbeing: '🙂 Emotion',
    energy: '⚡ Energy',
    stress: '⚖️ Stress',
    meaning: '✨ Meaning',
    gratitude: '🙏 Gratitude',
    relationships: '🤝 Relationships',
    growth: '🌱 Intention',
  };
  return map[dimension] || dimension.replace('_', ' ');
};

export default function JournalScreen() {
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      getReflections().then((data) => {
        // Sort newest first
        setEntries(data.sort((a, b) => b.createdAt - a.createdAt));
      });
    }, [])
  );

  return (
    <Screen>
      <Header title="Journal" subtitle="Your personal reflection history" />
      <ScrollView contentContainerStyle={styles.list}>
        {entries.map((entry) => (
          <View key={entry.id} style={styles.card}>
            <Text style={styles.date}>
              {new Date(entry.createdAt).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            
            {/* VERSION 0.1 NEW ARCHITECTURE: Dynamic array rendering */}
            {entry.responses && entry.responses.length > 0 ? (
              entry.responses.map((res) => (
                <View key={res.questionId} style={styles.responseBlock}>
                  <Text style={styles.dimensionLabel}>{formatDimension(res.dimension)}</Text>
                  <Text style={styles.answerText}>{res.answer}</Text>
                </View>
              ))
            ) : (
              /* LEGACY FALLBACK: For reflections created before the migration */
              <View>
                {entry.mood && (
                  <View style={styles.responseBlock}>
                    <Text style={styles.dimensionLabel}>🙂 Mood</Text>
                    <Text style={styles.answerText}>{entry.mood}</Text>
                  </View>
                )}
                {entry.meaningfulMoment && (
                  <View style={styles.responseBlock}>
                    <Text style={styles.dimensionLabel}>✨ Meaningful Moment</Text>
                    <Text style={styles.answerText}>{entry.meaningfulMoment}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  date: { ...typography.subtitle, color: colors.primary, marginBottom: spacing.md },
  responseBlock: { marginBottom: spacing.sm },
  dimensionLabel: { ...typography.label, color: colors.textSecondary, marginBottom: 2 },
  answerText: { ...typography.body, color: colors.text },
});