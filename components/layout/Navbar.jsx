"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/85 backdrop-blur-2xl border-b border-white/10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-300 hover:opacity-80 transition-opacity"
            >
              ResumeSort AI
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-6 overflow-x-auto">
            {status === "authenticated" && (
              <div className="hidden md:flex items-center space-x-6 mr-4">
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-400 hover:text-white font-medium transition-colors duration-300"
                >
                  New Scan
                </Link>
                <Link
                  href="/dashboard/reports"
                  className="text-sm text-zinc-400 hover:text-white font-medium transition-colors duration-300"
                >
                  History
                </Link>
                <Link
                  href="/plans"
                  className="text-sm text-zinc-400 hover:text-white font-medium transition-colors duration-300"
                >
                  Pricing
                </Link>
              </div>
            )}

            {/* Auth Section */}
            <div className="flex items-center space-x-3 md:space-x-5 md:border-l md:border-white/10 md:pl-6 ml-2">
              {status === "loading" ? (
                <div className="flex space-x-3">
                  <div className="h-8 w-20 bg-zinc-800 animate-pulse rounded-full"></div>
                </div>
              ) : status === "authenticated" ? (
                <>
                  <Link
                    href="/profile"
                    className="text-sm text-white hover:text-zinc-300 font-semibold transition-colors truncate max-w-25 sm:max-w-37.5"
                  >
                    {session?.user?.name?.split(" ")[0] || "Profile"}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-full font-medium transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-zinc-400 hover:text-white font-medium transition-colors duration-300 hidden sm:block"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-white text-zinc-950 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-zinc-200 scale-[0.98] hover:scale-[1] active:scale-[0.98] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] whitespace-nowrap"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
