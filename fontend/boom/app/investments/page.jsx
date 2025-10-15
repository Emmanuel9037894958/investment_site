"use client";
import { useState } from "react";

// ================= Investment Page with Flutterwave + NOWPayments =================
export default function InvestmentsPage() {
  const [form, setForm] = useState({ plan: "", amount: "" });
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!form.plan || !form.amount) return alert("Select plan & amount");
    setModalOpen(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Create Investment</h1>

        <form className="space-y-4" onSubmit={handleOpenModal}>
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:outline-none"
            required
          >
            <option value="">Select Plan</option>
            <option value="starter">Starter Plan</option>
            <option value="pro">Pro Plan</option>
            <option value="vip">VIP Plan</option>
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:outline-none"
            required
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white p-3 rounded-lg w-full font-bold hover:bg-indigo-700 transition-shadow shadow-md"
          >
            Proceed to Pay
          </button>
        </form>
      </div>

      {/* Payment Modal */}
      {modalOpen && (
        <PaymentModal
          plan={form.plan}
          amount={form.amount}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

// ================= Payment Modal =================
function PaymentModal({ plan, amount, onClose }) {
  const [method, setMethod] = useState("flutterwave");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        {/* Floating Summary */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white rounded-xl shadow-lg p-4 w-72 text-center">
          <h3 className="text-lg font-semibold">Investment Summary</h3>
          <p className="mt-1">
            Plan: <span className="font-bold">{plan}</span>
          </p>
          <p className="mt-1">
            Amount: <span className="font-bold">${amount}</span>
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mt-12">
          Choose Payment Method
        </h2>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setMethod("flutterwave")}
            className={`px-4 py-2 rounded-xl font-medium ${
              method === "flutterwave" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Card / Bank
          </button>
          <button
            onClick={() => setMethod("crypto")}
            className={`px-4 py-2 rounded-xl font-medium ${
              method === "crypto" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Crypto
          </button>
        </div>

        {method === "flutterwave" ? (
          <FlutterwavePay amount={amount} onClose={onClose} />
        ) : (
          <NowPaymentsPay amount={amount} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

// ================= Helper: Save Payment to Backend =================
async function savePaymentToBackend(paymentData) {
  try {
    const res = await fetch("http://localhost/investment_site/api/save_payment.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    const data = await res.json();
    console.log("Backend save result:", data);
  } catch (err) {
    console.error("Error saving payment:", err);
  }
}

// ================= Flutterwave Card/Bank Payment =================
function FlutterwavePay({ amount, onClose }) {
  const handleFlutterwavePay = () => {
    const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

    if (!publicKey) {
      alert("⚠️ Flutterwave public key missing in .env.local");
      return;
    }

    // Load Flutterwave inline SDK
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.onload = () => {
      window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: Date.now(),
        amount: amount,
        currency: "NGN",
        payment_options: "card, banktransfer, ussd",
        customer: {
          email: "user@example.com",
          name: "Investor",
        },
        customizations: {
          title: "Investment Payment",
          description: "Secure payment for your investment",
          logo: "/logo.png",
        },
        callback: async function (response) {
          console.log(response);
          alert("✅ Payment successful!");

          // Save to backend
          await savePaymentToBackend({
            user_id: 1, // replace with logged-in user ID later
            amount: amount,
            currency: "NGN",
            status: "success",
            reference: response.tx_ref,
            gateway: "flutterwave",
          });

          onClose();
        },
        onclose: function () {
          console.log("Payment modal closed");
        },
      });
    };
    document.body.appendChild(script);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <button
        onClick={handleFlutterwavePay}
        className="bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 shadow-md w-full"
      >
        Pay with Card / Bank
      </button>
      <button
        onClick={onClose}
        className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-bold hover:bg-gray-400 shadow-md w-full"
      >
        Cancel
      </button>
    </div>
  );
}

// ================= NOWPayments Crypto Payment =================
function NowPaymentsPay({ amount, onClose }) {
  const handleNowPay = async () => {
    const apiKey = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY;

    if (!apiKey) {
      alert("⚠️ NOWPayments API key missing in .env.local");
      return;
    }

    try {
      const response = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: amount,
          price_currency: "usd",
          pay_currency: "btc",
          order_id: "INV-" + Date.now(),
          order_description: "Investment payment",
          success_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cancel",
          is_fee_paid_by_user: true,
        }),
      });

      const data = await response.json();
      if (data.invoice_url) {
        alert("Redirecting to crypto payment...");
        await savePaymentToBackend({
          user_id: 1,
          amount: amount,
          currency: "USD",
          status: "pending",
          reference: data.invoice_id || "crypto-" + Date.now(),
          gateway: "nowpayments",
        });
        window.location.href = data.invoice_url;
      } else {
        alert("Error creating crypto payment: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
      alert("Error creating crypto payment");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <button
        onClick={handleNowPay}
        className="bg-green-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700 shadow-md w-full"
      >
        Pay with Crypto
      </button>
      <button
        onClick={onClose}
        className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-bold hover:bg-gray-400 shadow-md w-full"
      >
        Cancel
      </button>
    </div>
  );
}
