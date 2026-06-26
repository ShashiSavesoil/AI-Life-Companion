export type ReflectionMode = 'quick' | 'guided' | 'deep';

export type PsychologicalDimension = 
  | 'emotional_wellbeing' 
  | 'energy' 
  | 'stress' 
  | 'meaning' 
  | 'gratitude' 
  | 'relationships' 
  | 'competence' 
  | 'growth' 
  | 'self_compassion' 
  | 'autonomy' 
  | 'mindfulness' 
  | 'purpose';

export type PsychologyFramework = 
  | 'General' 
  | 'CBT' 
  | 'ACT' 
  | 'Gratitude' 
  | 'PERMA' 
  | 'Self-Determination Theory' 
  | 'Mindfulness';

export type InputType = 'mood' | 'slider' | 'text_short' | 'text_long' | 'boolean' | 'choice_multiple' | 'rating';

export interface ReflectionQuestion {
  id: string;
  version: number;
  framework: PsychologyFramework;
  dimension: PsychologicalDimension;
  title: string;
  question: string;
  description?: string;
  inputType: InputType;
  optional: boolean;
  order: number;
  tags: string[];
  analysisWeight: number;
}

export interface ReflectionTemplate {
  id: string;
  version: number;
  mode: ReflectionMode;
  title: string;
  description: string;
  questions: ReflectionQuestion[];
}