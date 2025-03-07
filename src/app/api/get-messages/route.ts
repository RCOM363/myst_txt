import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { User as nextAuthUser } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
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

  try {
    const user = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" }, // splits messages into separate documents
      { $sort: { "messages.createdAt": -1 } }, // sort messages documents
      { $group: { _id: "_id", messages: { $push: "$messages" } } }, // group messages into single document
    ]);

    if (!user || user.length === 0) {
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
        messages: user[0].messages,
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
