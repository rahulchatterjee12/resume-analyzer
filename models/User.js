import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional: If building custom email/password auth
    credits: { type: Number, default: 3 }, // Free tier starts with 3 resume scans
    subscriptionStatus: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
  },
  { timestamps: true },
);

// This check prevents Next.js from overwriting the model during hot-reloads
export default mongoose.models.User || mongoose.model("User", UserSchema);
