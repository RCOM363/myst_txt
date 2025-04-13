import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { verifySchema } from "@/schemas/verifySchema";
import { getUserIp } from "@/utils/ip";
import { generalLimiter } from "../../../lib/rateLimiters";

export async function POST(request: Request) {
  const ip = await getUserIp();
  const { success } = await generalLimiter.limit(ip as string);

  if (!success) {
    return Response.json(
      {
        success: false,
        message: "Too many request. Try again later",
      },
      { status: 429 }
    );
  }
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await User.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const bodyCode = {
      code: code,
    };

    const result = verifySchema.safeParse(bodyCode);

    if (!result.success) {
      const codeErrors = result.error.format().code?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            codeErrors?.length > 0 ? codeErrors.join(", ") : "Invalid code",
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
    console.log(
      `${new Date(user.verifyCodeExpiry)} > ${new Date()} : ${isCodeExpired}`
    );

    if (isCodeValid && isCodeExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, please signup again to get a new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verfication code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying user: ", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
