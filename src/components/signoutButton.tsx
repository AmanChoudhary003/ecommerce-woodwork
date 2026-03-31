"use client";

import { signOut } from "next-auth/react";
import { useCartStore } from "@/features/useCartStore";
export default function SignOutBtn({ url }: { url: string }) {
  const { clearCart } = useCartStore();

  // clear the cart and redirect to the url passed
  const handleLogOut = async () => {
    clearCart();
    await signOut({ callbackUrl: url });
  };

  return <button onClick={() => handleLogOut()}>SignOut</button>;
}
