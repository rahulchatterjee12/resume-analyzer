"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-zinc-800 via-zinc-950 to-black px-6 py-20 font-sans text-zinc-100">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-4xl mb-20 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Hire Smarter with{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-300">
            AI-Powered Shortlisting
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Stop reading hundreds of resumes manually. Upload your Job Description
          and applicant PDFs, and let Gemini 2.5 evaluate, rank, and export the
          perfect candidates directly to Excel.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
          {/* Redirect to Signup if not logged in else redirect to dashboard */}
          <Link
            href={status === "authenticated" ? "/dashboard" : "/signup"}
            className="bg-white text-zinc-950 px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center"
          >
            Try it Free
          </Link>
          <Link
            href="https://github.com/rahulchatterjee12/resume-analyzer"
            target="_blank"
            className="bg-white/5 border border-white/10 text-white backdrop-blur-md px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center"
          >
            View Source Code
          </Link>
        </div>
      </div>

      {/* Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Feature 1 */}
        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-left">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-3 text-white">Lightning Fast</h3>
          <p className="text-zinc-400 leading-relaxed">
            Parses complex PDF resumes and returns actionable JSON metrics in
            seconds.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-left">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-3 text-white">Instant Exports</h3>
          <p className="text-zinc-400 leading-relaxed">
            One-click download to Excel (.xlsx) for easy sharing with your
            hiring team.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-left">
          <div className="text-3xl mb-4">💳</div>
          <h3 className="text-xl font-bold mb-3 text-white">Built to Scale</h3>
          <p className="text-zinc-400 leading-relaxed">
            Integrated credit system with Razorpay automated billing for power
            users.
          </p>
        </div>
      </div>
    </div>
  );
}
