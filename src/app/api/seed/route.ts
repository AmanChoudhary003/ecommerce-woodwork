import { connectDb } from "@/lib/db";
import productModel from "@/model/productmodel";
import { productList } from "@/constant/constant";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDb();

    await productModel.deleteMany({});

    await productModel.insertMany(productList);

    return NextResponse.json({ message: "database seeded successfully" });
  } catch (error) {
    console.log(error);
  }
}
