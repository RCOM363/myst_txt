import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  const fromEmail = process.env.FROM_EMAIL!
  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "MystTxt | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.error("Error sending verification email: ", error);
      return { success: false, message: "Error sending verification email" };
    }

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email: ", emailError);
    return { success: false, message: "Error sending verification email" };
  }
}
