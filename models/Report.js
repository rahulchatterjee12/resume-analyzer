import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    // This array matches the exact JSON structure we will ask Gemini to output
    analysisResults: [
      {
        candidateName: String,
        matchPercentage: Number,
        keySkillsMatched: [String],
        missingSkills: [String],
        briefVerdict: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
