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
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 font-sans text-zinc-100 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-white/[0.06] animate-fade-in-up gap-4 sm:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              My Reports
            </h1>
            <p className="text-zinc-500 text-sm">
              Review and manage your AI-generated candidate shortlists.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="group inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:from-blue-400 hover:to-indigo-500 active:scale-[0.97] transition-all duration-300 shadow-lg shadow-blue-500/20 whitespace-nowrap"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            New Scan
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="w-full glass-card p-16 text-center animate-fade-in-up-delay-1">
            <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              No reports yet
            </h3>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm">
              You haven&apos;t generated any resume reports yet. Upload a job
              description and some resumes to get started.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors group"
            >
              Run your first AI analysis
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up-delay-1">
            {reports.map((report) => (
              <div
                key={report._id.toString()}
                className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex justify-between items-start mb-5 gap-3">
                    <h2
                      className="text-lg font-bold text-white truncate"
                      title={report.jobTitle}
                    >
                      {report.jobTitle}
                    </h2>
                    <span className="bg-blue-500/10 border border-blue-500/15 text-blue-400 text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                      {report.analysisResults.length} Candidates
                    </span>
                  </div>

                  <div className="text-sm text-zinc-500 mb-6 space-y-2.5">
                    <div className="flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-2 text-zinc-600"
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
                      <span className="text-xs">
                        {new Date(report.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-2 text-zinc-600"
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
                      <span className="text-xs truncate">
                        Top:{" "}
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
                  className="block w-full text-center bg-white/[0.04] border border-white/[0.06] text-zinc-300 py-2.5 rounded-lg hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-white transition-all duration-300 font-medium text-sm group-hover:shadow-lg"
                >
                  View Report →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
