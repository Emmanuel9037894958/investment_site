"use client";
import { useState } from "react";
import { PaystackButton } from "react-paystack";
import { FaBitcoin, FaGift, FaPaypal } from "react-icons/fa";
import { useUser } from "@/app/referrals/context/UserContext";

export default function DepositPage() {
  const { user } = useUser();
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const [email, setEmail] = useState(user?.email || ""); 
  const [amount, setAmount] = useState(""); 
  const [method, setMethod] = useState("paystack"); 

  if (!user) {
    return (
      <p className="p-6 text-center text-red-600">
        You must be logged in to make a deposit.
      </p>
    );
  }

  const componentProps = {
    email,
    amount: Number(amount) * 100,
    metadata: { custom_fields: [{ display_name: "Email", variable_name: "email", value: email }] },
    publicKey,
    text: "Pay Now",
    onSuccess: async () => {
      // Call your API to save deposit here
      await fetch("/api/payments/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: email, amount, method }),
      });
      alert("Payment Successful and saved!");
    },
    onClose: () => alert("Payment cancelled."),
  };

  const paymentMethods = [
    { key: "paystack", label: "Paystack", color: "green", icon: null },
    { key: "paypal", label: "PayPal", color: "blue", icon: <FaPaypal className="inline mr-1" /> },
    { key: "crypto", label: "Crypto", color: "yellow", icon: <FaBitcoin className="inline mr-1" /> },
    { key: "gift", label: "Gift Card", color: "pink", icon: <FaGift className="inline mr-1" /> },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Make a Deposit</h1>

        {/* Amount */}
        <input
          type="number"
          placeholder="Enter amount (NGN)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded-lg p-3 mb-4 w-full"
        />

        {/* Payment Method Selection */}
        <div className="flex justify-between mb-4 space-x-2">
          {paymentMethods.map((pm) => (
            <button
              key={pm.key}
              onClick={() => setMethod(pm.key)}
              className={`flex-1 flex items-center justify-center p-3 rounded-lg border font-semibold 
                ${method === pm.key ? `bg-${pm.color}-500 text-white border-${pm.color}-500` : "bg-white text-gray-800 border-gray-300"}
                hover:opacity-90 transition`}
            >
              {pm.icon} {pm.label}
            </button>
          ))}
        </div>

        {/* Payment Processing */}
        {method === "paystack" ? (
          <PaystackButton
            {...componentProps}
            className="bg-green-600 text-white p-3 rounded-lg w-full font-semibold"
          />
        ) : (
          <button
            className="bg-gray-600 text-white p-3 rounded-lg w-full font-semibold"
            onClick={() => alert(`Payment via ${method} is coming soon!`)}
          >
            Continue with {method.charAt(0).toUpperCase() + method.slice(1)}
          </button>
        )}
      </div>
    </div>
  );
}
