"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  ShieldCheck,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Clock3,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const currencies = [
  { value: "usdttrc20", label: "USDT — TRC20" },
  { value: "usdtbsc", label: "USDT — BEP20" },
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "usdc", label: "USDC" },
];

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("usdttrc20");
  const [deposits, setDeposits] = useState([]);
  const [activeDeposit, setActiveDeposit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  function getToken() {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem("token") || "";
  }

  async function loadDeposits() {
    const token = getToken();

    if (!token) {
      setLoadingHistory(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/deposits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load deposits.");
      }

      setDeposits(Array.isArray(data.deposits) ? data.deposits : []);
    } catch (requestError) {
      console.error("Deposit history error:", requestError);
      setError(requestError.message || "Unable to load deposit history.");
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    loadDeposits();

    const interval = setInterval(loadDeposits, 10000);

    return () => clearInterval(interval);
  }, []);

  async function handleCreateDeposit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setCopied(false);

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 10) {
      setError("Minimum deposit amount is $10.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/deposits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numericAmount,
          crypto_currency: cryptoCurrency,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create deposit.");
      }

      setActiveDeposit(data.deposit);
      setSuccess("Payment created. Send the exact amount shown below.");
      setAmount("");

      await loadDeposits();
    } catch (requestError) {
      console.error("Create deposit error:", requestError);
      setError(requestError.message || "Unable to create deposit.");
    } finally {
      setLoading(false);
    }
  }

  async function copyAddress() {
    if (!activeDeposit?.payment_address) {
      return;
    }

    try {
      await navigator.clipboard.writeText(activeDeposit.payment_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy the payment address.");
    }
  }

  function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  }

  function statusClasses(status) {
    if (status === "confirming") {
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }
    if (status === "failed") {
      return "border-red-500/30 bg-red-500/10 text-red-300";
    }
    if (status === "confirmed") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }
    return "border-blue-500/30 bg-blue-500/10 text-blue-300";
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <Wallet size={24} className="text-emerald-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Deposit Funds</h1>
              <p className="text-sm text-slate-400">
                Add real funds to your Energy-Vest account.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-400" />
            <p className="text-sm text-emerald-300">{success}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Deposit Form */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Create a deposit</h2>
              <p className="mt-1 text-sm text-slate-400">
                Choose the amount and cryptocurrency you want to use.
              </p>
            </div>

            <form onSubmit={handleCreateDeposit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Amount in USD
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>

                  <input
                    type="number"
                    min="10"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100.00"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-9 pr-4 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Minimum deposit: $10
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Payment cryptocurrency
                </label>

                <select
                  value={cryptoCurrency}
                  onChange={(e) => setCryptoCurrency(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex gap-3">
                  <ShieldCheck size={20} className="shrink-0 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Secure payment processing
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your deposit is not credited simply because this form was submitted. The payment must be received and verified before your balance can be increased.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Creating payment...
                  </>
                ) : (
                  <>
                    <Wallet size={19} />
                    Create Deposit
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Active Payment Instructions */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Payment instructions</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Complete your payment using the exact details below.
                </p>
              </div>

              {activeDeposit && (
                <button
                  type="button"
                  onClick={loadDeposits}
                  className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-slate-600 hover:text-white"
                  title="Refresh"
                >
                  <RefreshCw size={17} />
                </button>
              )}
            </div>

            {!activeDeposit ? (
              <div className="flex min-h-[330px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-6 text-center">
                <div>
                  <Wallet size={42} className="mx-auto mb-4 text-slate-700" />
                  <p className="font-medium text-slate-400">No active payment</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                    Create a deposit on the left and the real payment instructions will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Deposit amount
                  </p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    ${Number(activeDeposit.amount).toFixed(2)}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                    <Clock3 size={16} />
                    <span>
                      Status:{" "}
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-medium ${statusClasses(
                          activeDeposit.status
                        )}`}
                      >
                        {activeDeposit.status}
                      </span>
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-300">
                    Send exactly
                  </p>
                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                    <p className="break-all text-lg font-semibold text-emerald-400">
                      {activeDeposit.crypto_amount || "Waiting for amount"}
                    </p>
                    <p className="mt-1 text-xs uppercase text-slate-500">
                      {activeDeposit.crypto_currency}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-300">
                    Payment address
                  </p>
                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                    <p className="break-all font-mono text-sm leading-6 text-slate-300">
                      {activeDeposit.payment_address || "Payment address unavailable"}
                    </p>

                    {activeDeposit.payment_address && (
                      <button
                        type="button"
                        onClick={copyAddress}
                        className="mt-4 flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-emerald-500/40 hover:text-white"
                      >
                        {copied ? (
                          <>
                            <Check size={16} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={16} /> Copy address
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {activeDeposit.payment_url && (
                  <a
                    href={activeDeposit.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 py-3 font-medium text-slate-200 transition hover:border-emerald-500/40 hover:text-white"
                  >
                    Open payment page
                    <ExternalLink size={17} />
                  </a>
                )}

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-sm font-medium text-amber-300">Important</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Send only the selected cryptocurrency using the specified network. Sending the wrong asset or network can result in permanent loss of funds.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Deposit History Section */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Deposit history</h2>
              <p className="mt-1 text-sm text-slate-400">
                Your real deposit records.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDeposits}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {loadingHistory ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              <Loader2 size={22} className="mr-2 animate-spin" />
              Loading deposits...
            </div>
          ) : deposits.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 py-12 text-center">
              <p className="text-slate-500">No deposits yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-3">Reference</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Crypto</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit.id} className="border-b border-slate-800/70">
                      <td className="px-3 py-4">
                        <p className="font-mono text-xs text-slate-300">
                          {deposit.reference}
                        </p>
                      </td>
                      <td className="px-3 py-4 font-semibold text-white">
                        ${Number(deposit.amount).toFixed(2)}
                      </td>
                      <td className="px-3 py-4 text-sm text-slate-400">
                        {deposit.crypto_currency}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(
                            deposit.status
                          )}`}
                        >
                          {deposit.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-slate-500">
                        {formatDate(deposit.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}