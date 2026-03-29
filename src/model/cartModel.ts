import mongoose, { Schema } from "mongoose";

interface Cart {
  userId: mongoose.Types.ObjectId;
  items: { productId: mongoose.Types.ObjectId; quantity: number };

  createdAt: string;
  updatedAt: string;
}

const cartSchema = new mongoose.Schema<Cart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "quantity cannot be less than 1"],
        },
      },
    ],
  },
  { timestamps: true },
);

const cartModel =
  mongoose.models.CartItem || mongoose.model<Cart>("CartItem", cartSchema);

export default cartModel;
