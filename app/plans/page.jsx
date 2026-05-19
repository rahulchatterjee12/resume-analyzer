"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function PlansPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!session) { alert("Please log in to upgrade."); router.push("/login"); return; }
    setLoading(true);
    const res = await loadRazorpayScript();
    if (!res) { alert("Razorpay SDK failed to load. Are you online?"); setLoading(false); return; }
    try {
      const orderResponse = await fetch("/api/payment/create-order", { method: "POST" });
      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error("Could not create order");
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Resume Analyzer Pro",
        description: "Unlock Unlimited Resume Scans",
        order_id: orderData.order.id,
        handler: async function (response) {
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: session.user.id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) { alert("Payment Verified! Your account is now PRO."); router.push("/profile"); }
            else { alert("Verification failed: " + verifyData.message); }
          } catch (err) { console.error("Verification Error:", err); alert("Error verifying payment."); }
          finally { setLoading(false); }
        },
        prefill: { name: session.user.name || "User", email: session.user.email || "user@example.com" },
        theme: { color: "#3b82f6" },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) { console.error(error); alert("Something went wrong opening the payment gateway."); }
    finally { setLoading(false); }
  };

  const freeFeatures = [
    { text: "5 resume analyses", included: true },
    { text: "Basic AI evaluation", included: true },
    { text: "Excel export", included: true },
    { text: "Unlimited scans", included: false },
    { text: "Priority processing", included: false },
    { text: "Lifetime updates", included: false },
  ];

  const proFeatures = [
    { text: "Unlimited AI resume analysis", included: true },
    { text: "Advanced AI evaluation", included: true },
    { text: "Bulk Excel (.xlsx) exports", included: true },
    { text: "Unlimited scans", included: true },
    { text: "Priority processing speed", included: true },
    { text: "Lifetime access & updates", included: true },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-16 px-4 sm:px-6 bg-zinc-950 font-sans text-zinc-100 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      <motion.div className="absolute top-1/4 right-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" animate={{ y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }} />

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Simple, transparent pricing</h1>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">Start free and upgrade when you need more. One-time payment, lifetime access.</p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }} className="glass-card p-8 flex flex-col">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-1">Free</h3>
              <p className="text-xs text-zinc-500">Get started at no cost</p>
            </div>
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-white">₹0</span>
              <span className="text-zinc-600 ml-2 text-sm font-medium">/ forever</span>
            </div>
            <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }} className="space-y-3.5 mb-10 flex-1">
              {freeFeatures.map((feature, index) => (
                <motion.div key={index} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="flex items-center text-sm">
                  {feature.included ? (
                    <svg className="w-4 h-4 mr-3 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-4 h-4 mr-3 text-zinc-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                  <span className={feature.included ? "text-zinc-400" : "text-zinc-600"}>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
            <button disabled className="w-full bg-white/[0.05] border border-white/[0.08] text-zinc-500 font-semibold text-sm py-3.5 rounded-xl cursor-default">Current Plan</button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative glass-card p-8 flex flex-col border-blue-500/20 hover:border-blue-500/30 transition-colors">
            {/* Popular badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 300 }} className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/25 uppercase tracking-wider">Popular</span>
            </motion.div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-1">Pro</h3>
                <p className="text-xs text-zinc-500">For serious recruiters</p>
              </div>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold gradient-text">₹500</span>
                <span className="text-zinc-600 ml-2 text-sm font-medium">/ lifetime</span>
              </div>
              <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } } }} className="space-y-3.5 mb-10 flex-1">
                {proFeatures.map((feature, index) => (
                  <motion.div key={index} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-3 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span className="text-zinc-300">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button onClick={handlePayment} disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white font-semibold text-sm py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center overflow-hidden relative group">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {loading ? (
                  <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white relative" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span className="relative">Processing...</span></>
                ) : <span className="relative">Upgrade with Razorpay</span>}
              </motion.button>
              <div className="mt-4 flex items-center justify-center text-xs text-zinc-600 space-x-1.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span>Secured by Razorpay</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
