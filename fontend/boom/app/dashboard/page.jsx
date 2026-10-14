"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { ProfileSettings } from "@/components/ProfileSettings";
import { TradeForm } from "@/components/TradeForm";

import {
  Wallet,
  TrendingUp,
  DollarSign,
  FileText,
  Menu,
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  BriefcaseBusiness,
} from "lucide-react";

const EMPTY_SUMMARY = {
  cashBalance: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  totalInvested: 0,
};

function toAmount(value) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function formatDate(value) {
  if (!value) return "";

  const date =
    typeof value?.toDate === "function" ? value.toDate() : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString();
}

async function readUserCollection(collectionName, uid) {
  try {
    const recordsQuery = query(
      collection(db, collectionName),
      where("userId", "==", uid),
    );

    const snapshot = await getDocs(recordsQuery);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    if (
      error?.code === "permission-denied" ||
      error?.code === "unavailable" ||
      error?.code === "failed-precondition"
    ) {
      console.warn(`Could not load ${collectionName}:`, error.code);
      return [];
    }

    throw error;
  }
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [performance, setPerformance] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [userName, setUserName] = useState("User");
  const [userTier, setUserTier] = useState("Investor");
  const [userImage, setUserImage] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleProfile = () => {
    setShowProfile((previous) => !previous);
  };

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  const fetchAllData = useCallback(async (firebaseUser) => {
    setIsLoading(true);

    try {
      if (!firebaseUser) {
        setSummary(EMPTY_SUMMARY);
        setTransactions([]);
        setInvestments([]);
        setPerformance([]);
        setUserName("User");
        setUserTier("Investor");
        setUserImage(null);
        return;
      }

      // Load the signed-in user's profile.
      const userRef = doc(db, "users", firebaseUser.uid);

      console.log("Firebase project:", db.app.options.projectId);
      console.log("Authenticated UID:", firebaseUser.uid);
      console.log("Profile document path:", userRef.path);

      const userSnapshot = await getDoc(userRef);

      console.log("Profile document exists:", userSnapshot.exists());

      if (!userSnapshot.exists()) {
        // Keep the dashboard visible if the profile is missing.
        setSummary(EMPTY_SUMMARY);
        setTransactions([]);
        setInvestments([]);
        setPerformance([]);

        setUserName(firebaseUser.displayName || firebaseUser.email || "User");

        setUserTier("Investor");
        setUserImage(firebaseUser.photoURL || null);

        console.warn(
          "Firebase profile document not found for UID:",
          firebaseUser.uid,
        );

        return;
      }

      const profile = userSnapshot.data();

      setUserName(
        profile.fullName ||
          profile.full_name ||
          firebaseUser.displayName ||
          firebaseUser.email ||
          "User",
      );

      setUserImage(profile.avatarUrl || firebaseUser.photoURL || null);

      setUserTier(profile.role === "admin" ? "Administrator" : "Investor");

      // Load investments, payments, and withdrawals.
      const [investmentRecords, paymentRecords, withdrawalRecords] =
        await Promise.all([
          readUserCollection("investments", firebaseUser.uid),
          readUserCollection("payments", firebaseUser.uid),
          readUserCollection("withdrawals", firebaseUser.uid),
        ]);

      const balance = toAmount(profile.balance);

      const totalInvested = investmentRecords
        .filter((item) =>
          ["active", "approved", "completed"].includes(
            String(item.status || "").toLowerCase(),
          ),
        )
        .reduce((total, item) => total + toAmount(item.amount), 0);

      const totalDeposits = paymentRecords
        .filter((item) =>
          ["confirmed", "completed", "success", "successful"].includes(
            String(item.status || "").toLowerCase(),
          ),
        )
        .reduce((total, item) => total + toAmount(item.amount), 0);

      const totalWithdrawals = withdrawalRecords
        .filter((item) =>
          ["approved", "completed", "paid", "successful"].includes(
            String(item.status || "").toLowerCase(),
          ),
        )
        .reduce((total, item) => total + toAmount(item.amount), 0);

      setSummary({
        cashBalance: balance,
        totalDeposits,
        totalWithdrawals,
        totalInvested,
      });

      setInvestments(
        investmentRecords.sort((a, b) => {
          const dateA =
            a.createdAt?.toMillis?.() ||
            (a.createdAt ? new Date(a.createdAt).getTime() : 0);

          const dateB =
            b.createdAt?.toMillis?.() ||
            (b.createdAt ? new Date(b.createdAt).getTime() : 0);

          return dateB - dateA;
        }),
      );

      const combinedTransactions = [
        ...paymentRecords.map((item) => ({
          ...item,
          type: item.type || "deposit",
        })),
        ...withdrawalRecords.map((item) => ({
          ...item,
          type: item.type || "withdrawal",
        })),
      ];

      setTransactions(
        combinedTransactions.sort((a, b) => {
          const dateA =
            a.createdAt?.toMillis?.() ||
            (a.createdAt ? new Date(a.createdAt).getTime() : 0);

          const dateB =
            b.createdAt?.toMillis?.() ||
            (b.createdAt ? new Date(b.createdAt).getTime() : 0);

          return dateB - dateA;
        }),
      );

      // Do not invent historical performance.
      setPerformance([]);
    } catch (exception) {
      console.error("Firebase dashboard loading error:", exception);

      // Errors are logged for debugging but not displayed
      // as a red banner on the dashboard.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      fetchAllData(firebaseUser);
    });

    return () => unsubscribe();
  }, [fetchAllData]);

  // Trading is not connected to a live execution service.
  const [tradeSymbol, setTradeSymbol] = useState("AAPL");
  const [tradeQty, setTradeQty] = useState(1);
  const [tradeType, setTradeType] = useState("buy");

  const handlePlaceOrder = () => {
    alert("Trading is not connected yet. No trade was executed.");
  };

  const formatMoney = (amount) => {
    return `$${toAmount(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 antialiased lg:flex-row">
      {/* Mobile header */}
      <div className="flex items-center justify-between bg-indigo-600 p-4 text-white shadow-md lg:hidden">
        <h1 className="text-lg font-semibold">Investment Dashboard</h1>

        <button
          onClick={toggleSidebar}
          className="text-white outline-none"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:w-64 lg:translate-x-0`}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main dashboard */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          toggleProfile={toggleProfile}
          userName={userName}
          userTier={userTier}
        />

        <main className="flex-1 space-y-8 overflow-y-auto bg-gray-100 p-4 md:p-8">
          {showProfile && (
            <ProfileSettings
              userName={userName}
              setUserName={setUserName}
              userImage={userImage}
              setUserImage={setUserImage}
            />
          )}

          {/* Dashboard statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Available Cash Balance"
              value={summary.cashBalance}
              icon={DollarSign}
              change={0}
            />

            <StatCard
              title="Total Deposits"
              value={summary.totalDeposits}
              icon={ArrowDownToLine}
              change={0}
            />

            <StatCard
              title="Total Withdrawals"
              value={summary.totalWithdrawals}
              icon={ArrowUpFromLine}
              change={0}
            />

            <StatCard
              title="Total Invested"
              value={summary.totalInvested}
              icon={BriefcaseBusiness}
              change={0}
            />
          </div>

          {/* Balance and investments */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3">
                  <Wallet className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Account Balance
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your available account balance
                  </p>
                </div>
              </div>

              {isLoading ? (
                <p className="py-4 text-gray-500">Loading balance...</p>
              ) : (
                <p className="text-4xl font-bold text-gray-900">
                  {formatMoney(summary.cashBalance)}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">Deposited</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {formatMoney(summary.totalDeposits)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">Invested</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {formatMoney(summary.totalInvested)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Investments
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your recorded investment positions
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex min-h-32 items-center justify-center">
                  <p className="text-sm text-gray-500">
                    Loading investments...
                  </p>
                </div>
              ) : investments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
                  <p className="font-medium text-gray-600">
                    No investments yet
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Confirmed investments will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {investments.slice(0, 5).map((investment) => (
                    <div
                      key={investment.id}
                      className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {investment.reference ||
                            investment.name ||
                            "Investment"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {investment.status || "pending"}
                          {investment.createdAt
                            ? ` · ${formatDate(investment.createdAt)}`
                            : ""}
                        </p>
                      </div>

                      <p className="font-bold text-gray-900">
                        {formatMoney(investment.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Performance chart */}
          <div className="grid grid-cols-1 gap-6">
            <PerformanceChart data={performance} isLoading={isLoading} />
          </div>

          {/* Recent transactions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Transactions
                </h2>
                <p className="text-sm text-gray-500">
                  Your recorded payments and withdrawals
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-500">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <p className="font-medium text-gray-600">No transactions yet</p>
                <p className="mt-1 text-sm text-gray-400">
                  Your recorded deposits and withdrawals will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Type
                      </th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Reference
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.slice(0, 10).map((transaction) => (
                      <tr
                        key={`${transaction.type}-${transaction.id}`}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="py-4">
                          <span className="font-medium capitalize text-gray-900">
                            {transaction.type || "—"}
                          </span>
                        </td>

                        <td className="py-4 font-semibold text-gray-900">
                          {formatMoney(transaction.amount)}
                        </td>

                        <td className="py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              [
                                "completed",
                                "confirmed",
                                "successful",
                                "paid",
                              ].includes(
                                String(transaction.status || "").toLowerCase(),
                              )
                                ? "bg-emerald-50 text-emerald-600"
                                : ["failed", "rejected"].includes(
                                      String(
                                        transaction.status || "",
                                      ).toLowerCase(),
                                    )
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {transaction.status || "pending"}
                          </span>
                        </td>

                        <td className="py-4 text-sm text-gray-500">
                          {transaction.reference ||
                            transaction.paymentId ||
                            transaction.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Trade form */}
          <div className="grid grid-cols-1 gap-6">
            <TradeForm
              tradeSymbol={tradeSymbol}
              setTradeSymbol={setTradeSymbol}
              tradeQty={tradeQty}
              setTradeQty={setTradeQty}
              tradeType={tradeType}
              setTradeType={setTradeType}
              handlePlaceOrder={handlePlaceOrder}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
