import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '@/components/ui/screen';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Safe colors to guarantee a successful build
const safeColors = { primary: '#007AFF', background: '#F9F9F9', card: '#FFFFFF', text: '#111111', textSecondary: '#666666', border: '#EEEEEE' };

export default function JournalScreen() {
  const insets = useSafeAreaInsets();

  // Pitch-perfect mock data to show investors a fully populated timeline!
  const TIMELINE_DATA = [
    {
      id: 1,
      date: 'TODAY',
      type: 'DEEP REFLECTION',
      title: 'Deep Reflection',
      subtitle: 'Explored long-term career goals and core values in the AI Canvas.',
      icon: 'layers',
      color: safeColors.textSecondary
    },
    {
      id: 2,
      date: 'TODAY',
      type: 'CHECK-IN',
      title: 'Quick Check-in',
      subtitle: 'Felt focused and energized.',
      icon: 'clock',
      color: safeColors.primary
    },
    {
      id: 3,
      date: 'YESTERDAY',
      type: 'GUIDED REFLECTION',
      title: 'Guided Reflection',
      subtitle: 'Completed the 13-question cognitive processing flow.',
      icon: 'compass',
      color: safeColors.primary
    },
    {
      id: 4,
      date: 'YESTERDAY',
      type: 'GOAL',
      title: 'New Goal Set',
      subtitle: 'Gym and Fitness Tracking',
      icon: 'target',
      color: '#34C759'
    },
    {
      id: 5,
      date: 'YESTERDAY',
      type: 'ACHIEVEMENT',
      title: 'New Habit Started',
      subtitle: 'Drink 2L of water',
      icon: 'refresh-cw',
      color: '#FF9500'
    }
  ];

  return (
    <Screen contentStyle={{ paddingTop: insets.top + 16, backgroundColor: safeColors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timeline</Text>
        <Text style={styles.headerSubtitle}>Your personal journey and growth over time.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {TIMELINE_DATA.map((item, index) => (
          <View key={item.id} style={styles.timelineItem}>
            {/* Vertical Line Connection */}
            {index !== TIMELINE_DATA.length - 1 && <View style={styles.verticalLine} />}
            
            <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => {}}>
              <View style={styles.cardHeader}>
                <View style={styles.leftHeader}>
                  <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                    <Feather name={item.icon as any} size={16} color={item.color} />
                  </View>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <Text style={[styles.typeText, { color: safeColors.primary }]}>{item.type}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: safeColors.text, marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: safeColors.textSecondary, lineHeight: 24 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  timelineItem: { position: 'relative', paddingBottom: 24 },
  verticalLine: { position: 'absolute', left: 36, top: 60, bottom: 0, width: 2, backgroundColor: safeColors.border, zIndex: -1 },
  card: { backgroundColor: safeColors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: safeColors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  leftHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  dateText: { fontSize: 12, fontWeight: '600', color: safeColors.textSecondary, letterSpacing: 0.5 },
  typeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: safeColors.text, marginBottom: 6 },
  cardSubtitle: { fontSize: 15, color: safeColors.textSecondary, lineHeight: 22 },
});