"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wallet,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

export default function WithdrawalPage() {
  const router = useRouter();

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [currency, setCurrency] = useState("BTC");
  const [network, setNetwork] = useState("Bitcoin");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${API_BASE}/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load account balance");
        }

        return data;
      })
      .then((data) => {
        const availableBalance =
          data?.data?.cashBalance ??
          data?.data?.balance ??
          0;

        setBalance(Number(availableBalance));
      })
      .catch((error) => {
        console.error("Balance error:", error);

        setMessage(
          error.message || "Unable to load your account information."
        );
        setMessageType("error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleAmountChange = (e) => {
    const value = e.target.value;

    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const withdrawalAmount = Number(amount);

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      setMessage("Enter a valid withdrawal amount.");
      setMessageType("error");
      return;
    }

    if (withdrawalAmount > balance) {
      setMessage("Withdrawal amount exceeds your available balance.");
      setMessageType("error");
      return;
    }

    if (!walletAddress.trim()) {
      setMessage("Enter your receiving wallet address.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: withdrawalAmount,
          currency,
          network,
          wallet_address: walletAddress.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit withdrawal request."
        );
      }

      setMessage(
        "Withdrawal request submitted successfully and is awaiting review."
      );
      setMessageType("success");

      setAmount("");
      setWalletAddress("");
    } catch (error) {
      console.error("Withdrawal error:", error);

      setMessage(
        error.message ||
          "Unable to submit withdrawal request. Please try again."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-indigo-200 transition"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <h1 className="text-lg sm:text-xl font-semibold">
              Withdraw Funds
            </h1>

            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Available Balance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Wallet className="text-indigo-600" size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Available Balance
              </p>

              {loading ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  ${balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Request Withdrawal
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter the amount and receiving wallet details below.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 rounded-xl border p-4 flex items-start gap-3 ${
                messageType === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
              )}

              <p className="text-sm font-medium">
                {message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Withdrawal Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  $
                </span>

                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cryptocurrency
              </label>

              <select
                id="currency"
                value={currency}
                onChange={(e) => {
                  const selected = e.target.value;

                  setCurrency(selected);

                  if (selected === "BTC") {
                    setNetwork("Bitcoin");
                  }

                  if (selected === "ETH") {
                    setNetwork("Ethereum");
                  }

                  if (selected === "USDT") {
                    setNetwork("TRC20");
                  }

                  if (selected === "USDC") {
                    setNetwork("Ethereum");
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="USDC">USD Coin (USDC)</option>
              </select>
            </div>

            {/* Network */}
            <div>
              <label
                htmlFor="network"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Network
              </label>

              <select
                id="network"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              >
                {currency === "BTC" && (
                  <option value="Bitcoin">Bitcoin</option>
                )}

                {currency === "ETH" && (
                  <option value="Ethereum">Ethereum</option>
                )}

                {currency === "USDT" && (
                  <>
                    <option value="TRC20">TRC20</option>
                    <option value="ERC20">ERC20</option>
                  </>
                )}

                {currency === "USDC" && (
                  <option value="Ethereum">Ethereum</option>
                )}
              </select>
            </div>

            {/* Wallet Address */}
            <div>
              <label
                htmlFor="walletAddress"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Receiving Wallet Address
              </label>

              <input
                id="walletAddress"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your wallet address"
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />

              <p className="text-xs text-gray-500 mt-2">
                Make sure the wallet address belongs to the selected
                cryptocurrency and network.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Submitting Request..."
                : "Submit Withdrawal Request"}
            </button>
          </form>
        </div>

        {/* Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <ShieldCheck
              size={22}
              className="text-indigo-600 mb-3"
            />

            <h3 className="font-semibold text-gray-900">
              Secure Processing
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Withdrawal requests are securely recorded before processing.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <Clock
              size={22}
              className="text-indigo-600 mb-3"
            />

            <h3 className="font-semibold text-gray-900">
              Admin Review
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Requests are reviewed before funds are released.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <Wallet
              size={22}
              className="text-indigo-600 mb-3"
            />

            <h3 className="font-semibold text-gray-900">
              Wallet Verification
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Always verify your wallet address and network before submitting.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}