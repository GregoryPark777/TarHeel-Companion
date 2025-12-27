import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

declare const process: {
  env: {
    API_KEY: string;
  };
};

export class GeminiService {
  async *sendMessageStream(message: string, context?: string) {
    // Pick up the key at the moment of the request
    const key = typeof process !== 'undefined' ? process.env?.API_KEY : null;
    
    if (!key || key === 'undefined' || key.length < 5) {
      yield "Connection failed. Please use the key icon in the header to select your project and enable the advisor. Go Heels!";
      return;
    }

    try {
      // MANDATORY: new GoogleGenAI({ apiKey: ... })
      const ai = new GoogleGenAI({ apiKey: key });
      
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
      console.error("Gemini service error:", error);
      const errMsg = error?.message || "";
      
      if (errMsg.includes("Requested entity was not found") || errMsg.includes("403") || errMsg.includes("404")) {
        yield "Access Denied. Your project selection might be invalid or missing billing. Please click the key icon to re-select a project from a paid Google Cloud account. Go Heels!";
      } else {
        yield "The Carolina servers are temporarily busy. Please try your question again in a moment.";
      }
    }
  }
}

export const gemini = new GeminiService();