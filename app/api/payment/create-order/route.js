import { NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpayClient";
import dbConnect from "@/lib/dbConnect";

// Change "export default async function" to "export async function POST"
export async function POST(request) {
  try {
    await dbConnect();

    const amount = 500; // ₹500

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
