"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Call NextAuth's credentials provider
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-zinc-800 via-zinc-950 to-black p-4 font-sans text-zinc-100">
      <div className="w-full max-w-md p-10 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-zinc-400 text-sm">
            Sign in to continue to your dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 placeholder:text-zinc-600"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 placeholder:text-zinc-600"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-white text-zinc-950 font-bold text-base py-3.5 rounded-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Log In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-white font-semibold hover:text-zinc-300 hover:underline decoration-white/30 underline-offset-4 transition-all"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
