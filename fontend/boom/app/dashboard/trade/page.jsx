"use client";
import { useState, useEffect } from "react";

// ================= Trade Page =================
export default function TradePage() {
  const [markets, setMarkets] = useState([
    { id: 1, asset: "Crude Oil", price: 84.32, change: +0.8 },
    { id: 2, asset: "Natural Gas", price: 3.12, change: -1.1 },
    { id: 3, asset: "Brent Oil", price: 88.5, change: +1.5 },
    { id: 4, asset: "Energy ETF", price: 142.1, change: -0.6 },
  ]);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // 🔹 Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((m) => ({
          ...m,
          price: (parseFloat(m.price) + ((Math.random() - 0.5) * 0.8)).toFixed(2),
          change: (Math.random() * 2 - 1).toFixed(2),
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = () => {
    if (!selectedAsset) return alert("Select an asset to trade");
    if (!amount || !email) return alert("Enter your email and trade amount");
    setModalOpen(true);
  };

  return (
    <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Trade Energy Assets
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Table */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-2xl overflow-x-auto p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Live Market Prices
          </h3>
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left p-3">Asset</th>
                <th className="text-left p-3">Price ($)</th>
                <th className="text-left p-3">Change (%)</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m) => (
                <tr
                  key={m.id}
                  className={`border-t transition ${
                    selectedAsset?.id === m.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="p-3 font-medium">{m.asset}</td>
                  <td className="p-3">${m.price}</td>
                  <td
                    className={`p-3 font-semibold ${
                      m.change > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {m.change > 0 ? "+" : ""}
                    {m.change}%
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedAsset(m)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trade Form */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Trade Panel
          </h3>

          {selectedAsset ? (
            <>
              <p className="text-gray-700 mb-2">
                Selected Asset:{" "}
                <span className="font-bold">{selectedAsset.asset}</span>
              </p>
              <p className="text-gray-500 mb-4">
                Current Price: ${selectedAsset.price}
              </p>

              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3 text-sm sm:text-base"
              />

              <input
                type="number"
                placeholder="Enter trade amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4 text-sm sm:text-base"
              />

              <button
                onClick={handleOpenModal}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm sm:text-base font-bold"
              >
                Proceed to Pay
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              Select an asset from the market to start trading.
            </p>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {modalOpen && (
        <PaymentModal
          asset={selectedAsset}
          amount={amount}
          email={email}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

// ================= Payment Modal =================
function PaymentModal({ asset, amount, email, onClose }) {
  const [method, setMethod] = useState("flutterwave");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        {/* Floating Summary */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white rounded-xl shadow-lg p-4 w-72 text-center">
          <h3 className="text-lg font-semibold">Trade Summary</h3>
          <p className="mt-1">
            Asset: <span className="font-bold">{asset.asset}</span>
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
          <FlutterwavePay amount={amount} email={email} asset={asset} onClose={onClose} />
        ) : (
          <NowPaymentsPay amount={amount} asset={asset} onClose={onClose} />
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
function FlutterwavePay({ amount, email, asset, onClose }) {
  const handleFlutterwavePay = () => {
    const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

    if (!publicKey) {
      alert("⚠️ Flutterwave public key missing in .env.local");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.onload = () => {
      window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: Date.now(),
        amount: parseFloat(amount),
        currency: "USD",
        payment_options: "card, banktransfer, ussd",
        customer: {
          email: email,
          name: "Trader",
        },
        customizations: {
          title: "Trade Payment",
          description: `Payment for ${asset.asset}`,
          logo: "/logo.png",
        },
        callback: async function (response) {
          alert("✅ Payment successful!");
          await savePaymentToBackend({
            user_id: 1,
            amount: amount,
            currency: "USD",
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
function NowPaymentsPay({ amount, asset, onClose }) {
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
          price_amount: parseFloat(amount),
          price_currency: "usd",
          pay_currency: "btc",
          order_id: "TRADE-" + Date.now(),
          order_description: `Trade for ${asset.asset}`,
          success_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/trade",
          is_fee_paid_by_user: true,
        }),
      });

      const data = await response.json();
      console.log("NOWPayments Response:", data);

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
        alert("❌ Failed to create crypto invoice. Check API key or amount.");
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
