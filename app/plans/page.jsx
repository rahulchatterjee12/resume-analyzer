"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
    if (!session) {
      alert("Please log in to upgrade.");
      router.push("/login");
      return;
    }

    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
      });
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
            // VERIFICATION CALL
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

            if (verifyData.success) {
              alert("Payment Verified! Your account is now PRO.");
              router.push("/profile");
            } else {
              alert("Verification failed: " + verifyData.message);
            }
          } catch (err) {
            console.error("Verification Error:", err);
            alert("Error verifying payment.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: session.user.name || "User",
          email: session.user.email || "user@example.com",
        },
        theme: {
          color: "#09090b",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong opening the payment gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 bg-linear-to-b from-zinc-800 via-zinc-950 to-black font-sans text-zinc-100">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-10 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-fade-in-up relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
              Upgrade to Pro
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              You have reached your free scan limit. Upgrade now to unlock the
              full power of AI for your hiring process.
            </p>
          </div>

          <div className="flex justify-center items-baseline mb-8">
            <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-400">
              ₹500
            </span>
            <span className="text-zinc-500 ml-2 font-medium">/ lifetime</span>
          </div>

          <div className="space-y-4 mb-10">
            {[
              "Unlimited AI resume analysis",
              "Bulk Excel (.xlsx) exports",
              "Priority processing speed",
              "Lifetime access & updates",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center text-zinc-300 text-sm font-medium"
              >
                <svg
                  className="w-5 h-5 mr-3 text-blue-400 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                {feature}
              </div>
            ))}
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-white text-zinc-950 font-bold text-lg py-4 rounded-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center space-x-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-950"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Pay with Razorpay</span>
            )}
          </button>
          <div className="mt-4 flex items-center justify-center text-xs text-zinc-500 space-x-1.5">
            <span>Secured by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
