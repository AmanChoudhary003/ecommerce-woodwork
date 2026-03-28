import Link from "next/link";
import { Pagelink } from "../constant/constant";
export default function Navbar() {
  return (
    <div className="flex justify-between">
      <h1>WoodWork</h1>
      <div>
        <ul className="flex">
          {Pagelink.map((page) => {
            return (
              <li key={page.href} className="mx-2">
                <Link href={page.href}>{page.label}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
