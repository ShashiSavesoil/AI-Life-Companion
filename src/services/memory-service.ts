import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memory, MemoryCategory } from '@/types/memory';
import { ReflectionEntry } from '@/types/reflection';

const MEMORY_STORAGE_KEY = 'companion_memories';

// Helper to generate a unique ID
const generateId = () => `mem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

/**
 * MVP Deterministic Extraction Logic.
 * A single reflection is broken down into multiple atomic memories.
 * 
 * * V2 AI INTEGRATION POINT: 
 * This entire function will be replaced by an LLM call that returns
 * an array of highly categorized, entity-extracted memories.
 */
export function extractMemoriesFromReflection(reflection: ReflectionEntry): Memory[] {
  const memories: Memory[] = [];

  // 1. Core Event/General Memory
  if (reflection.meaningfulMoment || reflection.challenge) {
    const contentParts = [];
    if (reflection.meaningfulMoment) contentParts.push(`Experienced meaning: ${reflection.meaningfulMoment}`);
    if (reflection.challenge) contentParts.push(`Faced challenge: ${reflection.challenge}`);

    memories.push({
      id: generateId(),
      createdAt: Date.now(),
      category: 'event',
      content: contentParts.join(' | '),
      mood: reflection.mood,
      tags: [reflection.mood.toLowerCase(), 'daily_reflection'],
      entities: [], // Deterministic MVP cannot extract entities safely
      importance: 3,
      sourceReflectionId: reflection.id,
    });
  }

  // 2. Goal Memory
  if (reflection.tomorrowGoal) {
    memories.push({
      id: generateId(),
      createdAt: Date.now(),
      category: 'goal',
      content: reflection.tomorrowGoal,
      mood: reflection.mood,
      tags: ['intention', 'short_term'],
      entities: [],
      importance: 4, // Goals are structurally more important to track
      sourceReflectionId: reflection.id,
    });
  }

  // 3. Emotion Memory
  if (reflection.gratitude) {
    memories.push({
      id: generateId(),
      createdAt: Date.now(),
      category: 'emotion',
      content: `Grateful for: ${reflection.gratitude}`,
      mood: reflection.mood,
      tags: ['gratitude'],
      entities: [],
      importance: 3,
      sourceReflectionId: reflection.id,
    });
  }

  return memories;
}

export async function getMemories(): Promise<Memory[]> {
  try {
    const data = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to retrieve memories:', error);
    return [];
  }
}

export async function getRecentMemories(limit: number = 5): Promise<Memory[]> {
  const memories = await getMemories();
  return memories.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
}

export async function getMemoriesByCategory(category: MemoryCategory): Promise<Memory[]> {
  const memories = await getMemories();
  return memories
    .filter(m => m.category === category)
    .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Orchestrator function to extract and save memories from a new reflection.
 */
export async function processReflectionMemories(reflection: ReflectionEntry): Promise<Memory[]> {
  const newMemories = extractMemoriesFromReflection(reflection);
  
  if (newMemories.length === 0) return [];

  const existingMemories = await getMemories();
  const updatedMemories = [...newMemories, ...existingMemories];

  try {
    await AsyncStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(updatedMemories));
    return newMemories;
  } catch (error) {
    console.error('Failed to save memories:', error);
    throw error;
  }
}

export async function deleteMemory(id: string): Promise<void> {
  const memories = await getMemories();
  const filtered = memories.filter(m => m.id !== id);

  try {
    await AsyncStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete memory:', error);
    throw error;
  }
}