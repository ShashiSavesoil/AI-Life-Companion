import { buildUserContext } from './context-engine';
import { aiProvider } from './ai-provider';

const SYSTEM_PROMPT = `
You are an empathetic, insightful AI Life Companion. 
Your goal is to help the user reflect, grow, and navigate their thoughts.
Do not act like a generic assistant (do not offer to set timers or write emails).
Keep responses concise, warm, and conversational.
Use the provided USER CONTEXT to personalize your responses, but do not explicitly say "Based on your context...".
`;

export const buildPrompt = (userMessage: string, context: string): string => {
  return `
${context}

User Message: "${userMessage}"
`.trim();
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  // 1. Gather Context
  const context = await buildUserContext();
  
  // 2. Build the final prompt
  const finalPrompt = buildPrompt(message, context);
  
  // 3. Send to the AI Provider
  const response = await aiProvider.sendMessage(finalPrompt, SYSTEM_PROMPT);
  
  return response;
};