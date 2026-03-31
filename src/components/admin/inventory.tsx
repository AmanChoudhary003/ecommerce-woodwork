"use client";

import mongoose from "mongoose";
import { connectDb } from "@/libs/db";
import productModel from "@/models/productmodel";
import { NextRequest, NextResponse } from "next/server";

export async function Inventory(req: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");

  if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
    return NextResponse.json(
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

  const inventory = items.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return (
    <div>
      {inventory.map((item) => {
        return <div>{item.name}</div>;
      })}
    </div>
  );
}
