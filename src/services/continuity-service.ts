import { getReflections } from './reflection-storage';
import { ReflectionEntry } from '@/types/reflection';
import { ReflectionQuestion } from '@/types/reflection-engine';

export const getFollowUpQuestions = async (): Promise<ReflectionQuestion[]> => {
  const entries = await getReflections();
  if (entries.length === 0) return [];

  // Sort: newest first
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  const yesterday = sorted[0];

  const followUps: ReflectionQuestion[] = [];

  // Logic: Check for 'Intention' (dimension: 'growth') from the previous entry
  const yesterdayIntention = yesterday.responses?.find(r => r.dimension === 'growth')?.answer;

  if (yesterdayIntention) {
    followUps.push({
      id: `followup_intention_${yesterday.id}`,
      version: 1,
      framework: 'CBT',
      dimension: 'growth',
      title: 'Follow-up',
      question: `Yesterday you set this intention: "${yesterdayIntention}". How did that go?`,
      inputType: 'text_short',
      optional: false,
      order: -1, // Ensures it appears first
      tags: ['continuity'],
      analysisWeight: 2.0,
    });
  }

  return followUps;
};