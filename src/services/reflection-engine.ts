import { ReflectionTemplate, ReflectionMode } from '@/types/reflection-engine';

/**
 * ARCHITECTURE VALIDATION TEMPLATE
 * Updated to match the new "Measurement" paradigm and v1 specification.
 */
const ARCHITECTURE_TEST_TEMPLATE: ReflectionTemplate = {
  id: 'tpl_arch_test_01',
  version: 1,
  mode: 'quick',
  title: 'Quick Check-in',
  description: 'A brief moment to ground yourself.',
  questions: [
    {
      id: 'q_mood_01',
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
      id: 'q_meaning_01',
      version: 1,
      framework: 'General',
      dimension: 'meaning',
      title: 'Focus',
      question: 'What is on your mind today?',
      description: 'Capture whatever is taking up the most space in your head.',
      inputType: 'text_long',
      optional: false,
      order: 1,
      tags: ['cognitive_load'],
      analysisWeight: 1.0,
      followUpQuestionIds: [], // Ready for future adaptive routing
    }
  ]
};

const TEMPLATE_REGISTRY: Record<ReflectionMode, ReflectionTemplate[]> = {
  quick: [ARCHITECTURE_TEST_TEMPLATE],
  guided: [], 
  deep: []    
};

export function getReflectionTemplate(mode: ReflectionMode): ReflectionTemplate {
  const templates = TEMPLATE_REGISTRY[mode];
  
  if (!templates || templates.length === 0) {
    return ARCHITECTURE_TEST_TEMPLATE;
  }
  
  return templates[0];
}