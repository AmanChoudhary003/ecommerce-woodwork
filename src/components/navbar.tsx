"use client";

import Link from "next/link";
import { Pagelink } from "../constant/constant";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/features/useCartStore";
import SignOutBtn from "./signoutButton";
export default function Navbar() {
  const { data: session, status } = useSession();
  const { clearCart } = useCartStore();

  // const clearCart = useCartStore((state) => state.clearCart);

  return (
    <div className="flex justify-between">
      <h1>WoodWork</h1>
      <div className="flex">
        {status === "loading" ? (
          <>
            <div className="flex justify-center mr-10">
              <span className="spinner block w-8 h-8 border-3 border-transparent border-r-lime-400 rounded-full"></span>
            </div>
          </>
        ) : (
          <>
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
                  <SignOutBtn url={`/`} />
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
          </>
        )}
      </div>
    </div>
  );
}
