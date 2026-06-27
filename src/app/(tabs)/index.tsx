import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { getDashboardInsights } from '@/services/insights-service';
import { getHabits, getTodayDateString } from '@/services/habit-service';
import { Habit } from '@/types/habit';
import { colors, spacing, typography, radius } from '@/theme';

const safeColors = { primary: (colors as any).primary || '#007AFF', cardBackground: (colors as any).cardBackground || '#FFFFFF', text: (colors as any).text || '#111111', textSecondary: (colors as any).textSecondary || '#666666', border: (colors as any).border || '#EEEEEE', background: '#F9F9F9' };
const safeTypography = { h1: { fontSize: 28, fontWeight: 'bold' as const }, h2: { fontSize: 24, fontWeight: 'bold' as const }, h3: { fontSize: 18, fontWeight: '600' as const }, body: { fontSize: 16 }, label: { fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: 0.5 }, button: { fontSize: 16, fontWeight: 'bold' as const } };

export default function DashboardScreen() {
  const router = useRouter();
  const [insights, setInsights] = useState({ streak: 0, weeklySummary: "Analyzing your journey...", latestMood: "...", totalReflections: 0 });
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
  const moodEmoji = insights.latestMood === 'Great' ? '😁' : insights.latestMood === 'Good' ? '🙂' : insights.latestMood === 'Okay' ? '😐' : '☁️';

  return (
    <Screen>
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Good Morning</Text>
        <Text style={styles.subGreeting}>Here is your daily overview.</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Primary Action Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: safeColors.primary }]}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Time to Reflect</Text>
            <Text style={styles.heroSubtitle}>Take 2 minutes to center yourself and check your vital signs.</Text>
          </View>
          <TouchableOpacity style={styles.heroButton} onPress={() => router.push('/reflect')} activeOpacity={0.8}>
            <Text style={[styles.heroButtonText, { color: safeColors.primary }]}>Start Session</Text>
          </TouchableOpacity>
        </View>

        {/* Top Metric Row */}
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.cardLabel}>Current Streak</Text>
            <View style={styles.metricValueRow}>
              <Feather name="zap" size={20} color="#FF9500" />
              <Text style={styles.cardValue}>{insights.streak} Days</Text>
            </View>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.cardLabel}>Latest Mood</Text>
            <View style={styles.metricValueRow}>
              <Text style={{ fontSize: 20 }}>{moodEmoji}</Text>
              <Text style={styles.cardValue}>{insights.latestMood}</Text>
            </View>
          </View>
        </View>

        {/* Insight of the Week */}
        <View style={[styles.standardCard, { backgroundColor: safeColors.primary + '10', borderColor: 'transparent' }]}>
          <View style={styles.insightHeader}>
            <Feather name="bar-chart-2" size={16} color={safeColors.primary} />
            <Text style={[styles.cardLabel, { color: safeColors.primary, marginBottom: 0 }]}>Weekly Insight</Text>
          </View>
          <Text style={[styles.insightText, { color: safeColors.text }]}>{insights.weeklySummary}</Text>
        </View>

        {/* Actionable Trackers */}
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/habits')} activeOpacity={0.7}>
          <View style={styles.actionCardLeft}>
            <View style={[styles.iconWrapper, { backgroundColor: '#34C75915' }]}>
              <Feather name="check-circle" size={20} color="#34C759" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Today's Habits</Text>
              <Text style={styles.actionSubtitle}>{completedHabits} of {habits.length} completed</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={safeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/goals')} activeOpacity={0.7}>
          <View style={styles.actionCardLeft}>
            <View style={[styles.iconWrapper, { backgroundColor: safeColors.primary + '15' }]}>
              <Feather name="target" size={20} color={safeColors.primary} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Growth Goals</Text>
              <Text style={styles.actionSubtitle}>Track your active milestones</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={safeColors.textSecondary} />
        </TouchableOpacity>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: { paddingBottom: 16, paddingTop: 8 },
  greeting: { ...safeTypography.h1, color: safeColors.text, marginBottom: 4 },
  subGreeting: { ...safeTypography.body, color: safeColors.textSecondary },
  content: { gap: 16, paddingBottom: 40 },
  
  heroCard: { borderRadius: 20, padding: 24, gap: 16, shadowColor: safeColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  heroTextContainer: { gap: 6 },
  heroTitle: { ...safeTypography.h2, color: '#FFFFFF' },
  heroSubtitle: { ...safeTypography.body, color: '#FFFFFF', opacity: 0.9 },
  heroButton: { backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  heroButtonText: { ...safeTypography.button },

  metricRow: { flexDirection: 'row', gap: 16 },
  metricCard: { flex: 1, backgroundColor: safeColors.cardBackground, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: safeColors.border },
  metricValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  
  standardCard: { backgroundColor: safeColors.cardBackground, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: safeColors.border },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  insightText: { ...safeTypography.h3, fontWeight: '500', lineHeight: 24 },
  
  cardLabel: { ...safeTypography.label, color: safeColors.textSecondary, marginBottom: 4 },
  cardValue: { ...safeTypography.h3, color: safeColors.text },

  actionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: safeColors.cardBackground, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: safeColors.border },
  actionCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconWrapper: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionTitle: { ...safeTypography.h3, color: safeColors.text, marginBottom: 2 },
  actionSubtitle: { ...safeTypography.body, color: safeColors.textSecondary, fontSize: 14 },
});