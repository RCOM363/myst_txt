import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { User as nextAuthUser } from "next-auth";
import { ZodError } from "zod";

type AuthUser = nextAuthUser & {
  _id: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  username: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<AuthUser> {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        await dbConnect();
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          }).lean();
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            id: String(user._id),
            _id: String(user._id), // Convert _id to string
            name: user.username, // NextAuth expects a `name` field
            email: user.email,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessage,
            username: user.username,
          };
        } catch (error: unknown) {
          if (error instanceof ZodError) {
            throw new Error(`Validation Error: ${error.message}`);
          } else if (error instanceof Error) {
            throw new Error(
              error.message || "An error occurred during authentication"
            );
          } else {
            throw new Error("An unknown error occurred");
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
