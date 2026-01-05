
import { GoogleGenAI } from "@google/genai";

export async function chatWithGemini(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are Windows Copilot, a friendly AI assistant built into the Windows 11 Web experience. Help users with productivity, coding, and general knowledge. Keep responses concise and formatted with markdown.",
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Could not connect to AI services. Please check your network.";
  }
}
