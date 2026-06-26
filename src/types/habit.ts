export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  title: string;
  frequency: HabitFrequency;
  
  // Tracking
  currentStreak: number;
  longestStreak: number;
  completionDates: string[]; // Stored as 'YYYY-MM-DD' for deterministic tracking
  
  // Integrations
  dimension?: string;
  linkedGoalId?: string;
  
  createdAt: number;
}