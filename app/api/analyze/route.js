import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Report from "@/models/Report";
import { extractTextFromPDF } from "@/lib/extractText";
import { analyzeResumes } from "@/lib/geminiClient";

export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const jobTitle = formData.get("jobTitle");
    const jobDescription = formData.get("jobDescription");
    const userId = formData.get("userId");
    const files = formData.getAll("resumes");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No resumes uploaded" },
        { status: 400 },
      );
    }

    // 1. Check User Credits
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.credits <= 0 && user.subscriptionStatus === "free") {
      return NextResponse.json({ error: "LIMIT_EXCEEDED" }, { status: 403 });
    }

    // 2. Extract Text from all uploaded PDFs
    const resumesData = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const text = await extractTextFromPDF(buffer);
      resumesData.push({ filename: file.name, text: text });
    }

    // 3. Send to Gemini 2.5 Flash for Analysis
    const analysisResults = await analyzeResumes(jobDescription, resumesData);

    // 4. Save the Result to MongoDB
    const newReport = await Report.create({
      userId: user._id,
      jobTitle,
      jobDescription,
      analysisResults,
    });

    // 5. Deduct 1 credit from the user
    user.credits -= 1;
    await user.save();

    // 6. Return the report to the frontend
    return NextResponse.json(
      { success: true, report: newReport },
      { status: 200 },
    );
  } catch (error) {
    console.log("Analyze Route Error:", error);
    return NextResponse.json(
      { error: "Something went wrong during analysis" },
      { status: 500 },
    );
  }
}
