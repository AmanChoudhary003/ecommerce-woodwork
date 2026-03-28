"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/features/useCartStore";

export default function ProductCard({ item }: { item: any }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="w-60 p-3 m-1 col-span-1">
      <div className="w-full h-50 overflow-hidden rounded-2xl relative">
        <Image
          src={`/images/jflidhg.jpeg`}
          alt="productImg"
          fill
          sizes="50vw"
          loading="eager"
        />
      </div>
      <div>
        <div>
          <h1>{item.name}</h1>
          <p>{item.price}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              addToCart({
                _id: item._id,
                name: item.name,
                img: item.img,
                price: item.price,
                quantity: 1,
              });
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
