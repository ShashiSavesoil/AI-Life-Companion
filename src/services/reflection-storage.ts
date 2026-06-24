import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReflectionEntry } from '@/types/reflection';

const STORAGE_KEY = 'reflection_entries';

export async function getReflections(): Promise<ReflectionEntry[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveReflection(entry: ReflectionEntry) {
  const reflections = await getReflections();
  reflections.unshift(entry);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
}