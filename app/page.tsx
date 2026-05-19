"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/MotionWrappers";

export default function LandingPage() {
  const { status } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 font-sans text-zinc-100 overflow-hidden">
      {/* ===== Hero Section ===== */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-28 pb-32 sm:pt-36 sm:pb-40">
        {/* Background grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-60"></div>

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"
          animate={{ y: [0, -25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[150px] pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-xs font-medium text-zinc-400">Powered by Gemini 2.5 AI</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <div className="relative text-center max-w-4xl">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Hire Smarter with{" "}
            <span className="gradient-text-animated">
              AI-Powered Shortlisting
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Stop reading hundreds of resumes manually. Upload your Job Description
            and applicant PDFs — our AI evaluates, ranks, and exports the
            perfect candidates to Excel in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={status === "authenticated" ? "/dashboard" : "/signup"}
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow duration-300 w-full sm:w-auto overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Start Free Analysis</span>
                <svg className="relative w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="https://github.com/rahulchatterjee12/resume-analyzer"
                target="_blank"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base text-zinc-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white transition-all duration-300 w-full sm:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Source
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-10 sm:py-12">
          <StaggerContainer staggerDelay={0.1} delay={0.2} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StaggerItem><StatItem value="500+" label="Resumes Analyzed" /></StaggerItem>
            <StaggerItem><StatItem value="98%" label="Accuracy Rate" /></StaggerItem>
            <StaggerItem><StatItem value="< 30s" label="Per Resume" /></StaggerItem>
            <StaggerItem><StatItem value="50+" label="Happy Users" /></StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ===== Feature Cards ===== */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="absolute inset-0 dot-pattern opacity-40"></div>

        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Everything you need to hire <span className="gradient-text">faster</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Powered by Google&apos;s Gemini AI, our platform delivers accurate, unbiased candidate evaluations at scale.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={0}>
              <FeatureCard
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                iconColor="from-amber-400 to-orange-500"
                shadowColor="shadow-amber-500/20"
                title="Lightning Fast"
                description="Parses complex PDF resumes and returns actionable JSON metrics in under 30 seconds per batch."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <FeatureCard
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                iconColor="from-emerald-400 to-teal-500"
                shadowColor="shadow-emerald-500/20"
                title="Instant Exports"
                description="One-click download to Excel (.xlsx) with match scores, skills, and verdicts for easy sharing."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <FeatureCard
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />}
                iconColor="from-blue-400 to-indigo-500"
                shadowColor="shadow-blue-500/20"
                title="Built to Scale"
                description="Integrated credit system with Razorpay automated billing. Free tier included for everyone."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="relative py-24 sm:py-32 px-6 bg-white/[0.01] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              How it works
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Three simple steps to find your perfect candidates.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-violet-500/30"></div>

            <ScrollReveal delay={0}><StepCard step="01" title="Upload Resumes" description="Upload your job description and candidate PDF resumes. Supports bulk uploads." /></ScrollReveal>
            <ScrollReveal delay={0.15}><StepCard step="02" title="AI Analyzes" description="Gemini 2.5 evaluates each candidate against your requirements with precision." /></ScrollReveal>
            <ScrollReveal delay={0.3}><StepCard step="03" title="Export Results" description="Get ranked results with match scores and download everything as an Excel file." /></ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <ScrollReveal className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
            Ready to transform your hiring process?
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Join hundreds of recruiters who&apos;ve already cut their screening time by 90%. Start free — no credit card required.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              href={status === "authenticated" ? "/dashboard" : "/signup"}
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow duration-300 overflow-hidden relative"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">Get Started for Free</span>
              <svg className="relative w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/[0.06] bg-black/40 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-400">ResumeSort<span className="text-blue-400">AI</span></span>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} ResumeSort AI. Built with Next.js & Gemini.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="https://github.com/rahulchatterjee12/resume-analyzer" target="_blank" className="text-zinc-500 hover:text-zinc-300 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== Sub-Components ===== */

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
      <div className="text-xs sm:text-sm text-zinc-500 font-medium">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, iconColor, shadowColor, title, description }: { icon: React.ReactNode; iconColor: string; shadowColor: string; title: string; description: string }) {
  return (
    <motion.div
      className="glass-card p-8 h-full"
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center text-white mb-5 shadow-lg ${shadowColor}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="relative text-center">
      <motion.div
        className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center mb-6 shadow-lg"
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <span className="text-xl font-bold gradient-text">{step}</span>
      </motion.div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
    </div>
  );
}
