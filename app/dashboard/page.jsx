"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => { setFiles(Array.from(e.target.files)); };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf"));
    }
  };

  const removeFile = (index) => { setFiles(files.filter((_, i) => i !== index)); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const formData = new FormData();
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);
    if (session?.user?.id) {
      formData.append("userId", session.user.id);
    } else {
      setError("Session expired or loading. Please try logging in again."); setLoading(false); return;
    }
    files.forEach((file) => formData.append("resumes", file));
    try {
      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await response.json();
      if (response.status === 403 && data.error === "LIMIT_EXCEEDED") { router.push("/plans"); return; }
      if (!response.ok) throw new Error(data.error);
      router.push(`/dashboard/reports/${data.report._id}`);
    } catch (err) { setError(err.message || "Something went wrong."); }
    finally { setLoading(false); }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center py-12 px-4 sm:px-6 bg-zinc-950 font-sans text-zinc-100 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      <motion.div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative w-full max-w-3xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">New Resume Analysis</h1>
          <p className="text-zinc-500 text-sm">Upload your job description and candidate resumes to let AI do the heavy lifting.</p>
        </motion.div>

        {/* Step Indicators */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center justify-between mb-10">
          <StepPill number="1" label="Job Details" active />
          <div className="flex-1 h-px bg-white/[0.06] mx-3"></div>
          <StepPill number="2" label="Upload PDFs" active={files.length > 0} />
          <div className="flex-1 h-px bg-white/[0.06] mx-3"></div>
          <StepPill number="3" label="Analyze" active={loading} />
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-sm font-medium text-center flex items-center justify-center space-x-2 overflow-hidden">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass-card p-8 sm:p-10 space-y-8">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Job Title</label>
            <input type="text" required className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300 placeholder:text-zinc-600 text-base" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Job Description (JD)</label>
            <textarea required rows={5} className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300 placeholder:text-zinc-600 resize-y text-sm leading-relaxed" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description, requirements, and responsibilities here..." />
          </div>

          {/* Upload Zone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Upload Resumes (PDFs)</label>
            <motion.div
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              animate={dragActive ? { borderColor: "rgba(96,165,250,0.5)", scale: 1.01 } : { borderColor: "rgba(255,255,255,0.08)", scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragActive ? "bg-blue-500/[0.05]" : "bg-white/[0.02] hover:bg-white/[0.03]"}`}
            >
              <input type="file" multiple accept="application/pdf" required={files.length === 0} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="flex flex-col items-center">
                <motion.div animate={dragActive ? { y: -5 } : { y: 0 }} className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${dragActive ? "bg-blue-500/20 text-blue-400" : "bg-white/[0.05] text-zinc-500"}`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </motion.div>
                <p className="text-sm text-zinc-400 mb-1"><span className="text-blue-400 font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-zinc-600">PDF files only</p>
              </div>
            </motion.div>

            {/* File List */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-2 overflow-hidden">
                  <p className="text-xs font-medium text-zinc-500 ml-1">{files.length} file{files.length !== 1 ? "s" : ""} selected</p>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {files.map((file, index) => (
                      <motion.div key={file.name + index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ delay: index * 0.05 }} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] group">
                        <div className="flex items-center space-x-3 min-w-0">
                          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          <span className="text-sm text-zinc-300 truncate">{file.name}</span>
                          <span className="text-xs text-zinc-600 shrink-0">{formatFileSize(file.size)}</span>
                        </div>
                        <button type="button" onClick={() => removeFile(index)} className="text-zinc-600 hover:text-red-400 transition-colors ml-3 shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit */}
          <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white font-semibold text-base py-4 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2">
            {loading ? (
              <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Analyzing Resumes...</span></>
            ) : (
              <><svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg><span>Run AI Analysis</span></>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

function StepPill({ number, label, active }) {
  return (
    <div className="flex items-center space-x-2.5">
      <motion.div
        animate={active ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.4 }}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
          active ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30" : "bg-white/[0.05] text-zinc-600 border border-white/[0.08]"
        }`}
      >{number}</motion.div>
      <span className={`text-xs font-medium hidden sm:block transition-colors duration-300 ${active ? "text-zinc-200" : "text-zinc-600"}`}>{label}</span>
    </div>
  );
}
