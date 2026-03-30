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
  //to get the cart items from db
  fetchCart: () => Promise<void>;

  //to sync the shoppinglist to db
  syncCart: () => Promise<void>;

  //to merge the quantity or add the db cart item in shopping list
  mergeCart: () => Promise<void>;
  isDirty: boolean;
  setIsDirty: (value: boolean) => void;
}

export const useCartStore = create<cartStore>()(
  persist(
    (set, get) => ({
      shoppingList: [] as cartItem[],
      isDirty: false,
      addToCart: (product) => {
        const state = get();

        //check if the items exist in the shopping list or not
        const existing = state.shoppingList.find(
          (item) => item._id === product._id,
        );

        const updatedItems = existing
          ? //if item exist increase the quantity by 1 and leave the other list item to their current state
            state.shoppingList.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : //if item didn't exist spread the shopping list and add the element and its quantity 1
            [...state.shoppingList, { ...product, quantity: 1 }];

        set({ shoppingList: updatedItems, isDirty: true });
      },

      removeFromCart: (_id) => {
        const state = get();
        const updatedItems = state.shoppingList.filter(
          (item) => item._id !== _id,
        );
        set({ shoppingList: updatedItems, isDirty: true });
      },
      increaseQty: (_id) => {
        const state = get();
        const updatedItems = state.shoppingList.map((item) =>
          item._id === _id ? { ...item, quantity: item.quantity + 1 } : item,
        );
        set({ shoppingList: updatedItems, isDirty: true });
      },
      decreaseQty: (_id) => {
        const state = get();
        const updatedItems = state.shoppingList.map((item) =>
          item._id === _id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item,
        );
        set({ shoppingList: updatedItems, isDirty: true });
      },

      clearCart: () => {
        set({ shoppingList: [], isDirty: true });
      },

      // changes in cart set the value of "isDirty"
      setIsDirty: (value) => {
        set({ isDirty: value });
      },
      fetchCart: async () => {
        const { shoppingList } = get();
        try {
          const res = await fetch("/api/cart");
          const data = await res.json();
          const serverItems = data.items || [];
          if (shoppingList.length === 0) {
            set({ shoppingList: serverItems, isDirty: false });
          }
        } catch (err) {
          console.log("Unable to fetch data", err);
        }
      },
      syncCart: async () => {
        const { shoppingList } = get();
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: shoppingList }),
          });
          //reset idDirty flag once db synced
          set({ isDirty: false });
        } catch (err) {
          console.log("failed to sync cart", err);
        }
      },

      mergeCart: async () => {
        const { shoppingList } = get();
        try {
          const res = await fetch("/api/cart");
          const dbCart = await res.json();
          const merged = [...dbCart.items];

          shoppingList.forEach((localItem) => {
            const existing = merged.find((dbItem) => {
              return dbItem._id === localItem._id;
            });
            existing
              ? (existing.quantity += localItem.quantity)
              : merged.push(localItem);
          });

          set({ shoppingList: merged, isDirty: true });
        } catch (err) {
          console.log("Failed to merge data", err);
        }
      },
    }),

    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
