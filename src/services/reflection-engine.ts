import { ReflectionTemplate, ReflectionMode } from '@/types/reflection-engine';

/**
 * SPRINT 1: Quick Reflection Template
 * Purpose: Daily consistency and baseline vital signs check.
 * Estimated time: < 3 minutes.
 */
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
      optional: true, // Made optional to reduce friction on heavy days
      order: 3,
      tags: ['positive_psychology', 'daily'],
      analysisWeight: 1.5, // High weight for CBT rewiring
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

// Registry linking modes to their templates
const TEMPLATE_REGISTRY: Record<ReflectionMode, ReflectionTemplate[]> = {
  quick: [QUICK_REFLECTION_TEMPLATE],
  guided: [], // To be built in Sprint 2
  deep: []    // To be built in Sprint 3
};

export function getReflectionTemplate(mode: ReflectionMode): ReflectionTemplate {
  const templates = TEMPLATE_REGISTRY[mode];
  
  // Graceful fallback if a requested mode is missing
  if (!templates || templates.length === 0) {
    return QUICK_REFLECTION_TEMPLATE;
  }
  
  return templates[0];
}