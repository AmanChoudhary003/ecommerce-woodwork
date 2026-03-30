import mongoose, { Schema } from "mongoose";

interface Cart {
  userId: mongoose.Types.ObjectId;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
  }>;
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
      new mongoose.Schema(
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "quantity cannot be less than 1"],
          },
        },
        { _id: false },
      ),
    ],
  },
  { timestamps: true },
);

const cartModel =
  mongoose.models.CartItem || mongoose.model<Cart>("CartItem", cartSchema);

export default cartModel;
