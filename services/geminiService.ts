
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private getClient() {
    // Creating a fresh instance ensures we use the latest API key from the environment/selector.
    // Following guidelines: use the named parameter and direct process.env.API_KEY reference.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private handleApiError(error: any) {
    console.error("Gemini API Error:", error);
    const errorMessage = error?.message || "";
    
    // If the key is invalid or not found, we signal the UI to reset the key selection
    if (errorMessage.includes("Requested entity was not found")) {
      return "KEY_NOT_FOUND";
    }
    
    return "I'm having a bit of trouble connecting to the UNC servers. Please try again later! Go Heels!";
  }

  async sendMessage(message: string, context?: string) {
    const ai = this.getClient();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const prompt = context 
      ? `Using the following context: \n\n${context}\n\nAnswer the student's question: ${message}`
      : message;

    try {
      const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
      // Following guidelines: use .text property directly (not as a method).
      return response.text || "";
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async *sendMessageStream(message: string, context?: string) {
    const ai = this.getClient();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const prompt = context 
      ? `Using the following context: \n\n${context}\n\nAnswer the student's question: ${message}`
      : message;

    try {
      const result = await chat.sendMessageStream({ message: prompt });
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        // Following guidelines: use .text property directly.
        yield c.text || "";
      }
    } catch (error: any) {
      const err = this.handleApiError(error);
      if (err === "KEY_NOT_FOUND") {
        yield "ERROR_KEY_NOT_FOUND";
      } else {
        yield err;
      }
    }
  }
}

export const gemini = new GeminiService();
