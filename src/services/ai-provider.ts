// 1. The Interface (Agnostic)
export interface AIProvider {
  sendMessage(prompt: string, systemInstruction: string): Promise<string>;
}

// 2. The Gemini Implementation
export class GeminiProvider implements AIProvider {
  private apiKey: string;
  // Note: For V1, we hardcode or use an environment variable. 
  // Get an API key from Google AI Studio.
  constructor(apiKey: string = 'YOUR_GEMINI_API_KEY') {
    this.apiKey = apiKey;
  }

  async sendMessage(prompt: string, systemInstruction: string): Promise<string> {
    if (this.apiKey === 'YOUR_GEMINI_API_KEY') {
      return "System Notice: Please add your Gemini API Key in ai-provider.ts to enable AI responses.";
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: { text: systemInstruction } },
          contents: [{ parts: [{ text: prompt }] }],
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that right now.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Connection error. Please check your network and API key.";
    }
  }
}

// Export a singleton instance
export const aiProvider = new GeminiProvider();