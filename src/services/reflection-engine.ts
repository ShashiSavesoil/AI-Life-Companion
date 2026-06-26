import { ReflectionTemplate, ReflectionMode, ReflectionQuestion } from '@/types/reflection-engine';
import { getFollowUpQuestions } from './continuity-service';

// ============================================================================
// SPRINT 1: QUICK REFLECTION (Preserved)
// ============================================================================
const QUICK_REFLECTION_TEMPLATE: ReflectionTemplate = {
  id: 'tpl_quick_v1',
  version: 1,
  mode: 'quick',
  title: 'Quick Check-in',
  description: 'A gentle pause to ground yourself and check your vital signs.',
  questions: [
    {
      id: 'q_quick_emotion_01',
      version: 1,
      framework: 'General',
      dimension: 'emotional_wellbeing',
      title: 'Emotion',
      question: 'How are you feeling right now?',
      inputType: 'mood',
      optional: false,
      order: 0,
      tags: ['baseline', 'daily'],
      analysisWeight: 1.0,
    },
    {
      id: 'q_quick_energy_01',
      version: 1,
      framework: 'General',
      dimension: 'energy',
      title: 'Energy',
      question: 'How are your energy levels?',
      description: 'Type a number from 1 (Exhausted) to 10 (Fully charged).',
      inputType: 'slider',
      optional: false,
      order: 1,
      tags: ['vitality', 'daily'],
      analysisWeight: 1.0,
    },
    {
      id: 'q_quick_stress_01',
      version: 1,
      framework: 'General',
      dimension: 'stress',
      title: 'Stress',
      question: 'How heavy does your load feel today?',
      description: 'Type a number from 1 (Completely calm) to 10 (Overwhelmed).',
      inputType: 'slider',
      optional: false,
      order: 2,
      tags: ['cognitive_load', 'daily'],
      analysisWeight: 1.0,
    },
    {
      id: 'q_quick_gratitude_01',
      version: 1,
      framework: 'Gratitude',
      dimension: 'gratitude',
      title: 'Gratitude',
      question: 'What is one small thing you appreciated today?',
      description: 'It can be as simple as a good meal, a quiet moment, or a small win.',
      inputType: 'text_short',
      optional: true,
      order: 3,
      tags: ['positive_psychology', 'daily'],
      analysisWeight: 1.5,
    },
    {
      id: 'q_quick_growth_01',
      version: 1,
      framework: 'CBT',
      dimension: 'growth',
      title: 'Intention',
      question: 'What is one simple intention for tomorrow?',
      description: 'Focus on what you can control. Just one small step.',
      inputType: 'text_short',
      optional: false,
      order: 4,
      tags: ['action_oriented', 'daily'],
      analysisWeight: 1.2,
    }
  ]
};

// ============================================================================
// SPRINT 2: GUIDED REFLECTION - LAYER 1 (CORE)
// Purpose: The 10 immutable questions that form the backbone of the assessment.
// ============================================================================
const GUIDED_CORE_QUESTIONS: ReflectionQuestion[] = [
  {
    id: 'q_guided_core_01', version: 1, framework: 'General', dimension: 'emotional_wellbeing',
    title: 'Emotion', question: 'How is your heart feeling right now?',
    inputType: 'mood', optional: false, order: 0, tags: ['core'], analysisWeight: 1.0,
  },
  {
    id: 'q_guided_core_02', version: 1, framework: 'General', dimension: 'energy',
    title: 'Energy', question: 'How much battery do you feel you have left today?',
    description: '1 (Completely empty) to 10 (Fully charged)',
    inputType: 'slider', optional: false, order: 1, tags: ['core'], analysisWeight: 1.0,
  },
  {
    id: 'q_guided_core_03', version: 1, framework: 'CBT', dimension: 'stress',
    title: 'Stress', question: 'How heavy is the invisible backpack you are carrying today?',
    description: '1 (Light as a feather) to 10 (Weighing me down heavily)',
    inputType: 'slider', optional: false, order: 2, tags: ['core'], analysisWeight: 1.2,
  },
  {
    id: 'q_guided_core_04', version: 1, framework: 'ACT', dimension: 'meaning',
    title: 'Meaning', question: 'What was the most meaningful part of your day, no matter how small?',
    description: 'A moment where you felt aligned, present, or purposeful.',
    inputType: 'text_short', optional: false, order: 3, tags: ['core'], analysisWeight: 1.5,
  },
  {
    id: 'q_guided_core_05', version: 1, framework: 'Gratitude', dimension: 'gratitude',
    title: 'Gratitude', question: 'If you had to thank one person, moment, or thing today, what would it be?',
    inputType: 'text_short', optional: false, order: 4, tags: ['core'], analysisWeight: 1.5,
  },
  {
    id: 'q_guided_core_06', version: 1, framework: 'PERMA', dimension: 'relationships',
    title: 'Connection', question: 'Who made you feel seen, heard, or supported today?',
    description: 'Or, whose day did you try to brighten?',
    inputType: 'text_short', optional: true, order: 5, tags: ['core'], analysisWeight: 1.2,
  },
  {
    id: 'q_guided_core_07', version: 1, framework: 'Self-Determination Theory', dimension: 'competence',
    title: 'Competence', question: 'What is something you handled really well today?',
    description: 'Even if it was just showing up when it was hard.',
    inputType: 'text_short', optional: false, order: 6, tags: ['core'], analysisWeight: 1.2,
  },
  {
    id: 'q_guided_core_08', version: 1, framework: 'CBT', dimension: 'growth',
    title: 'Growth', question: 'What did today teach you about yourself or the world?',
    inputType: 'text_short', optional: true, order: 7, tags: ['core'], analysisWeight: 1.2,
  },
  {
    id: 'q_guided_core_09', version: 1, framework: 'Mindfulness', dimension: 'self_compassion' as any,
    title: 'Self-Compassion', question: 'If a good friend had your exact day, what kind words would you say to them?',
    description: 'Take a moment to say those exact words to yourself.',
    inputType: 'text_long', optional: false, order: 8, tags: ['core'], analysisWeight: 1.8,
  },
  {
    id: 'q_guided_core_10', version: 1, framework: 'ACT', dimension: 'growth',
    title: 'Tomorrow', question: 'What is one gentle, positive intention you can set for tomorrow?',
    inputType: 'text_short', optional: false, order: 9, tags: ['core'], analysisWeight: 1.0,
  }
];

// ============================================================================
// SPRINT 2: GUIDED REFLECTION - LAYER 2 (POOL)
// ============================================================================
const GUIDED_POOL_QUESTIONS: ReflectionQuestion[] = [
  { id: 'q_pool_01', version: 1, framework: 'Self-Determination Theory', dimension: 'autonomy', title: 'Agency', question: 'Where did you feel most in control of your choices today?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.3 },
  { id: 'q_pool_02', version: 1, framework: 'Self-Determination Theory', dimension: 'autonomy', title: 'Boundaries', question: 'Did you say "no" to anything today to protect your peace?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.4 },
  { id: 'q_pool_03', version: 1, framework: 'Mindfulness', dimension: 'mindfulness' as any, title: 'Presence', question: 'Were there any moments today where you felt completely present in your body?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.2 },
  { id: 'q_pool_04', version: 1, framework: 'Mindfulness', dimension: 'mindfulness' as any, title: 'Senses', question: 'What is the most beautiful thing you saw, heard, or tasted today?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.0 },
  { id: 'q_pool_05', version: 1, framework: 'ACT', dimension: 'mindfulness' as any, title: 'Stillness', question: 'Did you take any moments just to breathe and be still today?', inputType: 'boolean', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.0 },
  { id: 'q_pool_06', version: 1, framework: 'CBT', dimension: 'stress', title: 'Letting Go', question: 'Is there a worry you can gently set down for the night?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.5 },
  { id: 'q_pool_07', version: 1, framework: 'CBT', dimension: 'stress', title: 'Expectations', question: 'What is a "should" that you can forgive yourself for not doing today?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.6 },
  { id: 'q_pool_08', version: 1, framework: 'PERMA', dimension: 'meaning', title: 'Flow', question: 'Did you do anything today that made you completely lose track of time?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.2 },
  { id: 'q_pool_09', version: 1, framework: 'ACT', dimension: 'purpose' as any, title: 'Alignment', question: 'Did your actions today align with the person you want to become?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.5 },
  { id: 'q_pool_10', version: 1, framework: 'ACT', dimension: 'meaning', title: 'Narrative', question: 'If today was a chapter in your life story, what would the title be?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.3 },
  { id: 'q_pool_11', version: 1, framework: 'CBT', dimension: 'competence', title: 'Resilience', question: 'What is an obstacle you successfully navigated recently?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.4 },
  { id: 'q_pool_12', version: 1, framework: 'CBT', dimension: 'growth', title: 'Learning', question: 'What is a mistake you made today that you can learn from without judgment?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.5 },
  { id: 'q_pool_13', version: 1, framework: 'Self-Determination Theory', dimension: 'competence', title: 'Strengths', question: 'What natural skill or strength did you rely on today?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.2 },
  { id: 'q_pool_14', version: 1, framework: 'PERMA', dimension: 'relationships', title: 'Connection', question: 'Who is someone you would like to reach out to this week?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.0 },
  { id: 'q_pool_15', version: 1, framework: 'PERMA', dimension: 'relationships', title: 'Joy', question: 'Did you have any interactions today that made you smile?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.0 },
  { id: 'q_pool_16', version: 1, framework: 'CBT', dimension: 'emotional_wellbeing', title: 'Emotions', question: 'What emotion visited you the most today, and what was it trying to tell you?', inputType: 'text_long', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.6 },
  { id: 'q_pool_17', version: 1, framework: 'Mindfulness', dimension: 'self_compassion' as any, title: 'Grace', question: 'Where can you give yourself a little more grace today?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.5 },
  { id: 'q_pool_18', version: 1, framework: 'General', dimension: 'energy', title: 'Drain', question: 'What drained your energy today, and how can you protect it tomorrow?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.3 },
  { id: 'q_pool_19', version: 1, framework: 'General', dimension: 'energy', title: 'Charge', question: 'What activity brought you the most energy or relief today?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.2 },
  { id: 'q_pool_20', version: 1, framework: 'Gratitude', dimension: 'gratitude', title: 'Perspective', question: 'What is a privilege or blessing you might have taken for granted today?', inputType: 'text_short', optional: true, order: 10, tags: ['pool'], analysisWeight: 1.4 },
];

function buildGuidedTemplate(): ReflectionTemplate {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const poolStartIndex = (dayOfYear * 2) % GUIDED_POOL_QUESTIONS.length;
  const poolQuestion1 = GUIDED_POOL_QUESTIONS[poolStartIndex];
  const poolQuestion2 = GUIDED_POOL_QUESTIONS[(poolStartIndex + 1) % GUIDED_POOL_QUESTIONS.length];

  poolQuestion1.order = 10;
  poolQuestion2.order = 11;

  return {
    id: `tpl_guided_dynamic`,
    version: 1,
    mode: 'guided',
    title: 'Guided Reflection',
    description: 'A thoughtful, balanced conversation with yourself.',
    questions: [...GUIDED_CORE_QUESTIONS, poolQuestion1, poolQuestion2]
  };
}

const TEMPLATE_REGISTRY: Record<ReflectionMode, ReflectionTemplate[] | (() => ReflectionTemplate)> = {
  quick: [QUICK_REFLECTION_TEMPLATE],
  guided: buildGuidedTemplate,
  deep: [] 
};

// ============================================================================
// SPRINT 4: CONTINUITY UPDATE (Now async and fetches follow-ups!)
// ============================================================================
export async function getReflectionTemplate(mode: ReflectionMode): Promise<ReflectionTemplate> {
  const templateOrBuilder = TEMPLATE_REGISTRY[mode];
  
  let baseTemplate = QUICK_REFLECTION_TEMPLATE;
  
  if (templateOrBuilder) {
    if (typeof templateOrBuilder === 'function') {
      baseTemplate = templateOrBuilder();
    } else {
      baseTemplate = templateOrBuilder[0] || QUICK_REFLECTION_TEMPLATE;
    }
  }
  
  // Inject the Memory/Continuity layer
  const followUps = await getFollowUpQuestions();
  
  return {
    ...baseTemplate,
    questions: [...followUps, ...baseTemplate.questions]
  };
}