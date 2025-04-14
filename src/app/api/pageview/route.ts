import crypto from "crypto";
import { getServerSession } from "next-auth";
import { User as nextAuthUser } from "next-auth";

import { redis } from "@/lib/redis";
import { getUserIp } from "@/utils/ip";
import { authOptions } from "../auth/[...nextauth]/options";

// get pageview (protected route)
export async function GET() {
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
  const { username } = user;
  try {
    const views = await redis.get<number>(["pageviews", username].join(":"));
    return Response.json(
      {
        success: true,
        message: "Page view fetched successfully",
        totalViews: views ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting message: ", error);
    return Response.json(
      {
        success: false,
        message: "Error while fetching page views",
      },
      { status: 500 }
    );
  }
}

// increment pageview
export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const slug = username as string | undefined;

    if (!slug) {
      return Response.json(
        {
          success: false,
          message: "Username is required",
        },
        { status: 400 }
      );
    }
    const ip = await getUserIp();
    // hash the IP and turn it into hex string
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip)
    );
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // check if specific IP has been viewing the page within last 24hrs
    const isNew = await redis.set(["deduplicate", hash, slug].join(":"), true, {
      nx: true,
      ex: 24 * 60 * 60,
    });

    if (!isNew) {
      return Response.json(null, { status: 202 });
    }

    // increment the count
    await redis.incr(["pageviews", slug].join(":"));
    return Response.json(null, { status: 202 });
  } catch (error) {
    console.error("Error while deleting message: ", error);
    return Response.json(
      {
        success: false,
        message: "Error while incrementing page view",
      },
      { status: 500 }
    );
  }
}
