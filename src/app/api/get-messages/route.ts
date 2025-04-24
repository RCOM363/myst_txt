import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { User as nextAuthUser } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getUserIp } from "@/utils/ip";
import { userMessagesLimiter } from "@/lib/rateLimiters";

export async function GET(request: Request) {
  const ip = await getUserIp();
  const { success } = await userMessagesLimiter.limit(ip as string);
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

  const userId = new mongoose.Types.ObjectId(user._id);
  // aggregation pipelines doesnt convert string to object Id automatically

  // parse pagination parameters
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "6");

  const skip = (page - 1) * limit;

  try {
    const user = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" }, // splits messages into separate documents
      { $sort: { "messages.createdAt": -1 } }, // sort messages documents
      { $skip: skip },
      { $group: { _id: "_id", messages: { $push: "$messages" } } }, // group messages into single document
    ]);

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

    // get total messages count
    const count = await User.aggregate([
      { $match: { _id: userId } },
      { $project: { messageCount: { $size: "$messages" } } },
    ]);

    const totalMessages = count.length > 0 ? count[0].messageCount : 0;
    const totalPages = Math.ceil(totalMessages / limit);

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
        totalMessages,
        totalPages,
        currentPage: page,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while getting messages: ", error);
    return Response.json(
      {
        success: true,
        message: "Error while getting messages",
      },
      {
        status: 500,
      }
    );
  }
}
