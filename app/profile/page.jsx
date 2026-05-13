import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Link from "next/link";

export default async function ProfilePage() {
  // 1. Get the secure session from NextAuth
  const session = await getServerSession(authOptions);

  // 2. If not logged in, boot them to the login page
  if (!session) {
    redirect("/login");
  }

  // 3. Fetch fresh user data from MongoDB
  await dbConnect();
  const dbUser = await User.findById(session.user.id);

  if (!dbUser) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-linear-to-b from-zinc-800 via-zinc-950 to-black font-sans text-zinc-100">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-6 rounded-2xl backdrop-blur-md shadow-2xl">
          <p className="font-semibold text-center">
            Error loading profile data.
          </p>
        </div>
      </div>
    );
  }

  // Helper to extract first initial for the avatar
  const initial = dbUser.name ? dbUser.name.charAt(0).toUpperCase() : "?";
  const isPro = dbUser.subscriptionStatus?.toLowerCase() === "pro";

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-zinc-800 via-zinc-950 to-black font-sans text-zinc-100 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            My Profile
          </h1>
          <p className="text-zinc-400 text-sm">
            Manage your account settings and billing preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-fade-in-up">
          {/* Account Details Card */}
          <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all duration-300">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Account Details
            </h2>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-zinc-300 shadow-inner">
                  {initial}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Full Name
                  </p>
                  <p className="font-medium text-lg text-white">
                    {dbUser.name}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Email Address
                </p>
                <p className="font-medium text-zinc-300">{dbUser.email}</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Member Since
                </p>
                <p className="font-medium text-zinc-300">
                  {new Date(dbUser.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription & Credits Card */}
          <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            {/* Subtle glow if PRO */}
            {isPro && (
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
            )}

            <div className="relative">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                </svg>
                Plan & Usage
              </h2>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Current Plan
                  </p>
                  {isPro ? (
                    <span className="inline-block bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text font-black text-2xl tracking-widest uppercase">
                      PRO
                    </span>
                  ) : (
                    <span className="font-bold text-2xl tracking-widest uppercase text-zinc-300">
                      FREE
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Scans Remaining
                  </p>
                  <p className="font-light text-4xl text-white flex justify-end items-center h-8">
                    {isPro ? "∞" : dbUser.credits}
                  </p>
                </div>
              </div>
            </div>

            {/* Upgrade CTA for Free Users */}
            {!isPro && (
              <div className="mt-4 bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-50"></div>
                <div className="relative">
                  <p className="text-sm text-zinc-300 mb-4 font-medium">
                    Unlock unlimited AI shortlisting and bulk Excel exports.
                  </p>
                  <Link
                    href="/plans"
                    className="block w-full bg-white text-zinc-950 text-center font-bold text-sm py-3 rounded-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            )}

            {/* Pro Status indicator */}
            {isPro && (
              <div className="mt-4 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm font-medium text-emerald-400">
                  Your account is fully upgraded.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
