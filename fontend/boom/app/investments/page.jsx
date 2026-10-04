"use client";

import { useState } from "react";
import {
  X,
  Wallet,
  Loader2,
  ShieldCheck,
  Bitcoin,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const CRYPTO_OPTIONS = [
  { value: "btc", label: "Bitcoin (BTC)" },
  { value: "usdttrc20", label: "Tether (USDT TRC20)" },
  { value: "usdtbsc", label: "Tether (USDT BEP20)" },
  { value: "eth", label: "Ethereum (ETH)" },
  { value: "trx", label: "TRON (TRX)" },
];

export default function InvestmentsPage() {
  const [form, setForm] = useState({
    plan: "",
    amount: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);

    if (!form.plan) {
      alert("Please select an investment plan.");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid investment amount.");
      return;
    }

    setModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Wallet size={24} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Create Investment
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Select an investment plan and amount. Payment is processed through
            the secure Energy-Vest payment system.
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <form onSubmit={handleOpenModal} className="space-y-5">
            <div>
              <label
                htmlFor="plan"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Investment Plan
              </label>

              <select
                id="plan"
                name="plan"
                value={form.plan}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              >
                <option value="">Select Plan</option>
                <option value="starter">Starter Plan</option>
                <option value="pro">Pro Plan</option>
                <option value="vip">VIP Plan</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Investment Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  $
                </span>

                <input
                  id="amount"
                  type="number"
                  name="amount"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-8 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.99]"
            >
              Proceed to Payment
            </button>
          </form>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-xs leading-5 text-slate-500">
              Payments are verified by the payment provider and Energy-Vest
              backend before funds are credited to your account.
            </p>
          </div>
        </div>
      </div>

      {modalOpen && (
        <PaymentModal
          plan={form.plan}
          amount={form.amount}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}

function PaymentModal({ plan, amount, onClose }) {
  const [method, setMethod] = useState("crypto");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        >
          <X size={20} />
        </button>

        <div className="rounded-t-3xl bg-slate-900 px-6 py-7 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Investment Payment
          </p>

          <h2 className="mt-2 text-2xl font-bold">Complete Your Payment</h2>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-slate-400">Plan</p>
              <p className="mt-1 font-semibold capitalize">{plan}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-slate-400">Amount</p>
              <p className="mt-1 font-semibold">
                ${Number(amount).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod("crypto")}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                method === "crypto"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Crypto
            </button>

            <button
              type="button"
              onClick={() => setMethod("flutterwave")}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                method === "flutterwave"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Card / Bank
            </button>
          </div>

          {method === "crypto" ? (
            <NowPaymentsPay
              amount={amount}
              plan={plan}
              onClose={onClose}
            />
          ) : (
            <FlutterwavePay
              amount={amount}
              plan={plan}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function NowPaymentsPay({ amount, plan, onClose }) {
  const [crypto, setCrypto] = useState("btc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null);
  const [copied, setCopied] = useState(false);

  const createPayment = async () => {
    setError("");
    setPayment(null);
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid investment amount.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/deposits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numericAmount,
          crypto_currency: crypto,
          plan,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create the NOWPayments payment."
        );
      }

      const deposit = data.deposit;

      if (!deposit) {
        throw new Error(
          "The server did not return valid payment information."
        );
      }

      setPayment(deposit);

      if (deposit.payment_url) {
        window.open(deposit.payment_url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("NOWPayments error:", err);

      setError(
        err?.message ||
          "Unable to create the NOWPayments payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    if (!payment?.payment_address) return;
    try {
      await navigator.clipboard.writeText(payment.payment_address);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="crypto"
          className="mb-2 block text-xs font-semibold text-slate-700"
        >
          Cryptocurrency
        </label>
        <select
          id="crypto"
          value={crypto}
          onChange={(e) => setCrypto(e.target.value)}
          disabled={loading}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
        >
          {CRYPTO_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm leading-5 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {payment && (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <Bitcoin size={21} className="mt-0.5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Payment Created
              </p>
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Your payment has been created. Complete the payment using the
                instructions below.
              </p>
            </div>
          </div>

          {payment.crypto_amount && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Amount to Pay
              </p>
              <p className="mt-1 break-all text-lg font-bold text-emerald-950">
                {payment.crypto_amount} {payment.crypto_currency}
              </p>
            </div>
          )}

          {payment.payment_address && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Payment Address
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white p-3">
                <p className="min-w-0 flex-1 break-all text-xs text-slate-700">
                  {payment.payment_address}
                </p>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="shrink-0 rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                  title="Copy payment address"
                >
                  {copied ? (
                    <Check size={16} className="text-emerald-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
          )}

          {payment.payment_url && (
            <button
              type="button"
              onClick={() =>
                window.open(
                  payment.payment_url,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              <ExternalLink size={18} />
              Open NOWPayments
            </button>
          )}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs leading-5 text-amber-800">
              Your Energy-Vest balance will only be credited after the payment
              provider confirms the payment and the Energy-Vest backend verifies
              it.
            </p>
          </div>
        </div>
      )}

      {!payment && (
        <>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <Bitcoin size={21} className="mt-0.5 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  Pay securely with NOWPayments
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  A real payment will be created through the Energy-Vest backend
                  using the cryptocurrency you select.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-xs leading-5 text-amber-800">
                Opening or creating a payment does not automatically credit
                your account. Funds are credited only after NOWPayments confirms
                the payment.
              </p>
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={createPayment}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Creating Secure Payment...
          </>
        ) : payment ? (
          <>
            <ExternalLink size={18} />
            Create Another Payment
          </>
        ) : (
          <>
            <ExternalLink size={18} />
            Pay with NOWPayments
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="w-full rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
      >
        Cancel
      </button>
    </div>
  );
}

function FlutterwavePay({ amount, plan, onClose }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFlutterwavePay = async () => {
    setLoading(true);
    setMessage("");

    try {
      const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("Flutterwave public key is not configured.");
      }

      if (!window.FlutterwaveCheckout) {
        await new Promise((resolve, reject) => {
          const existingScript = document.querySelector(
            'script[src="https://checkout.flutterwave.com/v3.js"]'
          );

          if (existingScript) {
            existingScript.addEventListener("load", resolve);
            existingScript.addEventListener("error", reject);
            return;
          }

          const script = document.createElement("script");
          script.src = "https://checkout.flutterwave.com/v3.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const txRef = `EV-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

      window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: txRef,
        amount: Number(amount),
        currency: "USD",
        payment_options: "card,banktransfer",
        customer: {
          email: "customer-email-from-account",
          name: "Energy-Vest Customer",
        },
        customizations: {
          title: "Energy-Vest",
          description: `Investment payment - ${plan}`,
          logo: "/logo.png",
        },
        callback: function (response) {
          console.log("Flutterwave response received:", response);
          setMessage(
            "Payment response received. Server verification is required before your account can be credited."
          );
        },
        onclose: function () {
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Flutterwave checkout error:", error);
      setMessage(
        error?.message || "Unable to open Flutterwave checkout."
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={21} className="mt-0.5 shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Card / Bank Payment
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-700">
              Flutterwave payments must be verified by the Energy-Vest backend
              before funds are credited.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-5 text-amber-800">
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={handleFlutterwavePay}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Opening Secure Checkout...
          </>
        ) : (
          "Pay with Card / Bank"
        )}
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        Cancel
      </button>
    </div>
  );
}