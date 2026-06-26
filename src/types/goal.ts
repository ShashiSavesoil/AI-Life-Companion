export type GoalType = 'binary' | 'count' | 'habit';
export type GoalStatus = 'active' | 'completed' | 'abandoned';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  status: GoalStatus;
  
  // Progress tracking
  currentCount: number;
  targetCount?: number; 
  
  // Psychological & Memory Links
  dimension?: string;
  linkedReflections?: string[];
  linkedMemories?: string[];
  
  // Timestamps
  createdAt: number;
  completedAt?: number;
}