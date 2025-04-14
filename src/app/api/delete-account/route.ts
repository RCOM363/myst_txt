import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { User as nextAuthUser } from "next-auth";
import { redis } from "@/lib/redis";

import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST() {
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

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // remove pageview from redis db
    await redis.del(["pageviews", user.username].join(":"));

    // Get all deduplication keys for the user
    const keys = await redis.keys(
      ["deduplicate", "*", user.username].join(":")
    );

    // Delete them all
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    return Response.json(
      {
        success: true,
        message: "Account deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting message: ", error);
    return Response.json(
      {
        success: false,
        message: "Error while deleting account",
      },
      { status: 500 }
    );
  }
}
