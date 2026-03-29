import { connectDb } from "@/lib/db";
import cartModel from "@/model/cartModel";
import { authOptions } from "@/features/useAuth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ items: [] });
  await connectDb();

  const cart = await cartModel.findOne({ userId: session.user?.email });

  NextResponse.json(cart || { items: [] });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "User not logged in" });
  const { items } = await req.json();
  await connectDb();
  const cart = cartModel.findOneAndUpdate(
    {
      userId: session.user?.email,
    },
    { items },
    { upsert: true, new: true },
  );
  return NextResponse.json(cart);
}
