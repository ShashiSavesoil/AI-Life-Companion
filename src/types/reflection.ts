export interface ReflectionResponse {
  questionId: string;
  dimension: string;
  answer: string;
}

export interface ReflectionEntry {
  id: string;
  createdAt: number;
  
  // New V0.1 Architecture
  responses?: ReflectionResponse[]; 
  
  // Legacy Fields (kept so old journal entries don't crash)
  mood?: string;
  meaningfulMoment?: string;
  challenge?: string;
  gratitude?: string;
  tomorrowGoal?: string;
}