"use client";
import { useCartStore } from "@/features/useCartStore";
import Image from "next/image";
export default function Cart() {
  const { shoppingList, removeFromCart, increaseQty, decreaseQty } =
    useCartStore();

  const total = shoppingList.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  return (
    <div className="h-screen">
      <div>
        <h1>Cart</h1>

        {shoppingList.length === 0 && <p>Your Cart is empty</p>}
      </div>
      <div>
        {shoppingList.map((item) => {
          return (
            <div key={item._id} className="p-5 flex justify-between items-end">
              <div className="flex items-end">
                <div className="w-20 h-20 mr-5 relative overflow-hidden rounded-lg">
                  <Image
                    src={`/images/jflidhg.jpeg`}
                    alt="productImg"
                    fill
                    sizes="10vw"
                  />
                </div>

                <div>
                  <p className="text-lg font-bold">{item.name}</p>
                  <p>₹{item.price}</p>
                </div>
              </div>
              <div className="flex items-end">
                <p className="text-xl font-bold mx-5">{item.quantity}</p>
                <div>
                  <button
                    onClick={() => increaseQty(item._id)}
                    className="w-10 h-10 text-sm font-bold bg-lime-500 mx-1 rounded-xl "
                  >
                    +
                  </button>

                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="w-10 h-10  font-bold bg-red-500 mx-1 rounded-xl"
                  >
                    -
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="w-40 h-10 text-sm font-bold bg-red-500 mx-1 rounded-xl"
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end items-center border-t p-5">
        <div className="flex">
          <p className="font-bold mx-2">Total:</p>
          <p>₹{total}</p>
        </div>
      </div>
    </div>
  );
}
