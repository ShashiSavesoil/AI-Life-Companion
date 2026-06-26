import { StyleSheet, View, Text } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { getReflections } from '@/services/reflection-storage';
import { spacing, colors, typography, radius } from '@/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const [latestMood, setLatestMood] = useState<string>('None recorded');

  // This block fetches your latest mood using the new Version 0.1 architecture
  useFocusEffect(
    useCallback(() => {
      const loadDashboardData = async () => {
        try {
          const data = await getReflections();
          if (data && data.length > 0) {
            const latest = data.sort((a, b) => b.createdAt - a.createdAt)[0];
            const moodResponse = latest.responses?.find(r => r.dimension === 'emotional_wellbeing');
            const displayMood = moodResponse?.answer || latest.mood || 'None recorded';
            setLatestMood(displayMood);
          }
        } catch (error) {
          console.error('Failed to load dashboard:', error);
        }
      };
      loadDashboardData();
    }, [])
  );

  return (
    <Screen>
      <Header title="Home" subtitle="Welcome to your AI Companion" />
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latest Mood</Text>
          <Text style={styles.cardValue}>{latestMood}</Text>
        </View>

        {/* HERE IS THE FIXED ROUTING */}
        <Button 
          fullWidth 
          onPress={() => router.push('/reflect')}
        >
          Start Reflection
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, marginTop: spacing.md },
  card: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  cardValue: { ...typography.h2, color: colors.text },
});