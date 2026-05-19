import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import ExcelExportBtn from "@/components/shared/ExcelExportBtn";

export default async function ReportPage({ params }) {
  await dbConnect();

  // unwrap params first
  const { id } = await params;

  // Fetch the specific report by ID
  const report = await Report.findById(id);

  if (!report) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-950 font-sans">
        <div className="glass-card p-8 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Report Not Found</h2>
          <p className="text-sm text-zinc-500">
            This analysis may have been deleted or doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Sort results by match percentage
  const sortedResults = [...report.analysisResults].sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  );

  // Calculate summary stats
  const totalCandidates = sortedResults.length;
  const avgMatch = totalCandidates > 0
    ? Math.round(sortedResults.reduce((sum, c) => sum + c.matchPercentage, 0) / totalCandidates)
    : 0;
  const topScore = totalCandidates > 0 ? sortedResults[0].matchPercentage : 0;
  const topScorer = totalCandidates > 0 ? sortedResults[0].candidateName : "N/A";

  // Format the data specifically for the Excel Export
  const exportData = report.analysisResults.map((candidate) => ({
    "Candidate Name": candidate.candidateName,
    "Match %": candidate.matchPercentage,
    "Key Skills Matched": candidate.keySkillsMatched.join(", "),
    "Missing Skills": candidate.missingSkills.join(", "),
    Verdict: candidate.briefVerdict,
  }));

  // Helper function for dynamic badge styling based on score
  const getScoreTheme = (score) => {
    if (score >= 75)
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/15",
        bar: "bg-emerald-400",
      };
    if (score >= 50)
      return {
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/15",
        bar: "bg-amber-400",
      };
    return {
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/15",
      bar: "bg-red-400",
    };
  };

  const getRankBadge = (index) => {
    if (index === 0) return { emoji: "🥇", bg: "bg-amber-500/10", border: "border-amber-500/15" };
    if (index === 1) return { emoji: "🥈", bg: "bg-zinc-400/10", border: "border-zinc-400/15" };
    if (index === 2) return { emoji: "🥉", bg: "bg-orange-500/10", border: "border-orange-500/15" };
    return null;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 font-sans text-zinc-100 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-15"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-white/[0.06] animate-fade-in-up gap-6 sm:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Analysis Results
            </h1>
            <div className="flex items-center text-zinc-500 text-sm font-medium">
              <svg
                className="w-4 h-4 mr-2 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              Role:{" "}
              <span className="text-zinc-300 ml-1.5">{report.jobTitle}</span>
            </div>
          </div>

          <ExcelExportBtn
            data={exportData}
            fileName={`${report.jobTitle}_Resumes`}
            className="w-full sm:w-auto"
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in-up-delay-1">
          <SummaryCard label="Total Candidates" value={totalCandidates} />
          <SummaryCard label="Average Match" value={`${avgMatch}%`} />
          <SummaryCard label="Top Score" value={`${topScore}%`} highlight />
          <SummaryCard label="Top Scorer" value={topScorer} />
        </div>

        {/* Data Table Container */}
        <div className="glass-card overflow-hidden animate-fade-in-up-delay-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal">
              {/* Table Head */}
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                  <th className="p-4 pl-6 w-8">#</th>
                  <th className="p-4 w-1/6">Candidate</th>
                  <th className="p-4 w-1/6">Match</th>
                  <th className="p-4 w-1/4">Matched Skills</th>
                  <th className="p-4 w-1/4">Missing Skills</th>
                  <th className="p-4 pr-6 w-1/5">Verdict</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/[0.04]">
                {sortedResults.map((candidate, index) => {
                  const theme = getScoreTheme(candidate.matchPercentage);
                  const rank = getRankBadge(index);

                  return (
                    <tr
                      key={index}
                      className="hover:bg-white/[0.02] transition-colors duration-200 group"
                    >
                      {/* Rank */}
                      <td className="p-4 pl-6">
                        {rank ? (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${rank.bg} border ${rank.border} text-sm`}>
                            {rank.emoji}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-600 font-medium ml-1.5">{index + 1}</span>
                        )}
                      </td>

                      {/* Candidate Name */}
                      <td className="p-4 font-medium text-white">
                        <div className="flex items-center">
                          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/[0.06] flex items-center justify-center text-[10px] text-zinc-400 font-bold mr-3 group-hover:border-zinc-600 transition-colors">
                            {candidate.candidateName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm">{candidate.candidateName}</span>
                        </div>
                      </td>

                      {/* Match Percentage */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}
                          >
                            {candidate.matchPercentage}%
                          </span>
                          <div className="hidden sm:block w-16 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${theme.bar}`}
                              style={{
                                width: `${candidate.matchPercentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Matched Skills */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.keySkillsMatched.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-emerald-500/[0.07] border border-emerald-500/10 text-emerald-400/80 text-[11px] rounded-md font-medium whitespace-nowrap"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Missing Skills */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.missingSkills.length > 0 ? (
                            candidate.missingSkills.map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-red-500/[0.07] border border-red-500/10 text-red-400/80 text-[11px] rounded-md font-medium whitespace-nowrap"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-emerald-500/60 text-xs italic">
                              All matched ✓
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Verdict */}
                      <td className="p-4 pr-6">
                        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs line-clamp-2 hover:line-clamp-none transition-all duration-300 cursor-pointer">
                          {candidate.briefVerdict}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, highlight = false }) {
  return (
    <div className={`glass-card p-5 text-center ${highlight ? "border-blue-500/15" : ""}`}>
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1.5">{label}</p>
      <p className={`text-xl font-bold truncate ${highlight ? "gradient-text" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
