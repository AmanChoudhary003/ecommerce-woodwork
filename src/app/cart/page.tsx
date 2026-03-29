import CartPage from "@/component/cartPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/features/useAuth";
  
export default async function Cart() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/register");
  }
  return <CartPage />;
}
