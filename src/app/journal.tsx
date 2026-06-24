import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

import { Header } from '@/components/ui/header';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';

import { getReflections } from '@/services/reflection-storage';
import { ReflectionEntry } from '@/types/reflection';

import { colors, spacing, typography } from '@/theme';

export default function JournalScreen() {
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    const data = await getReflections();
    setEntries(data);
  }

  return (
    <Screen>
      <Header
        title="Journal"
        subtitle="Your personal reflection history"
      />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No reflections yet.
            </Text>

            <Text style={styles.emptySubtext}>
              Complete your first reflection to begin your journey.
            </Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleDateString()}
            </Text>

            <Text style={styles.section}>
              😊 Mood
            </Text>

            <Text>{item.mood}</Text>

            <Text style={styles.section}>
              🌟 Meaningful Moment
            </Text>

            <Text>{item.meaningfulMoment}</Text>

            <Text style={styles.section}>
              💪 Challenge
            </Text>

            <Text>{item.challenge}</Text>

            <Text style={styles.section}>
              🙏 Gratitude
            </Text>

            <Text>{item.gratitude}</Text>

            <Text style={styles.section}>
              🎯 Tomorrow
            </Text>

            <Text>{item.tomorrowGoal}</Text>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },

  emptyCard: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: typography.fontSize.title3,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },

  emptySubtext: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  date: {
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
    color: colors.accent,
  },

  section: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});