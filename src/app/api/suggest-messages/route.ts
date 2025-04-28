import { getUserIp } from "@/utils/ip";
import { generalLimiter } from "@/lib/rateLimiters";
import { geminiModel } from "../../../lib/geminiAI";

export async function POST() {
  const ip = await getUserIp();
  const { success } = await generalLimiter.limit(ip as string);
  if (!success) {
    return Response.json(
      {
        success: false,
        message: "Too many requests. Try again later",
      },
      { status: 429 }
    );
  }
  try {
    const prompt =
      `
        Generate a single string containing three different, open-ended, and engaging questions intended for an anonymous social messaging platform (like Qooh.me).
        Strict output rules:
        - Separate each question with ||.
        - Do not add any quotation marks (") at the start, end, or anywhere else.
        - Avoid any personal, sensitive, or controversial topics (no politics, religion, trauma, etc.).
        - Focus on universal, light-hearted themes that anyone can answer easily (e.g., hobbies, dreams, favorite things, imagination).
        - Do not repeat question styles or structures (e.g., don't start all questions with "If you could..." or "What's your favorite...").
        - Each question must feel fresh, varied, and spark genuine curiosity or storytelling.
        - Output example format: "What’s a hobby you’ve recently picked up?||If you could instantly master a new skill, what would it be?||What’s a small thing that always brightens your day?"
        - Ensure the tone is positive, welcoming, and friendly. The goal is to inspire interesting conversations among a diverse audience without feeling repetitive or formulaic.
        Important: Your output must be a single plain string without any surrounding quotation marks or line breaks.
      `;

    const response = await geminiModel.generateContent(prompt);

    const textResponse = response.response.text();

    return Response.json(
      { success: true, questions: textResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating response:", error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
