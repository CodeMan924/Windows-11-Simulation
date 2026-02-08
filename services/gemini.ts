
import { GoogleGenAI } from "@google/genai";

export interface ChatPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatPart[];
}

export interface ChatResponse {
  text: string;
  images: string[];
}

export async function chatWithGemini(
  prompt: string, 
  base64Image: string | null = null, 
  mimeType: string | null = null,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  if (!process.env.API_KEY) {
    return { text: "Error: API Key is missing. Please provide a valid key.", images: [] };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Improved Heuristic: Check for attached image or wider range of keywords
  const isImageIntent = 
    base64Image !== null || 
    /(draw|generate|create|make|produce|edit|add|remove|change|render|paint|design).*(image|picture|photo|sketch|art|filter|background|texture|icon|logo|banner|illustration)/i.test(prompt) ||
    /^(draw|sketch|paint|render|visualize)\s+/i.test(prompt);

  // Per guidelines: 
  // - General Image Generation and Editing Tasks: 'gemini-2.5-flash-image'
  // - Basic Text Tasks: 'gemini-3-flash-preview'
  const model = isImageIntent ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';

  const currentParts: ChatPart[] = [{ text: prompt }];
  if (base64Image && mimeType) {
    currentParts.push({
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    });
  }

  const contents = [
    ...history,
    { role: 'user' as const, parts: currentParts }
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: "You are Windows Copilot. You can help with text tasks and image generation/editing. Keep responses concise.",
        temperature: 0.7,
      }
    });

    let text = '';
    const images: string[] = [];

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          text += part.text;
        }
        if (part.inlineData) {
          images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        }
      }
    }

    // Fallback: If no images were generated but the model hallucinated a JSON tool call (e.g. dalle.text2im)
    // This happens if the text model was selected by mistake but tried to be helpful by outputting an action.
    if (images.length === 0 && (text.includes('"action": "dalle.text2im"') || text.includes('"action": "text2im"'))) {
      try {
        // Attempt to extract the prompt from the JSON structure
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let fallbackPrompt = prompt;

        if (jsonMatch) {
          const jsonBlock = JSON.parse(jsonMatch[0]);
          // Handle nested stringified JSON in action_input which is common in these hallucinations
          if (jsonBlock.action_input) {
            if (typeof jsonBlock.action_input === 'string') {
              try {
                const inputObj = JSON.parse(jsonBlock.action_input);
                if (inputObj.prompt) fallbackPrompt = inputObj.prompt;
              } catch {
                fallbackPrompt = jsonBlock.action_input;
              }
            } else if (jsonBlock.action_input.prompt) {
               fallbackPrompt = jsonBlock.action_input.prompt;
            }
          }
        }

        // Force call to the image model with the extracted prompt
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: [{ role: 'user', parts: [{ text: fallbackPrompt }] }],
          config: { temperature: 0.7 }
        });

        if (imageResponse.candidates?.[0]?.content?.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            }
          }
        }

        // Clean up the text response
        if (images.length > 0) {
          text = `Generated image for: "${fallbackPrompt}"`;
        }
      } catch (fallbackError) {
        console.error("Fallback image generation failed", fallbackError);
      }
    }

    return { text, images };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I encountered an error connecting to the AI service.", images: [] };
  }
}
