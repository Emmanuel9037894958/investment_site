"use client";
import React from "react";
import { PaystackButton } from "react-paystack";

export default function PaystackPayment({ email, amount, fullName, onSuccess }) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const componentProps = {
    email,
    amount: amount * 100, // Paystack uses kobo
    metadata: {
      name: fullName,
    },
    publicKey,
    text: "Make Payment",
    onSuccess: (response) => {
      console.log("Payment success:", response);
      onSuccess(response); // pass it to parent to save transaction
    },
    onClose: () => alert("Payment cancelled"),
  };

  return (
    <PaystackButton
      {...componentProps}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition-all"
    />
  );
}
