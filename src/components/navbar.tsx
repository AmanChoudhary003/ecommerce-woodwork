"use client";

import Link from "next/link";
import { Pagelink } from "../constant/constant";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/features/useCartStore";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { clearCart } = useCartStore();

  // const clearCart = useCartStore((state) => state.clearCart);

  const handleLogOut = async () => {
    clearCart();
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading")
    return (
      <div>
        {" "}
        <h1>WoodWork</h1>
      </div>
    );

  return (
    <div className="flex justify-between">
      <h1>WoodWork</h1>
      <div className="flex">
        <ul className="flex">
          {Pagelink.map((page) => {
            return (
              <li key={page.href} className="mx-2">
                <Link href={page.href}>{page.label}</Link>
              </li>
            );
          })}
        </ul>
        <div>
          {session ? (
            <>
              <Link href={`/profile`}>Profile</Link>
              <button
                onClick={() => {
                  handleLogOut();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href={`/register`} className="mx-2">
                Register
              </Link>
              <Link href={`/login`}>LogIn</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
