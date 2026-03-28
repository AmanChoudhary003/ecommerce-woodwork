import ProductCard from "@/component/productCard";
import { connectDb } from "@/lib/db";
import productModel from "@/model/mongoosemodel";

export default async function Products() {
  await connectDb();

  const items = await productModel.find({}).lean();
  let safeData = items.map((item) => {
    return {
      ...item,
      _id: item._id.toString(),
    };
  });

  return (
    <div>
      <div>
        <h1>products</h1>
      </div>
      <div className="grid grid-cols-5">
        {safeData && safeData.length > 0
          ? safeData.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))
          : ""}
      </div>
    </div>
  );
}
