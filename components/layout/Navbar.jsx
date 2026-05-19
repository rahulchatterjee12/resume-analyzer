"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`sticky top-0 z-50 w-full font-sans transition-all duration-500 ${
          scrolled
            ? "bg-zinc-950/90 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/20"
            : "bg-black border-b border-transparent"
        }`}
      >
        {/* Animated gradient line at the bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(59,130,246,0.4), transparent)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <motion.div
                className="relative"
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
                  <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300" />
              </motion.div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white group-hover:text-blue-100 transition-colors duration-300">Resume</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Sort</span>
                <span className="text-zinc-500 font-medium text-sm ml-0.5">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              {status === "authenticated" && (
                <div className="flex items-center bg-white/[0.03] rounded-full px-1.5 py-1 border border-white/[0.06] mr-4">
                  <NavPill href="/dashboard" active={pathname === "/dashboard"}>
                    <svg className="w-3.5 h-3.5 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    New Scan
                  </NavPill>
                  <NavPill href="/dashboard/reports" active={pathname?.startsWith("/dashboard/reports")}>
                    <svg className="w-3.5 h-3.5 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Reports
                  </NavPill>
                  <NavPill href="/plans" active={pathname === "/plans"}>
                    <svg className="w-3.5 h-3.5 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Pricing
                  </NavPill>
                </div>
              )}

              {/* Auth Section */}
              <div className="flex items-center space-x-2">
                {status === "loading" ? (
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-zinc-800/80 animate-pulse rounded-full"></div>
                    <div className="h-8 w-16 bg-zinc-800/80 animate-pulse rounded-lg"></div>
                  </div>
                ) : status === "authenticated" ? (
                  <div className="flex items-center space-x-1">
                    {/* Profile button */}
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/[0.05] transition-all duration-300 group"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-500/20">
                          {session?.user?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-950"></div>
                      </div>
                      <span className="text-sm text-zinc-300 group-hover:text-white font-medium truncate max-w-20 transition-colors">
                        {session?.user?.name?.split(" ")[0] || "Profile"}
                      </span>
                    </Link>

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-xs text-zinc-600 hover:text-red-400 p-2 rounded-lg font-medium transition-all duration-300 hover:bg-red-500/[0.06]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/login"
                      className="text-sm text-zinc-400 hover:text-white font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/[0.05]"
                    >
                      Log in
                    </Link>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href="/signup"
                        className="relative inline-flex items-center bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow duration-300 overflow-hidden group"
                      >
                        {/* Shimmer effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative">Get Started</span>
                        <svg className="relative w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col justify-center items-center w-5 h-5">
                <motion.span
                  className="block w-5 h-[2px] bg-zinc-300 rounded-full"
                  animate={mobileOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-5 h-[2px] bg-zinc-300 rounded-full mt-1.5"
                  animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-5 h-[2px] bg-zinc-300 rounded-full mt-1.5"
                  animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-72 bg-zinc-950 border-l border-white/[0.06] md:hidden"
            >
              <div className="p-5">
                {/* Close */}
                <div className="flex justify-end mb-6">
                  <motion.button
                    onClick={() => setMobileOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                  }}
                  className="space-y-1"
                >
                  {status === "authenticated" && (
                    <>
                      <MobileLink href="/dashboard" icon="M12 4v16m8-8H4" label="New Scan" active={pathname === "/dashboard"} />
                      <MobileLink href="/dashboard/reports" icon="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" label="Reports" active={pathname?.startsWith("/dashboard/reports")} />
                      <MobileLink href="/plans" icon="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" label="Pricing" active={pathname === "/plans"} />
                    </>
                  )}

                  <div className="pt-4 mt-3 border-t border-white/[0.06] space-y-1">
                    {status === "authenticated" ? (
                      <>
                        <MobileLink href="/profile" active={pathname === "/profile"} label={session?.user?.name?.split(" ")[0] || "Profile"} icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}>
                          <button
                            onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                            className="flex items-center space-x-3 w-full text-left text-sm text-red-400/80 hover:text-red-300 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-red-500/[0.06]"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Sign out</span>
                          </button>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <MobileLink href="/login" label="Log in" icon="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }} className="pt-2">
                          <Link
                            href="/signup"
                            className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/20"
                          >
                            Get Started Free
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ===== Desktop Nav Pill =====
function NavPill({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center text-xs font-medium px-3.5 py-2 rounded-full transition-all duration-300 ${
        active
          ? "text-white bg-white/[0.1]"
          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeNavPill"
          className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.1]"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          style={{ zIndex: -1 }}
        />
      )}
    </Link>
  );
}

// ===== Mobile Nav Link =====
function MobileLink({ href, icon, label, active = false }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
      }}
    >
      <Link
        href={href}
        className={`flex items-center space-x-3 text-sm font-medium px-4 py-3 rounded-xl transition-all duration-300 ${
          active
            ? "text-white bg-white/[0.06] border border-white/[0.06]"
            : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
        </svg>
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}
