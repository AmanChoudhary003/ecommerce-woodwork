import userModel from "@/model/usermodel";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  await connectDb();
  const existing = await userModel.findOne({ email });

  if (existing) {
    return NextResponse.json({ error: "User exists." });
  }
  const hashed = await bcrypt.hash(password, 10);
  await userModel.create({
    email,
    password: hashed,
  });
  return NextResponse.json({ message: "User created" });
}
