import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitFrequency } from '@/types/habit';

const HABITS_KEY = '@companion_habits_v1';

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveHabits = async (habits: Habit[]): Promise<void> => {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
};

export const createHabit = async (title: string, frequency: HabitFrequency = 'daily'): Promise<Habit> => {
  const habits = await getHabits();
  const newHabit: Habit = {
    id: `habit_${Date.now()}`,
    title,
    frequency,
    currentStreak: 0,
    longestStreak: 0,
    completionDates: [],
    createdAt: Date.now(),
  };
  habits.push(newHabit);
  await saveHabits(habits);
  return newHabit;
};

export const toggleHabitToday = async (habitId: string): Promise<void> => {
  const habits = await getHabits();
  const index = habits.findIndex(h => h.id === habitId);
  if (index === -1) return;

  const habit = habits[index];
  const todayStr = getTodayDateString();
  const hasCompletedToday = habit.completionDates.includes(todayStr);

  if (hasCompletedToday) {
    // Untoggle: Remove today
    habit.completionDates = habit.completionDates.filter(d => d !== todayStr);
    habit.currentStreak = Math.max(0, habit.currentStreak - 1);
  } else {
    // Toggle: Add today
    habit.completionDates.push(todayStr);
    habit.currentStreak += 1;
    if (habit.currentStreak > habit.longestStreak) {
      habit.longestStreak = habit.currentStreak;
    }
  }

  habits[index] = habit;
  await saveHabits(habits);
};