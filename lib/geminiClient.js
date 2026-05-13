import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeResumes(jobDescription, resumesData) {
  // Use the fast and cost-effective 2.5 Flash model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // Force the model to return JSON
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
    You are an expert technical HR Recruiter. 
    Your task is to evaluate a batch of candidate resumes against the provided Job Description (JD).

    CRITICAL RULES TO PREVENT DATA MIXING:
    1. ISOLATION: Evaluate each candidate strictly in isolation. Do not mix skills, names, or experiences between different candidates.
    2. NO HALLUCINATIONS: Only extract skills and facts explicitly stated in a candidate's specific resume text. Do not guess, assume, or infer information.
    3. NAME EXTRACTION: If a candidate's name is not immediately clear from their text, use their filename as the "candidateName".

    Job Description:
    ${jobDescription}

    Candidate Resumes to Evaluate:
    ${JSON.stringify(resumesData)}

    You MUST return a clean JSON array. Each object in the array represents ONE evaluated candidate and must contain EXACTLY these keys:
    - "candidateName": (String) The specific candidate's name or filename.
    - "matchPercentage": (Number) Between 0 and 100, based on objective skill matches.
    - "keySkillsMatched": (Array of Strings) Required JD skills that are EXPLICITLY found in THIS candidate's resume.
    - "missingSkills": (Array of Strings) Required JD skills that are completely missing from THIS candidate's resume.
    - "briefVerdict": (String) Max 2 sentences summarizing why this specific candidate is or isn't a fit.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText); // Return the clean JSON array
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to analyze resumes with AI.");
  }
}
