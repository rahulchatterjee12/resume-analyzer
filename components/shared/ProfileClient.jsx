"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfileClient({ dbUser }) {
  const initial = dbUser.name ? dbUser.name.charAt(0).toUpperCase() : "?";
  const isPro = dbUser.subscriptionStatus?.toLowerCase() === "pro";
  const maxFreeCredits = 5;
  const creditsUsed = maxFreeCredits - (dbUser.credits || 0);
  const usagePercentage = Math.min((creditsUsed / maxFreeCredits) * 100, 100);

  // Animate the progress bar width
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setBarWidth(usagePercentage), 300);
    return () => clearTimeout(timer);
  }, [usagePercentage]);

  // Animate credit count
  const [displayCredits, setDisplayCredits] = useState(0);
  useEffect(() => {
    const target = isPro ? 0 : (dbUser.credits || 0);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 20));
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayCredits(target);
        clearInterval(timer);
      } else {
        setDisplayCredits(current);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [dbUser.credits, isPro]);

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 font-sans text-zinc-100 flex justify-center relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20"></div>
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-indigo-600/[0.07] rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            My Profile
          </h1>
          <p className="text-zinc-500 text-sm">
            Manage your account settings and billing.
          </p>
        </motion.div>

        {/* Profile Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-8 sm:p-10 mb-6 relative overflow-hidden"
        >
          {/* Background glow for Pro */}
          {isPro && (
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
          )}

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <motion.div
              className="relative shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {/* Animated gradient ring for Pro */}
              {isPro && (
                <motion.div
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-80"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={{ borderRadius: "50%" }}
                />
              )}
              <div
                className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl ${
                  isPro
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-800 text-zinc-300 border-2 border-white/[0.08]"
                }`}
              >
                {initial}
              </div>
              {/* Pro badge */}
              {isPro && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-xs shadow-lg border-2 border-zinc-950"
                >
                  ✦
                </motion.div>
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">{dbUser.name}</h2>
                {isPro ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                    className="inline-flex items-center self-center sm:self-auto px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/15 to-violet-500/15 border border-blue-500/20 text-xs font-bold text-blue-300 uppercase tracking-wider"
                  >
                    <span className="mr-1">✨</span> Pro Member
                  </motion.span>
                ) : (
                  <span className="inline-flex items-center self-center sm:self-auto px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Free Tier
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-sm mb-0.5">{dbUser.email}</p>
              <p className="text-zinc-600 text-xs">
                Joined {new Date(dbUser.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usage & Credits Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-7 relative overflow-hidden"
          >
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-6 flex items-center">
              <svg className="w-4 h-4 mr-2 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Usage & Credits
            </h3>

            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs text-zinc-600 mb-1">Scans remaining</p>
                <div className="text-4xl font-bold text-white leading-none">
                  {isPro ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                      className="gradient-text"
                    >
                      ∞
                    </motion.span>
                  ) : (
                    <span>{displayCredits}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-600 mb-1">Plan</p>
                <p className={`text-lg font-bold ${isPro ? "gradient-text" : "text-zinc-400"}`}>
                  {isPro ? "PRO" : "FREE"}
                </p>
              </div>
            </div>

            {/* Usage bar (free users) */}
            {!isPro && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-zinc-600 mb-2">
                  <span>{creditsUsed} of {maxFreeCredits} used</span>
                  <span>{Math.round(usagePercentage)}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800/60 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      usagePercentage >= 80
                        ? "bg-gradient-to-r from-red-500 to-rose-400"
                        : usagePercentage >= 50
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                        : "bg-gradient-to-r from-blue-500 to-indigo-400"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Upgrade CTA for free users */}
            {!isPro && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-r from-blue-600/[0.08] to-violet-600/[0.08] p-5 rounded-xl border border-blue-500/10"
              >
                <p className="text-sm text-zinc-400 mb-3.5">
                  Unlock unlimited scans & bulk exports.
                </p>
                <Link
                  href="/plans"
                  className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm py-2.5 rounded-lg hover:from-blue-400 hover:to-indigo-500 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-blue-500/15 group"
                >
                  <span>Upgrade to Pro</span>
                  <svg className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            )}

            {/* Pro status */}
            {isPro && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-emerald-500/[0.06] p-4 rounded-xl border border-emerald-500/10 flex items-center justify-center space-x-2"
              >
                <motion.svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, delay: 0.6 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
                <span className="text-sm font-medium text-emerald-400">Unlimited access active</span>
              </motion.div>
            )}
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-7"
          >
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-6 flex items-center">
              <svg className="w-4 h-4 mr-2 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Quick Actions
            </h3>

            <div className="space-y-3">
              <ActionLink
                href="/dashboard"
                icon="M12 4v16m8-8H4"
                label="Start New Analysis"
                description="Upload resumes and run AI evaluation"
                color="blue"
              />
              <ActionLink
                href="/dashboard/reports"
                icon="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                label="View Past Reports"
                description="Access your analysis history"
                color="indigo"
              />
              <ActionLink
                href="/plans"
                icon="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                label="View Plans"
                description={isPro ? "You're on the Pro plan" : "Compare Free vs Pro"}
                color="violet"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ActionLink({ href, icon, label, description, color }) {
  const colorMap = {
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/10 group-hover:border-blue-500/20",
    indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/10 group-hover:border-indigo-500/20",
    violet: "from-violet-500/10 to-violet-500/5 border-violet-500/10 group-hover:border-violet-500/20",
  };
  const iconColorMap = {
    blue: "text-blue-400",
    indigo: "text-indigo-400",
    violet: "text-violet-400",
  };

  return (
    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link
        href={href}
        className={`flex items-center p-4 rounded-xl bg-gradient-to-r ${colorMap[color]} border transition-all duration-300 group`}
      >
        <div className={`w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center mr-4 shrink-0 ${iconColorMap[color]}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-zinc-500 truncate">{description}</p>
        </div>
        <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  );
}
