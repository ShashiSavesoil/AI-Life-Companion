import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { getGoals, createGoal, addGoalProgress } from '@/services/goal-service';
import { Goal } from '@/types/goal';
import { colors, spacing, typography, radius } from '@/theme';

// Safe fallbacks to prevent TS errors
const safeColors = {
  primary: (colors as any).primary || '#007AFF',
  cardBackground: (colors as any).cardBackground || '#FFFFFF',
  text: (colors as any).text || '#111111',
  textSecondary: (colors as any).textSecondary || '#666666',
  border: (colors as any).border || '#EEEEEE',
  success: '#34C759',
  background: '#F9F9F9',
};
const safeTypography = {
  h2: (typography as any).h2 || { fontSize: 24, fontWeight: 'bold' },
  h3: (typography as any).h3 || { fontSize: 18, fontWeight: '600' },
  body: (typography as any).body || { fontSize: 16 },
  label: (typography as any).label || { fontSize: 12, textTransform: 'uppercase' },
  button: (typography as any).button || { fontSize: 16, fontWeight: 'bold' },
};

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const loadGoals = async () => {
    const data = await getGoals();
    // Sort active first, then by creation date
    data.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return b.createdAt - a.createdAt;
    });
    setGoals(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const handleCreateGoal = async () => {
    if (!newGoalTitle.trim()) return;
    await createGoal(newGoalTitle.trim(), 'habit', 5, 'growth'); // Defaulting to 5-step habit for V1 UI
    setNewGoalTitle('');
    setIsCreating(false);
    await loadGoals();
  };

  const handleProgress = async (id: string) => {
    await addGoalProgress(id, 1);
    await loadGoals();
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Header title="Growth Goals" subtitle="Turn reflections into action." />
        {!isCreating && (
          <TouchableOpacity style={styles.addButton} onPress={() => setIsCreating(true)}>
            <Feather name="plus" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Goal Creation Flow */}
        {isCreating && (
          <View style={styles.createCard}>
            <Text style={styles.cardTitle}>New Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., Meditate for 10 minutes"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              autoFocus
            />
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => setIsCreating(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateGoal} style={styles.saveBtn}>
                <Text style={styles.saveText}>Set Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Active Goals */}
        <Text style={styles.sectionLabel}>Active Goals ({activeGoals.length})</Text>
        {activeGoals.map(goal => {
          const progress = goal.targetCount ? (goal.currentCount / goal.targetCount) * 100 : 0;
          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.cardTitle}>{goal.title}</Text>
                <TouchableOpacity style={styles.progressBtn} onPress={() => handleProgress(goal.id)}>
                  <Feather name="check" size={16} color={safeColors.primary} />
                </TouchableOpacity>
              </View>
              {goal.targetCount && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{goal.currentCount} / {goal.targetCount}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Conquered</Text>
            {completedGoals.map(goal => (
              <View key={goal.id} style={[styles.goalCard, { opacity: 0.6 }]}>
                <View style={styles.goalHeader}>
                  <Text style={[styles.cardTitle, { textDecorationLine: 'line-through' }]}>{goal.title}</Text>
                  <Feather name="award" size={20} color={safeColors.success} />
                </View>
              </View>
            ))}
          </>
        )}

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  addButton: { backgroundColor: safeColors.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  content: { paddingBottom: 48, paddingTop: 16, gap: 12 },
  sectionLabel: { ...safeTypography.label, color: safeColors.textSecondary, marginTop: 8 },
  
  createCard: { backgroundColor: safeColors.cardBackground, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: safeColors.primary, marginBottom: 16 },
  input: { backgroundColor: safeColors.background, borderWidth: 1, borderColor: safeColors.border, padding: 12, borderRadius: 8, ...safeTypography.body, marginTop: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
  cancelBtn: { padding: 12 },
  cancelText: { ...safeTypography.body, color: safeColors.textSecondary },
  saveBtn: { backgroundColor: safeColors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  saveText: { ...safeTypography.button, color: '#FFF' },

  goalCard: { backgroundColor: safeColors.cardBackground, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: safeColors.border },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { ...safeTypography.h3, color: safeColors.text, flex: 1 },
  progressBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: safeColors.primary + '15', justifyContent: 'center', alignItems: 'center' },
  progressContainer: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressTrack: { flex: 1, height: 6, backgroundColor: safeColors.border, borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: safeColors.primary },
  progressText: { ...safeTypography.label, color: safeColors.textSecondary },
});