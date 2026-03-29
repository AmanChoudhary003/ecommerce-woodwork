import { connectDb } from "@/lib/db";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import userModel from "@/model/usermodel";
import { NextResponse } from "next/server";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDb();

        const user = await userModel
          .findOne({
            email: credentials?.email,
          })
          .select("+password");
        if (!user) {
          throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(
          credentials!.password,
          user.password,
        );
        if (!isMatch) {
          throw new Error("Wrong email or password");
        }
        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
