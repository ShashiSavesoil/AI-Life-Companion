import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { getDashboardInsights } from '@/services/insights-service';
import { spacing, colors, typography, radius } from '@/theme';

// Safe fallbacks to prevent TypeScript red lines
const safeColors = {
  primary: (colors as any).primary || '#007AFF',
  cardBackground: (colors as any).cardBackground || '#FFFFFF',
  text: (colors as any).text || '#111111',
  textSecondary: (colors as any).textSecondary || '#666666',
  border: (colors as any).border || '#EEEEEE',
};
const safeTypography = {
  h2: (typography as any).h2 || { fontSize: 24, fontWeight: 'bold' },
  label: (typography as any).label || { fontSize: 12, textTransform: 'uppercase' },
  body: (typography as any).body || { fontSize: 16 },
  button: (typography as any).button || { fontSize: 16, fontWeight: 'bold' },
};
const safeSpacing = {
  xs: (spacing as any).xs || 4,
  md: (spacing as any).md || 16,
  lg: (spacing as any).lg || 24,
};
const safeRadius = {
  lg: (radius as any).lg || 16,
};

export default function DashboardScreen() {
  const router = useRouter();
  
  // Default loading state
  const [insights, setInsights] = useState({
    streak: 0,
    weeklySummary: "Analyzing your recent reflections...",
    latestMood: "...",
    totalReflections: 0
  });

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // Dashboard strictly consumes the service (Architectural Requirement)
          const data = await getDashboardInsights();
          setInsights(data);
        } catch (error) {
          console.error('Failed to load insights:', error);
        }
      };
      loadData();
    }, [])
  );

  return (
    <Screen>
      <Header title="Good Morning ☀️" subtitle="Welcome back to your companion." />
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Streak Insight */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Streak</Text>
          <Text style={styles.cardValue}>🔥 {insights.streak} {insights.streak === 1 ? 'Day' : 'Days'}</Text>
        </View>

        {/* Insight of the Week */}
        <View style={[styles.card, { backgroundColor: safeColors.primary + '10' }]}>
          <Text style={[styles.cardTitle, { color: safeColors.primary }]}>Insight of the Week</Text>
          <Text style={[styles.cardValue, { fontSize: 18, fontWeight: '500' }]}>{insights.weeklySummary}</Text>
        </View>

        {/* Latest Mood */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latest Mood</Text>
          <Text style={styles.cardValue}>{insights.latestMood === 'Great' ? '😁' : insights.latestMood === 'Good' ? '🙂' : '😐'} {insights.latestMood}</Text>
        </View>

        {/* Action Button */}
        <Button 
          fullWidth 
          onPress={() => router.push('/reflect')}
        >
          Continue Reflection
        </Button>
        
        {/* NEW: View Goals Button */}
        <TouchableOpacity 
          style={{ marginTop: 16, padding: 16, alignItems: 'center' }} 
          onPress={() => router.push('/goals')}
        >
          <Text style={{ ...safeTypography.button, color: safeColors.primary }}>
            View Growth Goals
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: safeSpacing.md, marginTop: safeSpacing.md, paddingBottom: safeSpacing.lg },
  card: {
    backgroundColor: safeColors.cardBackground,
    padding: safeSpacing.lg,
    borderRadius: safeRadius.lg,
    borderWidth: 1,
    borderColor: safeColors.border,
  },
  cardTitle: { ...safeTypography.label, color: safeColors.textSecondary, marginBottom: safeSpacing.xs },
  cardValue: { ...safeTypography.h2, color: safeColors.text },
});