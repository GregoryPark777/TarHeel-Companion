import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

/**
 * Declare process globally for the TypeScript compiler.
 * This prevents the 'Cannot find name process' error in the IDE/build.
 */
declare const process: {
  env: {
    API_KEY: string;
  };
};

export class GeminiService {
  async *sendMessageStream(message: string, context?: string) {
    try {
      // Create the AI instance with the required API Key from the environment.
      const ai = new GoogleGenAI({ 
        apiKey: process.env.API_KEY 
      });
      
      const chat: Chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const prompt = context 
        ? `[OFFICIAL DOCUMENT CONTEXT]:\n${context}\n\n[STUDENT QUERY]:\n${message}`
        : message;

      const result = await chat.sendMessageStream({ message: prompt });
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error: any) {
      console.error("Gemini Streaming Error:", error);
      
      const errMsg = error?.message || "";
      if (errMsg.includes("Requested entity was not found") || errMsg.includes("API key not valid")) {
        yield "Your project connection is missing or invalid. Please click the key icon in the header to re-select your 'TarHeel AI' project. Go Heels!";
      } else {
        yield "I'm having trouble reaching the Carolina servers. Check your connection and try again!";
      }
    }
  }
}

export const gemini = new GeminiService();