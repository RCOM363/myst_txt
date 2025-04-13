import { getServerSession } from "next-auth";
import { User as nextAuthUser } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { getUserIp } from "@/utils/ip";
import { profileLimiter } from "@/lib/rateLimiters";

export async function POST(request: Request) {
  const ip = await getUserIp();
  const { success } = await profileLimiter.limit(ip as string);
  if (!success) {
    return Response.json(
      {
        success: false,
        message: "Too many requests. Try again later",
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

  const userId = user._id;

  const { acceptMessages } = await request.json();

  try {
    const result = acceptMessageSchema.safeParse({ acceptMessages });

    if (!result.success) {
      const errors = result.error.format().acceptMessages?._errors || [];
      return Response.json(
        {
          success: false,
          message: errors?.length > 0 ? errors.join(", ") : "Invalid flag",
        },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Messages acceptance status updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while updating status to accept messages: ", error);
    return Response.json(
      {
        success: true,
        message: "Error while updating status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  const ip = await getUserIp();
  const { success } = await profileLimiter.limit(ip as string);
  if (!success) {
    return Response.json(
      {
        success: false,
        message: "Too many requests. Try again later",
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

  const userId = user._id;

  try {
    const foundUser = await User.findById(userId);

    if (!foundUser) {
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

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while getting message acceptance status : ", error);
    return Response.json(
      {
        success: true,
        message: "Error while getting message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
