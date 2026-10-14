"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ArrowRight,
  CircleDollarSign,
} from "lucide-react";
import { useClient } from "@/app/context/ClientContext";
import { apiPost } from "../utils/api";

const QUICK_AMOUNTS = [25, 50, 100, 250];

export default function FundingView() {
  const { client, setClient } = useClient();

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Deposit");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const buyingPower = Number(client?.buyingPower ?? 0);
  const numericAmount = Number(amount);
  const isValidAmount =
    amount.trim() !== "" &&
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    /^\d+(\.\d{1,2})?$/.test(amount.trim());

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setMsg("");
    setMsgType("");
  };

  const doTransaction = async (e) => {
    e.preventDefault();

    setMsg("");
    setMsgType("");

    if (!client?.userId) {
      setMsg("Please sign in again to continue.");
      setMsgType("error");
      return;
    }

    if (!isValidAmount) {
      setMsg("Enter a valid amount.");
      setMsgType("error");
      return;
    }

    if (mode === "Withdrawal" && numericAmount > buyingPower) {
      setMsg("Insufficient available balance.");
      setMsgType("error");
      return;
    }

    setLoading(true);

    try {
      const res = await apiPost("add_transaction.php", {
        user_id: client.userId,
        amount: numericAmount,
        type: mode,
      });

      if (res?.success) {
        setClient((prev) => ({
          ...prev,
          buyingPower: res.newBuyingPower ?? prev.buyingPower,
          recentTransactions: res.newTransaction
            ? [res.newTransaction, ...(prev.recentTransactions || [])]
            : prev.recentTransactions || [],
        }));

        setMsg(
          res.message ||
            `${mode} request for $${formatMoney(numericAmount)} submitted successfully.`
        );
        setMsgType("success");
        setAmount("");
      } else {
        setMsg(res?.error || "Transaction could not be completed.");
        setMsgType("error");
      }
    } catch (err) {
      setMsg(err?.message || "Unable to process your request. Please try again.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full space-y-6 text-slate-800">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
              <Wallet size={15} className="text-emerald-300" />
              Account funding
            </div>

            <p className="text-sm text-slate-300">Available balance</p>

            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-medium text-slate-300">$</span>
              <h1 className="break-all text-4xl font-bold tracking-tight sm:text-5xl">
                {formatMoney(buyingPower)}
              </h1>
            </div>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl border border-white/10 bg-white/10 sm:h-20 sm:w-20">
            <CircleDollarSign
              size={38}
              strokeWidth={1.5}
              className="text-emerald-300"
            />
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/10 pt-5 text-xs text-slate-300">
          <span className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-emerald-300" />
            Secure account access
          </span>
          <span className="flex items-center gap-2">
            <Clock3 size={15} className="text-indigo-300" />
            Transaction history available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
        <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Fund your account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a transaction and enter an amount.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => selectMode("Deposit")}
              aria-pressed={mode === "Deposit"}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                mode === "Deposit"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <ArrowDownLeft size={18} />
              Deposit
            </button>

            <button
              type="button"
              onClick={() => selectMode("Withdrawal")}
              aria-pressed={mode === "Withdrawal"}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                mode === "Withdrawal"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <ArrowUpRight size={18} />
              Withdraw
            </button>
          </div>

          <form onSubmit={doTransaction} className="space-y-6">
            <div>
              <label
                htmlFor="funding-amount"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Amount (USD)
              </label>

              <div className="flex min-w-0 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                <span className="mr-3 text-xl font-semibold text-slate-400">
                  $
                </span>

                <input
                  id="funding-amount"
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setMsg("");
                    setMsgType("");
                  }}
                  className="min-w-0 flex-1 bg-transparent py-4 text-2xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
                  required
                />

                <span className="ml-2 text-xs font-bold tracking-wider text-slate-400">
                  USD
                </span>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  Quick amounts
                </span>
                <span className="text-xs text-slate-400">USD</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {QUICK_AMOUNTS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setAmount(String(value));
                      setMsg("");
                      setMsgType("");
                    }}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      amount === String(value)
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-slate-50"
                    }`}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-500">Transaction type</span>
                <span className="font-semibold text-slate-800">{mode}</span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                <span className="text-sm text-slate-500">Amount</span>
                <span className="break-all text-lg font-bold text-slate-900">
                  ${formatMoney(isValidAmount ? numericAmount : 0)}
                </span>
              </div>
            </div>

            {msg && (
              <div
                role="status"
                aria-live="polite"
                className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                  msgType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {msgType === "success" ? (
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                )}
                <span className="break-words">{msg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isValidAmount}
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === "Deposit" ? (
                    <ArrowDownLeft size={19} />
                  ) : (
                    <ArrowUpRight size={19} />
                  )}
                  {mode === "Deposit"
                    ? "Continue to deposit"
                    : "Submit withdrawal"}
                  <ArrowRight size={18} className="ml-auto" />
                </>
              )}
            </button>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={23} />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              Account security
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review your transaction details before submitting.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock3 size={23} />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              Transaction processing
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">Deposits</p>
                <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                  1–3 days
                </span>
              </div>

              <div className="border-t border-slate-100" />

              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">Withdrawals</p>
                <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                  Up to 5 days
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}