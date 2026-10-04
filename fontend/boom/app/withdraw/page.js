"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  Send,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Copy,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function WithdrawPage() {
  const [form, setForm] = useState({
    amount: "",
    crypto_currency: "USDT",
    network: "TRC20",
    wallet_address: "",
  });

  const [withdrawals, setWithdrawals] = useState([]);
  const [balance, setBalance] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD USER DATA
  // ==========================================

  useEffect(() => {
    loadWithdrawals();
    loadUserBalance();
  }, []);

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token");
  };

  // ==========================================
  // LOAD WITHDRAWALS
  // ==========================================

  const loadWithdrawals = async () => {
    const token = getToken();

    if (!token) {
      setError("You must be logged in to view withdrawals.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/withdrawals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to load withdrawals.");
        return;
      }

      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      console.error("Load withdrawals error:", err);
      setError("Unable to connect to the Energy-Vest server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD BALANCE
  // ==========================================

  const loadUserBalance = async () => {
    const token = getToken();

    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBalance(Number(data.summary?.cashBalance || 0));
      }
    } catch (err) {
      console.error("Load balance error:", err);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // ==========================================
  // SUBMIT WITHDRAWAL
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");
    setMessage("");

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (amount > balance) {
      setError("Your withdrawal amount is greater than your available balance.");
      return;
    }

    if (!form.wallet_address.trim()) {
      setError("Please enter your wallet address.");
      return;
    }

    setSubmitting(true);

    try {
      const token = getToken();

      if (!token) {
        setError("Your session has expired. Please log in again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          currency: "USD",
          crypto_currency: form.crypto_currency,
          network: form.network,
          wallet_address: form.wallet_address.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Withdrawal request failed.");
        return;
      }

      setMessage(
        "Withdrawal request submitted successfully. It is now awaiting review."
      );

      setForm({
        amount: "",
        crypto_currency: "USDT",
        network: "TRC20",
        wallet_address: "",
      });

      await loadWithdrawals();
      await loadUserBalance();
    } catch (err) {
      console.error("Withdrawal submission error:", err);

      setError(
        "Unable to connect to the Energy-Vest server. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatusIcon = (status) => {
    if (status === "paid") {
      return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
    }

    if (status === "rejected" || status === "failed") {
      return <XCircle className="h-5 w-5 text-red-400" />;
    }

    return <Clock3 className="h-5 w-5 text-amber-400" />;
  };

  const getStatusClass = (status) => {
    if (status === "paid") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (status === "rejected" || status === "failed") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString();
  };

  const copyWallet = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setMessage("Wallet address copied.");
    } catch {
      setError("Unable to copy wallet address.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Withdraw Funds
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Request a withdrawal from your available Energy-Vest balance.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Available balance
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-400">
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ALERTS */}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

            <p className="text-sm leading-6 text-emerald-300">
              {message}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

            <p className="text-sm leading-6 text-red-300">
              {error}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          {/* WITHDRAW FORM */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>

              <h2 className="text-xl font-bold">
                New withdrawal
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter the amount and destination wallet for your withdrawal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* AMOUNT */}

              <div>
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Amount
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    className="h-14 w-full rounded-xl border border-white/10 bg-slate-900 pl-9 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* CRYPTO */}

              <div>
                <label
                  htmlFor="crypto_currency"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Cryptocurrency
                </label>

                <select
                  id="crypto_currency"
                  name="crypto_currency"
                  value={form.crypto_currency}
                  onChange={handleChange}
                  className="h-14 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-sm text-white outline-none focus:border-emerald-500"
                >
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                </select>
              </div>

              {/* NETWORK */}

              <div>
                <label
                  htmlFor="network"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Network
                </label>

                <select
                  id="network"
                  name="network"
                  value={form.network}
                  onChange={handleChange}
                  className="h-14 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-sm text-white outline-none focus:border-emerald-500"
                >
                  <option value="TRC20">TRC20</option>
                  <option value="ERC20">ERC20</option>
                  <option value="BEP20">BEP20</option>
                  <option value="Bitcoin">Bitcoin Network</option>
                </select>
              </div>

              {/* WALLET */}

              <div>
                <label
                  htmlFor="wallet_address"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Wallet address
                </label>

                <textarea
                  id="wallet_address"
                  name="wallet_address"
                  value={form.wallet_address}
                  onChange={handleChange}
                  placeholder="Enter destination wallet address"
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting || loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting request...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Request withdrawal
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4">
              <p className="text-xs leading-5 text-slate-500">
                Withdrawal requests are reviewed before processing. Make sure
                your wallet address and network are correct.
              </p>
            </div>
          </section>

          {/* WITHDRAWAL HISTORY */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold">
                Withdrawal history
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                View your previous and pending withdrawal requests.
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading withdrawals...
                </div>
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900">
                  <Wallet className="h-6 w-6 text-slate-600" />
                </div>

                <h3 className="mt-5 font-semibold text-slate-300">
                  No withdrawals yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                  Your withdrawal requests will appear here after you submit
                  one.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-bold text-white">
                          ${Number(withdrawal.amount).toFixed(2)}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {withdrawal.reference}
                        </p>
                      </div>

                      <div
                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase ${getStatusClass(
                          withdrawal.status
                        )}`}
                      >
                        {getStatusIcon(withdrawal.status)}
                        {withdrawal.status}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-600">
                          Cryptocurrency
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-300">
                          {withdrawal.crypto_currency}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-600">
                          Network
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-300">
                          {withdrawal.network}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-xs text-slate-600">
                          Wallet address
                        </p>

                        <div className="mt-1 flex items-start gap-2">
                          <p className="break-all text-xs leading-5 text-slate-400">
                            {withdrawal.wallet_address}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              copyWallet(withdrawal.wallet_address)
                            }
                            className="shrink-0 text-slate-600 transition hover:text-emerald-400"
                            title="Copy wallet address"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-600">
                          Submitted
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(withdrawal.created_at)}
                        </p>
                      </div>

                      {withdrawal.admin_note && (
                        <div>
                          <p className="text-xs text-slate-600">
                            Admin note
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            {withdrawal.admin_note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}