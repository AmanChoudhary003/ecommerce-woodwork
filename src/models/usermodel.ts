import mongoose from "mongoose";

interface User {
  email: string;
  password: string;
  username: string;
  phone: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    username: String,
    phone: Number,
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

const userModel =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default userModel;
