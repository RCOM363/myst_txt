import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
