export function extractMemoriesFromReflection(reflection: ReflectionEntry): Memory[] {
  const memories: Memory[] = [];

  // Helper to safely extract a measurement from the new array, falling back to legacy fields
  const getMeasurement = (dimension: string, legacyField?: string) => {
    const response = reflection.responses?.find(r => r.dimension === dimension);
    return response?.answer || legacyField || '';
  };

  const mood = getMeasurement('emotional_wellbeing', reflection.mood);
  const meaning = getMeasurement('meaning', reflection.meaningfulMoment);
  const stress = getMeasurement('stress', reflection.challenge);
  const gratitude = getMeasurement('gratitude', reflection.gratitude);
  const growth = getMeasurement('growth', reflection.tomorrowGoal);

  // 1. Core Event/General Memory
  if (meaning || stress) {
    const contentParts = [];
    if (meaning) contentParts.push(`Experienced meaning: ${meaning}`);
    if (stress) contentParts.push(`Reported stress/challenge: ${stress}`);

    memories.push({
      id: generateId(),
      createdAt: reflection.createdAt,
      category: 'event',
      content: contentParts.join(' | '),
      mood: mood,
      tags: [mood.toLowerCase(), 'daily_reflection'],
      entities: [],
      importance: 3,
      sourceReflectionId: reflection.id,
    });
  }

  // 2. Goal Memory
  if (growth) {
    memories.push({
      id: generateId(),
      createdAt: reflection.createdAt,
      category: 'goal',
      content: growth,
      mood: mood,
      tags: ['intention', 'short_term'],
      entities: [],
      importance: 4, 
      sourceReflectionId: reflection.id,
    });
  }

  // 3. Emotion Memory
  if (gratitude) {
    memories.push({
      id: generateId(),
      createdAt: reflection.createdAt,
      category: 'emotion',
      content: `Grateful for: ${gratitude}`,
      mood: mood,
      tags: ['gratitude'],
      entities: [],
      importance: 3,
      sourceReflectionId: reflection.id,
    });
  }

  return memories;
}