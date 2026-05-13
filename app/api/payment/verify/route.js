import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(request) {
  try {
    await dbConnect();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = await request.json();

    // 1. Recreate the signature using your Secret Key
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // 2. Compare the generated signature with the one from the frontend
    if (expectedSignature === razorpay_signature) {
      // 3. Update the user to 'pro' and give them high credits
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          subscriptionStatus: "pro",
          credits: 99999, // Set to a very high number for Pro users
        },
        { new: true },
      );

      if (!updatedUser) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { success: true, message: "Payment verified and account upgraded!" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
