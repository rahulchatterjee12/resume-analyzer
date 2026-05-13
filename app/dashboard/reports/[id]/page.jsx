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
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black font-sans">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-6 rounded-2xl backdrop-blur-md shadow-2xl">
          <h2 className="text-xl font-bold mb-2">Report Not Found</h2>
          <p className="text-sm opacity-80">
            This analysis may have been deleted or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

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
        border: "border-emerald-500/20",
        bar: "bg-emerald-400",
      };
    if (score >= 50)
      return {
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        bar: "bg-amber-400",
      };
    return {
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      bar: "bg-red-400",
    };
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-zinc-800 via-zinc-950 to-black font-sans text-zinc-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-white/10 animate-fade-in-up gap-6 sm:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Analysis Results
            </h1>
            <div className="flex items-center text-zinc-400 text-sm font-medium">
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
              <span className="text-zinc-200 ml-1.5">{report.jobTitle}</span>
            </div>
          </div>

          <div className="w-full sm:w-auto relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative">
              <ExcelExportBtn
                data={exportData}
                fileName={`${report.jobTitle}_Resumes`}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal">
              {/* Table Head */}
              <thead>
                <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  <th className="p-5 pl-8 w-1/6">Candidate Name</th>
                  <th className="p-5 w-1/6">Match %</th>
                  <th className="p-5 w-1/4">Matched Skills</th>
                  <th className="p-5 w-1/4">Missing Skills</th>
                  <th className="p-5 pr-8 w-1/5">Verdict</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/5">
                {report.analysisResults
                  .sort((a, b) => b.matchPercentage - a.matchPercentage) // Sort highest match first
                  .map((candidate, index) => {
                    const theme = getScoreTheme(candidate.matchPercentage);

                    return (
                      <tr
                        key={index}
                        className="hover:bg-white/3 transition-colors duration-200 group"
                      >
                        {/* Candidate Name */}
                        <td className="p-5 pl-8 font-semibold text-white">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs text-zinc-400 mr-3 group-hover:border-zinc-500 transition-colors">
                              {candidate.candidateName.charAt(0).toUpperCase()}
                            </div>
                            {candidate.candidateName}
                          </div>
                        </td>

                        {/* Match Percentage */}
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}
                            >
                              {candidate.matchPercentage}%
                            </span>
                            <div className="hidden sm:block w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${theme.bar} transition-all duration-1000 ease-out`}
                                style={{
                                  width: `${candidate.matchPercentage}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Matched Skills */}
                        <td className="p-5">
                          <div className="flex flex-wrap gap-1.5">
                            {candidate.keySkillsMatched.map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-[11px] rounded-md font-medium whitespace-nowrap"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Missing Skills */}
                        <td className="p-5">
                          <div className="flex flex-wrap gap-1.5">
                            {candidate.missingSkills.length > 0 ? (
                              candidate.missingSkills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-red-500/5 border border-red-500/10 text-red-400/80 text-[11px] rounded-md font-medium whitespace-nowrap"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-500 text-xs italic">
                                None
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Verdict */}
                        <td className="p-5 pr-8">
                          <p className="text-sm text-zinc-400 leading-relaxed max-w-xs line-clamp-2 hover:line-clamp-none transition-all duration-300">
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
