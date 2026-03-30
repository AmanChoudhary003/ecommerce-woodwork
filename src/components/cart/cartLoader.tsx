"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/features/useCartStore";
import { useSession } from "next-auth/react";

export default function CartLoader() {
  const hasMerged = useRef<boolean>(false);

  const { data: session } = useSession();
  const { fetchCart, syncCart, mergeCart, isDirty, shoppingList } =
    useCartStore();

  useEffect(() => {
    if (session && !hasMerged.current) {
      if (shoppingList.length > 0) {
        mergeCart();
      } else {
        fetchCart();
      }
    }
    hasMerged.current = true;
  }, [session]);

  useEffect(() => {
    if (!session) return;

    const interval = window.setInterval(() => {
      if (isDirty) {
        syncCart();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [session, shoppingList, isDirty]);

  return null;
}
