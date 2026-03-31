import { connectDb } from "@/libs/db";
import cartModel from "@/models/cartModel";
import productModel from "@/models/productmodel";
import { authOptions } from "@/features/useAuth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// interface dbCart {
//   productId: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

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


  await connectDb();

  //gets every id from the cart
  const cartItemId = items.map((item: any) => item._id);

  // get the same product id from the db
  const productinDb = await productModel.find({ _id: { $in: cartItemId } });

  // check if item exist in db or not

  const formattedItems = items.map((item: any) => {
    const dbProducts = productinDb.find(
      (product: any) => product._id.toString() === item._id,
    );

    if (!dbProducts) {
      throw new Error(`product ${item.product.name} not found`);
    }

    return {
      productId: dbProducts._id,
      name: dbProducts.name,
      price: dbProducts.price,
      quantity: item.quantity,
    };
  });

  // if user have empty cart delete the cart entry from db as well

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

  return NextResponse.json("cart");
}
