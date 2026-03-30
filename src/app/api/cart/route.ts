import { connectDb } from "@/libs/db";
import cartModel from "@/models/cartModel";
import { authOptions } from "@/features/useAuth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ items: [] });
  await connectDb();

  const cart = await cartModel.findOne({ userId: session?.user?.id }).lean();

  return NextResponse.json(cart || { items: [] });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "User not logged in" });
  const { items } = await req.json();

  const formattedItems = items.map((item: any) => ({
    productId: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  await connectDb();
  //if user have empty cart delete the cart entry from db as well

  if (formattedItems.length === 0) {
    const cart = await cartModel
      .deleteOne({ userId: session?.user?.id })
      .lean();
    return NextResponse.json(cart);
  }

  // find user by id and insert cart items
  const cart = await cartModel
    .findOneAndUpdate(
      {
        userId: session?.user?.id,
      },
      { $set: { items: formattedItems } },
      { upsert: true, returnDocument: "after" },
    )
    .lean();

  return NextResponse.json(cart);
}
