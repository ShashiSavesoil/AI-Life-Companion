import { Message } from '@/types/chat';

/**
 * Mock AI Service for MVP.
 * In V2, this will be replaced with actual API calls to Gemini or OpenAI.
 */
export async function generateAIResponse(history: Message[]): Promise<string> {
  return new Promise((resolve) => {
    // Simulate network delay for realistic typing indicator
    setTimeout(() => {
      resolve("I hear you. Tell me a bit more about how that made you feel, or what's on your mind right now.");
    }, 1500);
  });
}