export type MemoryCategory =
  | 'emotion'
  | 'goal'
  | 'habit'
  | 'relationship'
  | 'place'
  | 'organization'
  | 'interest'
  | 'value'
  | 'event'
  | 'general';

export interface Memory {
  id: string;
  createdAt: number;
  category: MemoryCategory;
  content: string; // The atomic memory statement
  mood?: string; // Optional emotional context at the time of the memory
  tags: string[]; // General thematic tags (e.g., 'career', 'anxiety')
  entities: string[]; // V2 Knowledge Graph Nodes: Extracted people, places, or concepts
  importance: number; // 1-5 scale to help AI prioritize context loading
  sourceReflectionId: string; // Link back to the raw journal entry
}