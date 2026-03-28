import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import productModel from "@/model/mongoosemodel";
import { NextRequest } from "next/server";
export async function GET(req: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");

  if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
    return Response.json(
      {
        error: "invalid Id",
      },
      { status: 400 },
    );
  }
  const query = cursor ? { _id: { $gt: cursor } } : {};

  const items = await productModel
    .find(query)
    .sort({ _id: 1 })
    .limit(30)
    .lean();

  const safeData = items.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return Response.json({ itemsList: safeData }, { status: 200 });
}
