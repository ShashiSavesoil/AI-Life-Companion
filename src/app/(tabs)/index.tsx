import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { Feather } from '@expo/vector-icons';
import { getDashboardInsights } from '@/services/insights-service';
import { getHabits, getTodayDateString } from '@/services/habit-service';
import { Habit } from '@/types/habit';
import { spacing, colors, typography, radius } from '@/theme';

const safeColors = { primary: (colors as any).primary || '#007AFF', cardBackground: (colors as any).cardBackground || '#FFFFFF', text: (colors as any).text || '#111111', textSecondary: (colors as any).textSecondary || '#666666', border: (colors as any).border || '#EEEEEE', success: '#34C759' };
const safeTypography = { h2: (typography as any).h2 || { fontSize: 24, fontWeight: 'bold' }, label: (typography as any).label || { fontSize: 12, textTransform: 'uppercase' }, body: (typography as any).body || { fontSize: 16 }, button: (typography as any).button || { fontSize: 16, fontWeight: 'bold' } };
const safeSpacing = { xs: 4, sm: 8, md: 16, lg: 24 };
const safeRadius = { lg: 16 };

export default function DashboardScreen() {
  const router = useRouter();
  const [insights, setInsights] = useState({ streak: 0, weeklySummary: "Analyzing...", latestMood: "...", totalReflections: 0 });
  const [habits, setHabits] = useState<Habit[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          setInsights(await getDashboardInsights());
          setHabits(await getHabits());
        } catch (error) { console.error('Failed to load data:', error); }
      };
      loadData();
    }, [])
  );

  const todayStr = getTodayDateString();
  const completedHabits = habits.filter(h => h.completionDates.includes(todayStr)).length;

  return (
    <Screen>
      <Header title="Good Morning ☀️" subtitle="Welcome back to your companion." />
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* NEW: Today's Habits Summary */}
        <TouchableOpacity style={[styles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]} onPress={() => router.push('/habits')}>
          <View>
            <Text style={styles.cardTitle}>Today's Habits</Text>
            <Text style={styles.cardValue}>{completedHabits} / {habits.length} Completed</Text>
          </View>
          <Feather name="chevron-right" size={24} color={safeColors.textSecondary} />
        </TouchableOpacity>

        {/* Existing Insights */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Streak</Text>
          <Text style={styles.cardValue}>🔥 {insights.streak} {insights.streak === 1 ? 'Day' : 'Days'}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: safeColors.primary + '10' }]}>
          <Text style={[styles.cardTitle, { color: safeColors.primary }]}>Insight of the Week</Text>
          <Text style={[styles.cardValue, { fontSize: 18, fontWeight: '500' }]}>{insights.weeklySummary}</Text>
        </View>

        <Button fullWidth onPress={() => router.push('/reflect')}>Continue Reflection</Button>
        
        <TouchableOpacity style={styles.textBtn} onPress={() => router.push('/goals')}>
          <Text style={{ ...safeTypography.button, color: safeColors.primary }}>View Growth Goals</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: safeSpacing.md, marginTop: safeSpacing.md, paddingBottom: safeSpacing.lg },
  card: { backgroundColor: safeColors.cardBackground, padding: safeSpacing.lg, borderRadius: safeRadius.lg, borderWidth: 1, borderColor: safeColors.border },
  cardTitle: { ...safeTypography.label, color: safeColors.textSecondary, marginBottom: safeSpacing.xs },
  cardValue: { ...safeTypography.h2, color: safeColors.text },
  textBtn: { marginTop: 8, padding: 16, alignItems: 'center' }
});