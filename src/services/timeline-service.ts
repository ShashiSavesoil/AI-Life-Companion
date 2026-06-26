import { getReflections } from './reflection-storage';
import { calculateReflectionStreak } from './insights-service';
import { getGoals } from './goal-service';
import { getHabits, getTodayDateString } from './habit-service';
import { TimelineEvent } from '@/types/timeline';

export const getTimelineEvents = async (): Promise<TimelineEvent[]> => {
  const reflections = await getReflections();
  const goals = await getGoals();
  const habits = await getHabits();
  const events: TimelineEvent[] = [];
  const now = Date.now();

  // 1. Reflection Events
  reflections.forEach(r => {
    const intention = r.responses?.find(res => res.dimension === 'growth' && res.questionId.includes('tomorrow'))?.answer;
    const mood = r.responses?.find(res => res.dimension === 'emotional_wellbeing')?.answer || r.mood;
    events.push({
      id: `ref_${r.id}`, type: 'reflection', title: 'Guided Reflection',
      subtitle: intention ? `Intention: "${intention}"` : `Felt ${mood?.toLowerCase() || 'reflective'}`,
      createdAt: r.createdAt, icon: 'edit-2', metadata: { reflectionId: r.id }
    });
  });

  // 2. Goal Events
  goals.forEach(g => {
    events.push({ id: `goal_created_${g.id}`, type: 'goal', title: 'New Goal Set', subtitle: g.title, createdAt: g.createdAt, icon: 'target' });
    if (g.status === 'completed' && g.completedAt) {
      events.push({ id: `goal_completed_${g.id}`, type: 'achievement', title: 'Goal Conquered! 🏆', subtitle: `You completed: ${g.title}`, createdAt: g.completedAt, icon: 'award' });
    }
  });

  // 3. Habit Events
  const todayStr = getTodayDateString();
  habits.forEach(h => {
    events.push({ id: `habit_created_${h.id}`, type: 'achievement', title: 'New Habit Started', subtitle: h.title, createdAt: h.createdAt, icon: 'repeat' });
    
    // Add an event if completed today
    if (h.completionDates.includes(todayStr)) {
      events.push({ id: `habit_completed_${h.id}_${todayStr}`, type: 'streak', title: 'Habit Completed', subtitle: h.title, createdAt: now, icon: 'check-circle' });
    }

    // Milestone logic
    if (h.longestStreak >= 7) events.push({ id: `habit_streak_7_${h.id}`, type: 'streak', title: '7-Day Habit Streak! 🔥', subtitle: h.title, createdAt: h.createdAt + 1000, icon: 'zap' });
    if (h.longestStreak >= 30) events.push({ id: `habit_streak_30_${h.id}`, type: 'streak', title: '30-Day Habit Mastery! 🌟', subtitle: h.title, createdAt: h.createdAt + 2000, icon: 'star' });
  });

  // 4. Reflection Streaks
  if (reflections.length > 0) {
    const currentStreak = calculateReflectionStreak(reflections);
    if (currentStreak >= 3) {
      events.push({ id: `streak_${now}`, type: 'streak', title: `${currentStreak}-Day Streak`, subtitle: 'You are building a powerful habit.', createdAt: now, icon: 'zap' });
    }
  }

  return events.sort((a, b) => b.createdAt - a.createdAt);
};