import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import Link from "next/link";

export default async function ReportsListPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const reports = await Report.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-zinc-800 via-zinc-950 to-black font-sans text-zinc-100">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-white/10 animate-fade-in-up gap-4 sm:gap-0">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              My Reports
            </h1>
            <p className="text-zinc-400 text-sm">
              Review and manage your AI-generated candidate shortlists.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-white text-zinc-950 px-6 py-3 rounded-full font-bold text-sm hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] whitespace-nowrap"
          >
            + New Scan
          </Link>
        </div>
        {reports.length === 0 ? (
          <div className="w-full bg-white/5 backdrop-blur-2xl p-12 sm:p-16 text-center rounded-3xl border border-dashed border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-fade-in-up">
            <div className="text-5xl mb-6 opacity-80">📄</div>
            <h3 className="text-xl font-bold text-white mb-3">
              No reports found
            </h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              You haven't generated any resume reports yet. Upload a job
              description and some resumes to get started.
            </p>
            <Link
              href="/dashboard"
              className="text-white font-semibold hover:text-zinc-300 hover:underline decoration-white/30 underline-offset-4 transition-all"
            >
              Run your first AI analysis &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {reports.map((report) => (
              <div
                key={report._id.toString()}
                className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex justify-between items-start mb-5 gap-4">
                    <h2
                      className="text-xl font-bold text-white truncate"
                      title={report.jobTitle}
                    >
                      {report.jobTitle}
                    </h2>
                    <span className="bg-white/10 border border-white/5 text-white text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
                      {report.analysisResults.length} Candidates
                    </span>
                  </div>

                  <div className="text-sm text-zinc-400 mb-8 space-y-3">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <span>
                        Scanned on:{" "}
                        <span className="text-zinc-300">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        ></path>
                      </svg>
                      <span className="truncate">
                        Top Match:{" "}
                        <span className="text-zinc-300 font-medium">
                          {[...report.analysisResults].sort(
                            (a, b) => b.matchPercentage - a.matchPercentage,
                          )[0]?.candidateName || "N/A"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/dashboard/reports/${report._id.toString()}`}
                  className="block w-full text-center bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 font-semibold shadow-sm"
                >
                  View Full Report
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
