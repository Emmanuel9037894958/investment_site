"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // Read query params from URL (e.g., ?amount=700&ref=INV123)
    const params = new URLSearchParams(window.location.search);
    const amount = params.get("amount");
    const ref = params.get("ref");
    const gateway = params.get("gateway");

    setDetails({
      amount,
      ref,
      gateway: gateway || "flutterwave",
    });
  }, []);

  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-green-500 w-10 h-10 mb-3" />
        <p className="text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 max-w-md w-full text-center">
        <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Your trade payment was processed successfully.
        </p>

        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Reference:</span> {details.ref || "N/A"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Amount:</span> ${details.amount || "N/A"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Gateway:</span>{" "}
            {details.gateway.toUpperCase()}
          </p>
        </div>

        <Link
          href="/dashboard/trade"
          className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Trading
        </Link>
      </div>
    </div>
  );
}
