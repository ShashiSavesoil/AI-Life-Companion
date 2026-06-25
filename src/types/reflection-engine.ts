import { PsychologicalDimension, PsychologyFramework } from './reflection-engine';

export interface ReflectionResponse {
  questionId: string;
  dimension: PsychologicalDimension;
  framework: PsychologyFramework;
  answer: string;
}

export interface ReflectionEntry {
  id: string;
  date: string;
  createdAt: number;
  
  // The new, generic measurement data
  responses: ReflectionResponse[];
  
  // Legacy fields (Maintained for backward compatibility with Home and Memory Engine MVP)
  mood: string;
  meaningfulMoment: string;
  challenge: string;
  gratitude: string;
  tomorrowGoal: string;
}