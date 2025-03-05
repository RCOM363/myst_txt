import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await model.generateContent(prompt);

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
