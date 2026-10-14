"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Copy,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const USERS_COLLECTION = "users";
const WITHDRAWALS_COLLECTION = "withdrawals";

const INITIAL_FORM = {
  amount: "",
  crypto_currency: "USDT",
  network: "TRC20",
  wallet_address: "",
};

function getBalance(data) {
  const value = data?.cashBalance ?? data?.balance ?? data?.walletBalance;

  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0 ? number : null;
}

function getDateMillis(value) {
  if (!value) return 0;

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  const date = new Date(value).getTime();

  return Number.isFinite(date) ? date : 0;
}

function formatDate(value) {
  if (!value) return "Just now";

  let date;

  if (typeof value.toDate === "function") {
    date = value.toDate();
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getStatusStyle(status) {
  const normalized = String(status || "pending").toLowerCase();

  if (normalized === "approved" || normalized === "completed" || normalized === "successful") {
    return {
      label: normalized.charAt(0).toUpperCase() + normalized.slice(1),
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Icon: CheckCircle2,
    };
  }

  if (normalized === "rejected" || normalized === "failed") {
    return {
      label: normalized.charAt(0).toUpperCase() + normalized.slice(1),
      className: "bg-red-500/10 text-red-400 border-red-500/20",
      Icon: XCircle,
    };
  }

  return {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Icon: Clock3,
  };
}

export default function WithdrawPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [withdrawals, setWithdrawals] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [profileReady, setProfileReady] = useState(false);

  const findUserProfile = useCallback(async (user) => {
    // First check the standard profile document: users/{Firebase Auth UID}.
    const directRef = doc(db, USERS_COLLECTION, user.uid);
    const directSnap = await getDoc(directRef);

    if (directSnap.exists()) {
      return {
        id: directSnap.id,
        data: directSnap.data(),
      };
    }

    // If your Firestore rules permit it, check documents containing this UID.
    const uidQuery = query(
      collection(db, USERS_COLLECTION),
      where("uid", "==", user.uid)
    );

    const uidSnapshot = await getDocs(uidQuery);

    if (!uidSnapshot.empty) {
      const matchingDocs = uidSnapshot.docs.filter((item) => {
        const data = item.data();

        return !data.uid || data.uid === user.uid;
      });

      if (matchingDocs.length === 1) {
        return {
          id: matchingDocs[0].id,
          data: matchingDocs[0].data(),
        };
      }

      if (matchingDocs.length > 1) {
        return null;
      }
    }

    // Finally check by email, but only accept an unambiguous match.
    if (!user.email) return null;

    const emailQuery = query(
      collection(db, USERS_COLLECTION),
      where("email", "==", user.email)
    );

    const emailSnapshot = await getDocs(emailQuery);

    const matches = emailSnapshot.docs.filter((item) => {
      const data = item.data();

      return (
        String(data.email || "").toLowerCase() ===
          String(user.email).toLowerCase() &&
        (!data.uid || data.uid === user.uid)
      );
    });

    if (matches.length !== 1) return null;

    return {
      id: matches[0].id,
      data: matches[0].data(),
    };
  }, []);

  const loadUserBalance = useCallback(
    async (user) => {
      setProfileReady(false);
      setBalance(null);
      setProfileId(null);

      if (!user) return false;

      try {
        const profile = await findUserProfile(user);

        // Do not display the missing-profile error message.
        if (!profile) {
          setError("");
          return false;
        }

        const accountBalance = getBalance(profile.data);

        if (accountBalance === null) {
          setError("");
          setProfileId(null);
          setBalance(null);
          return false;
        }

        setProfileId(profile.id);
        setBalance(accountBalance);
        setProfileReady(true);
        setError("");

        return true;
      } catch (err) {
        console.error("Firebase profile lookup error:", err);

        // Keep the requested profile lookup message hidden.
        setError("");
        setProfileId(null);
        setBalance(null);
        setProfileReady(false);

        return false;
      }
    },
    [findUserProfile]
  );

  const loadWithdrawals = useCallback(async (user) => {
    if (!user) {
      setWithdrawals([]);
      return;
    }

    try {
      const withdrawalsQuery = query(
        collection(db, WITHDRAWALS_COLLECTION),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(withdrawalsQuery);

      const items = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      items.sort(
        (a, b) =>
          getDateMillis(b.createdAt || b.created_at) -
          getDateMillis(a.createdAt || a.created_at)
      );

      setWithdrawals(items);
    } catch (err) {
      console.error("Unable to load withdrawal history:", err);
      setWithdrawals([]);
    }
  }, []);

  const refreshData = useCallback(
    async (user) => {
      if (!user) return;

      setLoading(true);
      setError("");
      setMessage("");

      try {
        await Promise.all([
          loadUserBalance(user),
          loadWithdrawals(user),
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loadUserBalance, loadWithdrawals]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);
      setError("");
      setMessage("");

      if (!user) {
        setBalance(null);
        setProfileId(null);
        setProfileReady(false);
        setWithdrawals([]);
        setLoading(false);
        return;
      }

      await refreshData(user);
    });

    return () => unsubscribe();
  }, [refreshData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!currentUser) {
      setError("Please log in before requesting a withdrawal.");
      return;
    }

    if (!profileReady || !profileId || balance === null) {
      setError(
        "Your account balance could not be verified. Please refresh or contact support."
      );
      return;
    }

    const amount = Number(form.amount);
    const walletAddress = form.wallet_address.trim();

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }

    if (amount < 10) {
      setError("The minimum withdrawal amount is $10.00.");
      return;
    }

    if (amount > balance) {
      setError("Your withdrawal amount exceeds your available balance.");
      return;
    }

    if (!walletAddress) {
      setError("Enter your receiving wallet address.");
      return;
    }

    setSubmitting(true);

    try {
      // Re-read the existing profile before accepting the request.
      const profileRef = doc(db, USERS_COLLECTION, profileId);
      const profileSnapshot = await getDoc(profileRef);

      if (!profileSnapshot.exists()) {
        setError("Your account could not be verified. Please contact support.");
        return;
      }

      const latestProfile = profileSnapshot.data();

      if (latestProfile.uid && latestProfile.uid !== currentUser.uid) {
        setError("Your account could not be verified. Please contact support.");
        return;
      }

      const latestBalance = getBalance(latestProfile);

      if (latestBalance === null) {
        setError("Your account balance could not be verified. Please contact support.");
        return;
      }

      setBalance(latestBalance);

      if (amount > latestBalance) {
        setError("Your withdrawal amount exceeds your available balance.");
        return;
      }

      // This creates a pending request. It does not transfer funds or deduct
      // the balance; those actions must be handled securely by the backend.
      await addDoc(collection(db, WITHDRAWALS_COLLECTION), {
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
        amount,
        currency: "USD",
        crypto_currency: form.crypto_currency,
        network: form.network,
        wallet_address: walletAddress,
        status: "pending",
        admin_note: "",
        createdAt: serverTimestamp(),
        created_at: serverTimestamp(),
      });

      setForm(INITIAL_FORM);
      setMessage(
        "Your withdrawal request has been submitted and is pending admin review."
      );

      await loadWithdrawals(currentUser);
    } catch (err) {
      console.error("Withdrawal submission failed:", err);

      if (err?.code === "permission-denied") {
        setError("Permission denied. Please contact support.");
      } else {
        setError("Unable to submit your request right now. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function copyWallet(address) {
    try {
      await navigator.clipboard.writeText(address);
      setMessage("Wallet address copied.");
    } catch {
      setError("Unable to copy the address. Please copy it manually.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="h-9 w-9 animate-spin text-emerald-400" />
          <p className="text-sm text-slate-400">Loading your withdrawal account...</p>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <Wallet className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
          <h1 className="text-2xl font-bold">Login required</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Please log in to access your EnergyVest withdrawal page.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Withdraw Funds
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Submit and track your cryptocurrency withdrawal requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refreshData(currentUser)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-400"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <section className="space-y-6 lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-900 p-6">
              <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-400/10 blur-2xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <Wallet className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  Account Balance
                </span>
              </div>

              <p className="relative mt-6 text-sm text-slate-400">
                Available balance
              </p>

              <div className="relative mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-emerald-400">$</span>
                <span className="break-all text-4xl font-bold tracking-tight">
                  {balance === null ? "—" : formatMoney(balance)}
                </span>
              </div>

              <div className="relative mt-5 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {profileReady
                  ? "Account balance verified"
                  : "Balance verification required"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold">Withdrawal information</h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <p className="font-medium text-slate-200">Minimum withdrawal</p>
                    <p className="mt-1 text-slate-400">$10.00</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <p className="font-medium text-slate-200">Processing</p>
                    <p className="mt-1 leading-6 text-slate-400">
                      Requests are submitted for admin review. Approval and
                      payment are not automatic.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <p className="font-medium text-slate-200">Check your network</p>
                    <p className="mt-1 leading-6 text-slate-400">
                      Ensure your receiving wallet supports the selected
                      cryptocurrency network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
              <h2 className="text-xl font-semibold">New withdrawal request</h2>
              <p className="mt-2 text-sm text-slate-400">
                Enter the amount and receiving wallet details below.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Withdrawal amount (USD)
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 transition focus-within:border-emerald-500">
                    <span className="pl-4 text-lg text-slate-400">$</span>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="10"
                      step="0.01"
                      inputMode="decimal"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      className="w-full bg-transparent px-3 py-4 text-white outline-none placeholder:text-slate-600"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>Minimum: $10.00</span>
                    <button
                      type="button"
                      disabled={!profileReady || balance === null}
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          amount: String(balance),
                        }))
                      }
                      className="font-medium text-emerald-400 transition hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Use full balance
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-emerald-500"
                    >
                      <option value="USDT">Tether (USDT)</option>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="USDC">USD Coin (USDC)</option>
                    </select>
                  </div>

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
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-emerald-500"
                    >
                      {form.crypto_currency === "USDT" ? (
                        <>
                          <option value="TRC20">TRON (TRC20)</option>
                          <option value="BEP20">BNB Smart Chain (BEP20)</option>
                          <option value="ERC20">Ethereum (ERC20)</option>
                          <option value="SOL">Solana</option>
                        </>
                      ) : form.crypto_currency === "BTC" ? (
                        <option value="Bitcoin">Bitcoin Network</option>
                      ) : form.crypto_currency === "ETH" ? (
                        <option value="ERC20">Ethereum (ERC20)</option>
                      ) : (
                        <>
                          <option value="ERC20">Ethereum (ERC20)</option>
                          <option value="BEP20">BNB Smart Chain (BEP20)</option>
                          <option value="SOL">Solana</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="wallet_address"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Receiving wallet address
                  </label>
                  <textarea
                    id="wallet_address"
                    name="wallet_address"
                    value={form.wallet_address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Paste your receiving wallet address"
                    required
                    className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500"
                  />
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Double-check the address and network before submitting.
                    Transfers to an incompatible network may be lost.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !profileReady ||
                    balance === null ||
                    !profileId
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-4 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      Submitting request...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-5 w-5" />
                      Submit Withdrawal Request
                    </>
                  )}
                </button>

                {!profileReady && (
                  <p className="text-center text-xs leading-5 text-slate-500">
                    Withdrawals will be enabled when your account balance can
                    be verified.
                  </p>
                )}
              </form>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Withdrawal history</h2>
              <p className="mt-1 text-sm text-slate-400">
                Track the status of your submitted requests.
              </p>
            </div>

            <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-400">
              {withdrawals.length} request{withdrawals.length === 1 ? "" : "s"}
            </span>
          </div>

          {withdrawals.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                <ArrowDownLeft className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-medium text-slate-200">
                No withdrawal requests yet
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Your withdrawal requests will appear here after you submit one.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {withdrawals.map((item) => {
                const status = getStatusStyle(item.status);
                const StatusIcon = status.Icon;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-bold text-white">
                          ${formatMoney(item.amount || 0)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(item.createdAt || item.created_at)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-800 pt-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500">Cryptocurrency</p>
                        <p className="mt-1 text-sm font-medium text-slate-200">
                          {item.crypto_currency || "USDT"} · {item.network || "Network not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Receiving address</p>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="min-w-0 break-all text-sm text-slate-300">
                            {item.wallet_address || "Not provided"}
                          </p>
                          {item.wallet_address && (
                            <button
                              type="button"
                              onClick={() => copyWallet(item.wallet_address)}
                              aria-label="Copy wallet address"
                              title="Copy wallet address"
                              className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-emerald-400"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.admin_note && (
                      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-3">
                        <p className="text-xs font-medium text-slate-400">
                          Admin note
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {item.admin_note}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <footer className="py-8 text-center text-xs text-slate-600">
          EnergyVest · Please verify all withdrawal details before submitting.
        </footer>
      </div>
    </main>
  );
}