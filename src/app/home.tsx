import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { getReflections } from '@/services/reflection-storage';
import { ReflectionEntry } from '@/types/reflection';
import { colors, radius, spacing, typography } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchReflections = async () => {
        try {
          const data = await getReflections();
          if (isActive) {
            setReflections(data);
          }
        } catch (error) {
          console.error('Failed to load reflections:', error);
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      fetchReflections();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const latestReflection = reflections[0];
  const hasCompletedToday = latestReflection ? isToday(latestReflection.date) : false;
  const latestMood = latestReflection?.mood;

  // Render helpers
  const renderQuickAction = (title: string, route?: string, isPlaceholder?: boolean) => (
    <Card 
      style={[styles.quickActionCard, isPlaceholder && styles.quickActionPlaceholder]} 
      padding={spacing.md}
      elevated={false}
    >
      <Text style={[styles.quickActionTitle, isPlaceholder && styles.textMuted]}>
        {title}
      </Text>
      {isPlaceholder && <Text style={styles.comingSoon}>Coming Soon</Text>}
      {!isPlaceholder && route && (
        <Button 
          variant="ghost" 
          size="sm" 
          onPress={() => router.push(route as any)}
          style={styles.quickActionBtn}
        >
          Open
        </Button>
      )}
    </Card>
  );

  return (
    <Screen contentStyle={{ paddingHorizontal: 0, paddingTop: 0 }}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title={getGreeting()}
          subtitle="Welcome to your AI Life Companion."
          style={styles.header}
        />

        {/* Reflection Status Card */}
        <Card style={styles.primaryCard}>
          <Text style={styles.cardTitle}>Daily Reflection</Text>
          <Text style={styles.cardBody}>
            {hasCompletedToday 
              ? "You've already reflected today. Great job building the habit!"
              : "Take a few calm minutes for yourself to capture today."}
          </Text>
          <Button 
            onPress={() => router.push('/reflection')}
            variant={hasCompletedToday ? 'secondary' : 'primary'}
            fullWidth
          >
            {hasCompletedToday ? 'Review Reflection' : 'Start Reflection'}
          </Button>
        </Card>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard} elevated={false}>
            <Text style={styles.statLabel}>Latest Mood</Text>
            <Text style={styles.statValue}>{latestMood || '—'}</Text>
          </Card>
          <Card style={styles.statCard} elevated={false}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>0 days</Text>
          </Card>
        </View>

        {/* Recent Journal Entry */}
        {latestReflection && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Entry</Text>
            <Card elevated={false} style={styles.recentCard}>
              <Text style={styles.recentDate}>
                {new Date(latestReflection.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
              <Text style={styles.recentPreview} numberOfLines={2}>
                {latestReflection.meaningfulMoment || latestReflection.gratitude || "No text entry provided."}
              </Text>
              <Button 
                variant="ghost" 
                size="sm" 
                onPress={() => router.push('/journal')}
                style={styles.recentBtn}
              >
                View Journal
              </Button>
            </Card>
          </View>
        )}

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {renderQuickAction('Journal', '/journal', false)}
            {renderQuickAction('AI Chat', undefined, true)}
            {renderQuickAction('Goals', undefined, true)}
            {renderQuickAction('Habits', undefined, true)}
          </View>
        </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  header: {
    marginBottom: 0, 
  },
  primaryCard: {
    gap: spacing.md,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    fontSize: typography.fontSize.title3,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  cardBody: {
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  statLabel: {
    fontSize: typography.fontSize.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.title2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.title3,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  recentCard: {
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  recentDate: {
    fontSize: typography.fontSize.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentPreview: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.body,
    fontStyle: 'italic',
  },
  recentBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: 0,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickActionCard: {
    width: '47%', 
    minHeight: 100,
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  quickActionPlaceholder: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
  },
  quickActionTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  textMuted: {
    color: colors.textSecondary,
  },
  comingSoon: {
    fontSize: typography.fontSize.label,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  quickActionBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    marginTop: spacing.sm,
  },
});