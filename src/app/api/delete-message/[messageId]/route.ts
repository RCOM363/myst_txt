import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { User as nextAuthUser } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getUserIp } from "@/utils/ip";
import { profileLimiter } from "@/lib/rateLimiters";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const ip = await getUserIp();
  const { success } = await profileLimiter.limit(ip as string);
  if (!success) {
    return Response.json(
      {
        success: false,
        message: "Too many delete requests. Try again later",
      },
      { status: 429 }
    );
  }

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: nextAuthUser = session?.user as nextAuthUser;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  const { messageId } = await params;

  try {
    const updatedResult = await User.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted sucessfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while deleting message: ", error);
    return Response.json(
      {
        success: false,
        message: "Error while deleting message",
      },
      { status: 500 }
    );
  }
}
