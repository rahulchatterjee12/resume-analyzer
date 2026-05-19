import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // 2. Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Delete any existing OTPs for this email (prevent duplicates)
    await Otp.deleteMany({ email });

    // 4. Hash the OTP before storing (security best practice)
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    // 5. Store the hashed OTP in MongoDB (auto-expires in 5 minutes via TTL index)
    await Otp.create({
      email,
      otp: hashedOtp,
    });

    // 6. Send the OTP email
    await sendOtpEmail(email, otpCode);

    return NextResponse.json(
      { success: true, message: "OTP sent to email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
