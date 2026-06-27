import { saveReflection } from './reflection-storage';
import { saveGoals } from './goal-service';
import { saveHabits, getTodayDateString } from './habit-service';
import { ReflectionEntry } from '@/types/reflection';
import { Goal } from '@/types/goal';
import { Habit } from '@/types/habit';

export const injectDemoData = async (): Promise<void> => {
  const now = Date.now();
  const dayMs = 86400000;

  // 1. Generate Realistic Habits
  const todayStr = getTodayDateString();
  const yesterdayStr = new Date(now - dayMs).toISOString().split('T')[0];
  const twoDaysAgoStr = new Date(now - (dayMs * 2)).toISOString().split('T')[0];
  const threeDaysAgoStr = new Date(now - (dayMs * 3)).toISOString().split('T')[0];

  const demoHabits: Habit[] = [
    {
      id: 'demo_habit_1', title: 'Review exam mock tests', frequency: 'daily',
      currentStreak: 4, longestStreak: 12,
      completionDates: [threeDaysAgoStr, twoDaysAgoStr, yesterdayStr, todayStr],
      createdAt: now - (dayMs * 15)
    },
    {
      id: 'demo_habit_2', title: 'Morning mindfulness', frequency: 'daily',
      currentStreak: 2, longestStreak: 5,
      completionDates: [yesterdayStr, todayStr],
      createdAt: now - (dayMs * 10)
    }
  ];

  // 2. Generate Realistic Goals
  const demoGoals: Goal[] = [
    {
      id: 'demo_goal_1', title: 'Distribute 50 tree saplings for Save Soil', type: 'count',
      status: 'active', currentCount: 35, targetCount: 50, dimension: 'meaning',
      createdAt: now - (dayMs * 20)
    },
    {
      id: 'demo_goal_2', title: 'Complete GATE 2026 Thermodynamics prep', type: 'binary',
      status: 'completed', currentCount: 1, targetCount: 1, dimension: 'competence',
      createdAt: now - (dayMs * 14), completedAt: now - (dayMs * 2)
    }
  ];

  // 3. Generate 5 Days of Reflections
  const demoReflections: ReflectionEntry[] = [];
  
  const dailyMoods = ['Okay', 'Good', 'Good', 'Bad', 'Great'];
  const dailyEnergy = ['4', '6', '7', '3', '8'];
  const dailyStress = ['8', '6', '5', '9', '4'];
  const dailyIntentions = [
    'I will organize my study notes tonight.',
    'I will take a 30-minute walk without my phone.',
    'I will reach out to the volunteer coordinator.',
    'I need to rest and reset my brain.',
    'I will carry this positive momentum into tomorrow.'
  ];

  for (let i = 0; i < 5; i++) {
    const entryDate = now - (dayMs * (4 - i));
    demoReflections.push({
      id: `demo_ref_${i}`,
      createdAt: entryDate,
      mood: dailyMoods[i],
      responses: [
        { questionId: 'q_quick_emotion_01', dimension: 'emotional_wellbeing', answer: dailyMoods[i] },
        { questionId: 'q_quick_energy_01', dimension: 'energy', answer: dailyEnergy[i] },
        { questionId: 'q_quick_stress_01', dimension: 'stress', answer: dailyStress[i] },
        { questionId: 'q_quick_growth_01', dimension: 'growth', answer: dailyIntentions[i] },
        { questionId: 'q_guided_core_04', dimension: 'meaning', answer: i === 4 ? 'Connecting with friends after a long week of studying.' : '' }
      ]
    });
  }

  // Overwrite existing data with the rich demo data
  await saveHabits(demoHabits);
  await saveGoals(demoGoals);
  await saveReflection(demoReflections[0]); // Save first to init
  
  // Save the rest to build the timeline
  for (let i = 1; i < demoReflections.length; i++) {
     const currentReflections = await import('./reflection-storage').then(m => m.getReflections());
     currentReflections.push(demoReflections[i]);
     await import('@react-native-async-storage/async-storage').then(m => m.default.setItem('@companion_reflections_v1', JSON.stringify(currentReflections)));
  }
};