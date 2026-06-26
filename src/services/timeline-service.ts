import { getReflections } from './reflection-storage';
import { calculateReflectionStreak, calculateMoodTrend } from './insights-service';
import { TimelineEvent } from '@/types/timeline';

export const getTimelineEvents = async (): Promise<TimelineEvent[]> => {
  const reflections = await getReflections();
  if (!reflections || reflections.length === 0) return [];

  const events: TimelineEvent[] = [];
  const now = Date.now();

  // 1. Generate events for every Reflection
  reflections.forEach(r => {
    // Try to find an intention or meaning for the subtitle
    const intention = r.responses?.find(res => res.dimension === 'growth' && res.questionId.includes('tomorrow'))?.answer;
    const meaning = r.responses?.find(res => res.dimension === 'meaning')?.answer;
    const mood = r.responses?.find(res => res.dimension === 'emotional_wellbeing')?.answer || r.mood;

    let subtitle = 'Completed a reflection';
    if (intention) subtitle = `Intention: "${intention}"`;
    else if (meaning) subtitle = `Meaning: "${meaning}"`;
    else if (mood) subtitle = `Felt ${mood.toLowerCase()}`;

    events.push({
      id: `ref_${r.id}`,
      type: 'reflection',
      title: 'Guided Reflection',
      subtitle: subtitle,
      createdAt: r.createdAt,
      icon: 'edit-2', // Feather icon name
      metadata: { reflectionId: r.id }
    });
  });

  // 2. Generate dynamic events (Streaks & Insights)
  const currentStreak = calculateReflectionStreak(reflections);
  if (currentStreak >= 3) {
    events.push({
      id: `streak_${now}`,
      type: 'streak',
      title: `${currentStreak}-Day Reflection Streak`,
      subtitle: 'You are building a powerful habit.',
      createdAt: now, // Pin to top
      icon: 'zap',
    });
  }

  // 3. Milestone Insight (First Reflection)
  if (reflections.length > 0) {
    const firstReflection = [...reflections].sort((a, b) => a.createdAt - b.createdAt)[0];
    events.push({
      id: 'milestone_first',
      type: 'achievement',
      title: 'Began Your Journey',
      subtitle: 'You took the first step by completing your first reflection.',
      createdAt: firstReflection.createdAt - 1000, // Place just before the first reflection
      icon: 'flag',
    });
  }

  // 4. Sort strictly chronologically (Newest first)
  events.sort((a, b) => b.createdAt - a.createdAt);

  return events;
};