"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/component/productCard";

interface productItem {
  _id: string;
  name: string;
  img: string;
  price: number;
  stock: number;
}

export default function Products() {
  const [products, setProducts] = useState<productItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadMoreRef = useRef<HTMLDivElement>(null);


  
  const fetchProduct = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    //getting the cursor value (last element of rendered list item)
    const cursor = products.length > 0 ? products[products.length - 1]._id : "";

    try {
      const res = await fetch(`/api/products?cursor=${cursor}`);
      const data = await res.json();
      if (data?.itemsList) {
        if (data.itemsList.length < 30) {
          setHasMore(false);
        }
        setProducts((prev) => [...prev, ...data.itemsList]);
      }
    } catch (err) {
      console.error("list fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);


  // rerun fetchProduct when the empty div enters the viewport 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProduct();
        }
      },
      { threshold: 0.1 },
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [fetchProduct, hasMore, loading]);

  return (
    <div>
      <div>
        <h1>products</h1>
      </div>
      <div className="grid grid-cols-5">
        {products && products.length > 0
          ? products.map((item) => <ProductCard key={item._id} item={item} />)
          : ""}
      </div>
      <div ref={loadMoreRef} className="w-full h-5 "></div>
      <div className="w-full flex justify-center">
        <div className="flex justify-center">
          {loading && (
            <span className="spinner block w-8 h-8 border-3 border-transparent border-r-lime-400 rounded-full"></span>
          )}
        </div>
      </div>
    </div>
  );
}
