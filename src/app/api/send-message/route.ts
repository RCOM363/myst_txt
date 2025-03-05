import { getServerSession } from "next-auth";
import { User as nextAuthUser } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { Message } from "@/model/user.model";

export async function POST(request: Request) {
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
