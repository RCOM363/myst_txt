import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { Message } from "@/model/user.model";
import { generalLimiter } from "@/lib/rateLimiters";
import { getUserIp } from "@/utils/ip";
import { isProfane } from "@/lib/profanityCheck";

export async function POST(request: Request) {
  const ip = await getUserIp();
  const { success } = await generalLimiter.limit(ip as string);

  if (!success) {
    return Response.json(
      {
        success: false,
        message: "Too many requests. Try again later",
      },
      {
        status: 429,
      }
    );
  }

  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isUserAcceptingMessages = user.isAcceptingMessage;

    if (!isUserAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const checkProfanity = user.checkProfanity;

    if (checkProfanity) {
      const profane = await isProfane(content);
      if (profane) {
        return Response.json(
          {
            success: false,
            message: "The message contains profanity",
          },
          {
            status: 403,
          }
        );
      }
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error adding message: ", error);
    return Response.json(
      {
        success: true,
        message: "Error adding message",
      },
      {
        status: 500,
      }
    );
  }
}
