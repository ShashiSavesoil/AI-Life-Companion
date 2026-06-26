export type TimelineEventType = 
  | "reflection" 
  | "memory" 
  | "insight" 
  | "achievement" 
  | "streak" 
  | "goal";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  subtitle?: string;
  createdAt: number;
  icon?: string;
  metadata?: Record<string, unknown>;
}