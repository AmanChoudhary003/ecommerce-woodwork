import ProductCard from "@/component/productCard";
import { connectDb } from "@/lib/db";
import productModel from "@/model/mongoosemodel";
export default async function Products() {
  await connectDb();

  const items = await productModel.find({}).lean();

  return (
    <div>
      <div>
        <h1>products</h1>
      </div>
      <div className="grid grid-cols-5">
        {items && items.length > 0
          ? items.map((item) => (
              <ProductCard key={item._id.toString()} item={item} />
            ))
          : ""}
      </div>
    </div>
  );
}
