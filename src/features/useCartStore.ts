import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface cartItem {
  _id: string;
  name: string;
  img: string;
  price: number;
  quantity: number;
}
interface cartStore {
  shoppingList: cartItem[];
  addToCart: (product: cartItem) => void;
  removeFromCart: (_id: string) => void;
  increaseQty: (_id: string) => void;
  decreaseQty: (_id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<cartStore>()(
  persist(
    (set) => ({
      shoppingList: [] as cartItem[],
      addToCart: (product) =>
        set((state) => {
          // check if item exists in cart or not
          const existing = state.shoppingList.find(
            (item) => item._id === product._id,
          );
          if (existing) {
            return {
              shoppingList: state.shoppingList.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          // when item is not in cart add the item
          return {
            shoppingList: [...state.shoppingList, { ...product, quantity: 1 }],
          };
        }),
      removeFromCart: (_id) =>
        // removes the item if _id matched
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => item._id != _id),
        })),
      increaseQty: (_id) =>
        // appends item quantity by 1 when id matches
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item._id === _id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        })),
      decreaseQty: (_id) =>
        // decrease item quantity by 1 when id matches
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item._id === _id ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        })),
      clearCart: () => set({ shoppingList: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
