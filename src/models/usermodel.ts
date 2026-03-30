import mongoose from "mongoose";

interface User {
  email: string;
  password: string;
  username: string;
  bio: string;
  phone: number;
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
    bio: String,
    phone: Number,
  },
  { timestamps: true },
);

const userModel =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default userModel;
