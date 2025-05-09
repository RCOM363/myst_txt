import { geminiModel } from "./geminiAI";

export async function isProfane(message: string) {
  try {
    const prompt = `
        You are an intelligent and multilingual content moderation assistant.
    
        Your job is to analyze user-generated messages and determine if they contain profanity, hate speech, abusive language, or offensive content in any language — including Hindi, English, Marathi, Kannada, Hinglish (Hindi written in Latin script), or a mix of them.
    
        Instructions:
        - Return "true" if the message contains any form of profanity or inappropriate language.
        - Return "false" if the message is safe, respectful, and clean.
        - Be strict and include slang, disguised or transliterated words (like "bhosdi", "chutiya", etc.)
    
        Message: "${message}"
        Answer (true/false only):
    `;

    const response = await geminiModel.generateContent(prompt);

    const result = response.response.text().trim().toLowerCase();

    if (result === "true") {
      return true;
    }
    if (result === "false") {
      return false;
    }

    // fallback
    return false;
  } catch (error) {
    console.error("Error generating response:", error);
  }
}
