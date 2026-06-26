import { getReflections } from './reflection-storage';
import { ReflectionEntry } from '@/types/reflection';

// Helper to normalize mood strings into numbers for calculating trends
const moodValues: Record<string, number> = {
  'Great': 5, 'Good': 4, 'Okay': 3, 'Bad': 2, 'Awful': 1
};

export const calculateReflectionStreak = (entries: ReflectionEntry[]): number => {
  if (!entries || entries.length === 0) return 0;
  
  // Sort entries newest to oldest
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  
  // Normalize timestamps to just the "date" (midnight)
  const uniqueDays = Array.from(new Set(sorted.map(e => {
    const d = new Date(e.createdAt);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // If the last entry is older than yesterday, the streak is broken (0)
  if (uniqueDays[0] < yesterday.getTime()) return 0;

  let streak = 0;
  let expectedDay = uniqueDays[0]; 
  
  for (const day of uniqueDays) {
    if (day === expectedDay) {
      streak++;
      expectedDay -= 86400000; // Subtract exactly 1 day in milliseconds
    } else {
      break;
    }
  }

  return streak;
};

export const calculateMoodTrend = (entries: ReflectionEntry[]): { trend: 'up' | 'down' | 'flat', message: string } => {
  if (!entries || entries.length < 2) return { trend: 'flat', message: "Keep reflecting to unlock your mood trend!" };
  
  // Get moods from the last 5 entries
  const recentEntries = [...entries].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  
  const numericMoods = recentEntries.map(e => {
    const moodAnswer = e.responses?.find(r => r.dimension === 'emotional_wellbeing')?.answer || e.mood;
    return moodAnswer ? moodValues[moodAnswer] : null;
  }).filter(m => m !== null) as number[];

  if (numericMoods.length < 2) return { trend: 'flat', message: "Keep reflecting to unlock your mood trend!" };

  const oldestInSet = numericMoods[numericMoods.length - 1];
  const newest = numericMoods[0];

  if (newest > oldestInSet) return { trend: 'up', message: "Your mood has improved recently. Great job!" };
  if (newest < oldestInSet) return { trend: 'down', message: "Your mood has been a bit lower recently. Be gentle with yourself." };
  
  return { trend: 'flat', message: "Your mood has been nice and stable." };
};

export const calculateWeeklySummary = (entries: ReflectionEntry[]): string => {
  if (!entries || entries.length === 0) return "Complete your first reflection to unlock insights!";
  
  const streak = calculateReflectionStreak(entries);
  const mood = calculateMoodTrend(entries);

  if (streak >= 3) return `You are on a ${streak}-day roll! ${mood.message}`;
  return `You have completed ${entries.length} reflections. ${mood.message}`;
};

// The main function the Dashboard will call
export const getDashboardInsights = async () => {
  const entries = await getReflections();
  
  // Get latest mood
  let latestMood = 'None recorded';
  if (entries.length > 0) {
    const latest = entries.sort((a, b) => b.createdAt - a.createdAt)[0];
    latestMood = latest.responses?.find(r => r.dimension === 'emotional_wellbeing')?.answer || latest.mood || 'None recorded';
  }

  return {
    totalReflections: entries.length,
    streak: calculateReflectionStreak(entries),
    moodTrend: calculateMoodTrend(entries),
    weeklySummary: calculateWeeklySummary(entries),
    latestMood: latestMood
  };
};