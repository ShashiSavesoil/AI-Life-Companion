import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, GoalType } from '@/types/goal';

const GOALS_KEY = '@companion_goals_v1';

// --- STORAGE ---
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const data = await AsyncStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveGoals = async (goals: Goal[]): Promise<void> => {
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

// --- SERVICE LOGIC ---
export const createGoal = async (title: string, type: GoalType, targetCount?: number, dimension?: string): Promise<Goal> => {
  const goals = await getGoals();
  
  const newGoal: Goal = {
    id: `goal_${Date.now()}`,
    title,
    type,
    status: 'active',
    currentCount: 0,
    targetCount: type === 'binary' ? 1 : targetCount,
    dimension,
    linkedReflections: [],
    linkedMemories: [],
    createdAt: Date.now(),
  };

  goals.push(newGoal);
  await saveGoals(goals);
  return newGoal;
};

export const addGoalProgress = async (goalId: string, amount: number = 1, reflectionId?: string): Promise<void> => {
  const goals = await getGoals();
  const goalIndex = goals.findIndex(g => g.id === goalId);
  
  if (goalIndex === -1) return;
  const goal = goals[goalIndex];

  // Update progress
  goal.currentCount += amount;
  
  // Link reflection if provided
  if (reflectionId && !goal.linkedReflections?.includes(reflectionId)) {
    goal.linkedReflections = [...(goal.linkedReflections || []), reflectionId];
  }

  // Check for completion
  if (goal.targetCount && goal.currentCount >= goal.targetCount && goal.status !== 'completed') {
    goal.currentCount = goal.targetCount; // Cap it
    goal.status = 'completed';
    goal.completedAt = Date.now();
  }

  goals[goalIndex] = goal;
  await saveGoals(goals);
};