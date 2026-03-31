"use client";
import Link from "next/link";
const tab = [
  {
    label: "Inventory",
    href: "/inventory",
  },
  { label: "Orders", href: "/orders" },
];
export default function AdminTabs() {
  return (
    <div className="flex">
      {tab.map((tab) => {
        return (
          <Link
            key={tab.href}
            className="p-2 px-5 border cursor-pointer"
            href={`/admin/${tab.href}`}
          >
            <p>{tab.label}</p>
          </Link>
        );
      })}
    </div>
  );
}
