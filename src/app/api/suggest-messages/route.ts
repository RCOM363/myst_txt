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
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment and are not repeatitive.";

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
