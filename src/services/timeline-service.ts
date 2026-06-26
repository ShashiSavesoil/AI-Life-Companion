import { getReflections } from './reflection-storage';
import { calculateReflectionStreak } from './insights-service';
import { getGoals } from './goal-service';
import { TimelineEvent } from '@/types/timeline';

export const getTimelineEvents = async (): Promise<TimelineEvent[]> => {
  const reflections = await getReflections();
  const goals = await getGoals();
  const events: TimelineEvent[] = [];
  const now = Date.now();

  // 1. Reflection Events
  reflections.forEach(r => {
    const intention = r.responses?.find(res => res.dimension === 'growth' && res.questionId.includes('tomorrow'))?.answer;
    const mood = r.responses?.find(res => res.dimension === 'emotional_wellbeing')?.answer || r.mood;
    
    events.push({
      id: `ref_${r.id}`,
      type: 'reflection',
      title: 'Guided Reflection',
      subtitle: intention ? `Intention: "${intention}"` : `Felt ${mood?.toLowerCase() || 'reflective'}`,
      createdAt: r.createdAt,
      icon: 'edit-2',
      metadata: { reflectionId: r.id }
    });
  });

  // 2. Goal Events (Creation & Completion)
  goals.forEach(g => {
    // Goal Created
    events.push({
      id: `goal_created_${g.id}`,
      type: 'goal',
      title: 'New Goal Set',
      subtitle: g.title,
      createdAt: g.createdAt,
      icon: 'target',
    });

    // Goal Completed
    if (g.status === 'completed' && g.completedAt) {
      events.push({
        id: `goal_completed_${g.id}`,
        type: 'achievement',
        title: 'Goal Conquered! 🏆',
        subtitle: `You completed: ${g.title}`,
        createdAt: g.completedAt,
        icon: 'award',
      });
    }
  });

  // 3. Streak Events
  if (reflections.length > 0) {
    const currentStreak = calculateReflectionStreak(reflections);
    if (currentStreak >= 3) {
      events.push({
        id: `streak_${now}`,
        type: 'streak',
        title: `${currentStreak}-Day Streak`,
        subtitle: 'You are building a powerful habit.',
        createdAt: now, 
        icon: 'zap',
      });
    }
  }

  // Sort chronologically (Newest first)
  return events.sort((a, b) => b.createdAt - a.createdAt);
};