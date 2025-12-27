import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private handleApiError(error: any) {
    console.error("Gemini API Error details:", error);
    const msg = error?.message?.toLowerCase() || "";
    
    if (
      msg.includes("403") || 
      msg.includes("api_key_invalid") || 
      msg.includes("not found") || 
      msg.includes("requested entity was not found")
    ) {
      return "ERROR_KEY_INVALID";
    }
    if (msg.includes("429") || msg.includes("quota")) {
      return "ERROR_QUOTA_EXCEEDED";
    }
    
    return `ERROR_GENERAL: ${error?.message || "Internal AI error"}`;
  }

  async *sendMessageStream(message: string, context?: string) {
    // Vite replaces process.env.API_KEY via the 'define' configuration in vite.config.ts
    if (!process.env.API_KEY) {
      console.error("GeminiService: API_KEY is missing from process.env.");
      yield "ERROR_GENERAL: API Key is missing. Please select one using the button in the UI.";
      return;
    }

    try {
      // GUIDELINE: Create a new GoogleGenAI instance right before making an API call to ensure current key is used.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: context 
          ? `[Context]: ${context}\n\n[Question]: ${message}`
          : message,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      let hasContent = false;
      for await (const chunk of responseStream) {
        // GUIDELINE: Use chunk.text property directly.
        const text = chunk.text;
        if (text) {
          hasContent = true;
          yield text;
        }
      }

      if (!hasContent) {
        yield "The advisor didn't return a response. Please try rephrasing.";
      }
    } catch (error: any) {
      console.error("GeminiService: Stream Exception:", error);
      yield this.handleApiError(error);
    }
  }
}

export const gemini = new GeminiService();