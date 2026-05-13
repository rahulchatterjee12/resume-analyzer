"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  // 1. Get the session at the top level of the component
  const { data: session } = useSession();

  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 2. Initialize formData here
    const formData = new FormData();
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);

    // 3. Append the real user ID securely here
    if (session?.user?.id) {
      formData.append("userId", session.user.id);
    } else {
      setError("Session expired or loading. Please try logging in again.");
      setLoading(false);
      return;
    }

    files.forEach((file) => {
      formData.append("resumes", file);
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.status === 403 && data.error === "LIMIT_EXCEEDED") {
        router.push("/plans");
        return;
      }

      if (!response.ok) throw new Error(data.error);

      router.push(`/dashboard/reports/${data.report._id}`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center py-12 px-4 sm:px-6 bg-linear-to-b from-zinc-800 via-zinc-950 to-black font-sans text-zinc-100">
      <div className="w-full max-w-3xl mb-8 text-center animate-fade-in-up">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
          New Resume Analysis
        </h1>
        <p className="text-zinc-400">
          Upload your job description and candidate resumes to let AI do the
          heavy lifting.
        </p>
      </div>

      {error && (
        <div className="w-full max-w-3xl mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center animate-pulse">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl space-y-8 bg-white/5 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        {/* Job Title Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
            Job Title
          </label>
          <input
            type="text"
            required
            className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 placeholder:text-zinc-600 text-lg"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>

        {/* Job Description Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
            Job Description (JD)
          </label>
          <textarea
            required
            rows={6}
            className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 placeholder:text-zinc-600 resize-y text-base leading-relaxed"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description, requirements, and responsibilities here..."
          />
        </div>

        {/* File Upload Zone */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
            Upload Resumes (PDFs)
          </label>
          <div className="relative block w-full border-2 border-dashed border-zinc-700 bg-zinc-900/30 rounded-2xl p-8 text-center hover:border-zinc-500 hover:bg-zinc-900/50 transition-all duration-300 group">
            <input
              type="file"
              multiple
              accept="application/pdf"
              required
              onChange={handleFileChange}
              className="w-full text-sm text-zinc-400
                file:mr-4 file:py-3 file:px-6
                file:rounded-full file:border-0
                file:text-sm file:font-bold
                file:bg-white file:text-zinc-950
                hover:file:bg-zinc-200 hover:file:cursor-pointer
                file:transition-all file:duration-300 cursor-pointer"
            />
            {files.length > 0 ? (
              <p className="mt-4 text-sm font-medium text-blue-400">
                {files.length} file{files.length !== 1 ? "s" : ""} ready for
                analysis.
              </p>
            ) : (
              <p className="mt-4 text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                Select multiple PDF files from your device.
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-white text-zinc-950 font-bold text-lg py-4 rounded-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center space-x-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-950"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Analyzing Resumes...</span>
            </>
          ) : (
            <span>Run AI Analysis</span>
          )}
        </button>
      </form>
    </div>
  );
}
