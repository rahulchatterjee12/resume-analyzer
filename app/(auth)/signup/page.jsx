"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/login"); // Send them to login after successful signup
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-zinc-800 via-zinc-950 to-black p-4 font-sans text-zinc-100">
      <div className="w-full max-w-md p-10 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Create an Account
          </h2>
          <p className="text-zinc-400 text-sm">
            Join us to get started with your dashboard.
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
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              required
              className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 placeholder:text-zinc-600"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 placeholder:text-zinc-600"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-white text-zinc-950 font-bold text-base py-3.5 rounded-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white font-semibold hover:text-zinc-300 hover:underline decoration-white/30 underline-offset-4 transition-all"
          >
            Log in now
          </Link>
        </p>
      </div>
    </div>
  );
}
