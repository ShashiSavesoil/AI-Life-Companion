import { getReflections } from './reflection-storage';
import { getGoals } from './goal-service';
import { getHabits, getTodayDateString } from './habit-service';
import { getDashboardInsights } from './insights-service';

export const buildUserContext = async (): Promise<string> => {
  const reflections = await getReflections();
  const goals = await getGoals();
  const habits = await getHabits();
  const insights = await getDashboardInsights();
  
  const todayStr = getTodayDateString();

  // 1. Summarize recent state
  let recentMoodContext = `The user's latest mood is ${insights.latestMood}. They are on a ${insights.streak}-day reflection streak.`;
  
  // 2. Summarize active goals
  const activeGoals = goals.filter(g => g.status === 'active');
  let goalsContext = activeGoals.length > 0 
    ? `Active Goals: ${activeGoals.map(g => g.title).join(', ')}.` 
    : 'No active goals currently.';

  // 3. Summarize habits
  let habitsContext = habits.length > 0
    ? `Habits being tracked: ${habits.map(h => `${h.title} (Streak: ${h.currentStreak}, Completed today: ${h.completionDates.includes(todayStr)})`).join('; ')}.`
    : 'No habits currently tracked.';

  // 4. Summarize yesterday's intention (if any)
  let intentionContext = "";
  if (reflections.length > 0) {
    const latestReflection = [...reflections].sort((a, b) => b.createdAt - a.createdAt)[0];
    const intention = latestReflection.responses?.find(r => r.dimension === 'growth' && r.questionId.includes('tomorrow'))?.answer;
    if (intention) intentionContext = `Yesterday's stated intention was: "${intention}".`;
  }

  // Combine into a token-efficient summary
  return `
--- USER CONTEXT ---
${recentMoodContext}
${intentionContext}
${goalsContext}
${habitsContext}
--------------------
  `.trim();
};