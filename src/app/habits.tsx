import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { getHabits, createHabit, toggleHabitToday, getTodayDateString } from '@/services/habit-service';
import { Habit } from '@/types/habit';
import { colors, spacing, typography, radius } from '@/theme';

// Safe fallbacks
const safeColors = { primary: (colors as any).primary || '#007AFF', cardBackground: (colors as any).cardBackground || '#FFFFFF', text: (colors as any).text || '#111111', textSecondary: (colors as any).textSecondary || '#666666', border: (colors as any).border || '#EEEEEE', success: '#34C759', background: '#F9F9F9' };
const safeTypography = { h2: (typography as any).h2 || { fontSize: 24, fontWeight: 'bold' }, h3: (typography as any).h3 || { fontSize: 18, fontWeight: '600' }, body: (typography as any).body || { fontSize: 16 }, label: (typography as any).label || { fontSize: 12, textTransform: 'uppercase' }, button: (typography as any).button || { fontSize: 16, fontWeight: 'bold' } };

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');

  const loadHabits = async () => setHabits(await getHabits());
  useFocusEffect(useCallback(() => { loadHabits(); }, []));

  const handleCreate = async () => {
    if (!newHabitTitle.trim()) return;
    await createHabit(newHabitTitle.trim(), 'daily');
    setNewHabitTitle('');
    setIsCreating(false);
    await loadHabits();
  };

  const handleToggle = async (id: string) => {
    await toggleHabitToday(id);
    await loadHabits();
  };

  const todayStr = getTodayDateString();

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Header title="Daily Habits" subtitle="Small actions, big changes." />
        {!isCreating && (
          <TouchableOpacity style={styles.addButton} onPress={() => setIsCreating(true)}>
            <Feather name="plus" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isCreating && (
          <View style={styles.createCard}>
            <Text style={styles.cardTitle}>New Daily Habit</Text>
            <TextInput style={styles.input} placeholder="E.g., Drink water, Read 10 pages" value={newHabitTitle} onChangeText={setNewHabitTitle} autoFocus />
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => setIsCreating(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} style={styles.saveBtn}><Text style={styles.saveText}>Start Habit</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {habits.map(habit => {
          const isCompletedToday = habit.completionDates.includes(todayStr);
          return (
            <TouchableOpacity key={habit.id} style={[styles.habitCard, isCompletedToday && styles.habitCardCompleted]} onPress={() => handleToggle(habit.id)} activeOpacity={0.7}>
              <View style={styles.habitInfo}>
                <Text style={[styles.cardTitle, isCompletedToday && styles.textCompleted]}>{habit.title}</Text>
                <Text style={styles.streakText}>🔥 {habit.currentStreak} Day Streak (Best: {habit.longestStreak})</Text>
              </View>
              <View style={[styles.checkbox, isCompletedToday && styles.checkboxCompleted]}>
                {isCompletedToday && <Feather name="check" size={16} color="#FFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  addButton: { backgroundColor: safeColors.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  content: { paddingBottom: 48, paddingTop: 16, gap: 12 },
  createCard: { backgroundColor: safeColors.cardBackground, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: safeColors.primary, marginBottom: 16 },
  input: { backgroundColor: safeColors.background, borderWidth: 1, borderColor: safeColors.border, padding: 12, borderRadius: 8, ...safeTypography.body, marginTop: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
  cancelBtn: { padding: 12 }, cancelText: { ...safeTypography.body, color: safeColors.textSecondary },
  saveBtn: { backgroundColor: safeColors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 }, saveText: { ...safeTypography.button, color: '#FFF' },
  habitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: safeColors.cardBackground, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: safeColors.border },
  habitCardCompleted: { backgroundColor: safeColors.primary + '10', borderColor: safeColors.primary },
  habitInfo: { flex: 1 },
  cardTitle: { ...safeTypography.h3, color: safeColors.text, marginBottom: 4 },
  textCompleted: { color: safeColors.primary, textDecorationLine: 'line-through' },
  streakText: { ...safeTypography.label, color: safeColors.textSecondary },
  checkbox: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: safeColors.border, justifyContent: 'center', alignItems: 'center' },
  checkboxCompleted: { backgroundColor: safeColors.primary, borderColor: safeColors.primary },
});