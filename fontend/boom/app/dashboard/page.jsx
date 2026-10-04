"use client";

import { useState, useEffect, useCallback } from "react";

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

const API_BASE = "http://localhost:5000/api";

export const dataService = {
  getSummary: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You are not logged in. Please log in again.");
    }

    const res = await fetch(`${API_BASE}/dashboard/summary`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch dashboard data");
    }

    return data;
  },
};

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    cashBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInvested: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);

  const [performance, setPerformance] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userName, setUserName] = useState("User");
  const [userTier, setUserTier] = useState("Investor");
  const [userImage, setUserImage] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await dataService.getSummary();

      if (data.user) {
        setUserName(data.user.full_name || "User");

        setUserTier(
          data.user.role === "admin" ? "Administrator" : "Investor"
        );
      }

      if (data.summary) {
        setSummary({
          cashBalance: Number(data.summary.cashBalance || 0),
          totalDeposits: Number(data.summary.totalDeposits || 0),
          totalWithdrawals: Number(data.summary.totalWithdrawals || 0),
          totalInvested: Number(data.summary.totalInvested || 0),
        });
      }

      setTransactions(data.transactions || []);
      setInvestments(data.investments || []);

      /*
        The current Node.js backend does not yet provide
        fake performance-history data.

        We intentionally leave this empty instead of
        inventing investment performance.
      */
      setPerformance([]);
    } catch (e) {
      console.error("Dashboard loading error:", e);

      if (
        e.message?.toLowerCase().includes("token") ||
        e.message?.toLowerCase().includes("logged in")
      ) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(e.message || "Unable to load dashboard data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ==========================================
  // TRADE FORM
  // ==========================================

  const [tradeSymbol, setTradeSymbol] = useState("AAPL");
  const [tradeQty, setTradeQty] = useState(1);
  const [tradeType, setTradeType] = useState("buy");

  const handlePlaceOrder = () => {
    /*
      Trading has not been connected to the Node.js backend yet.

      We intentionally do NOT show "Order executed" here,
      because that would be fake financial activity.
    */

    alert(
      "Trading is not connected yet. No trade was executed."
    );
  };

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 antialiased lg:flex-row">
      {/* ==========================================
          MOBILE HEADER
      ========================================== */}

      <div className="flex items-center justify-between bg-indigo-600 p-4 text-white shadow-md lg:hidden">
        <h1 className="text-lg font-semibold">
          Investment Dashboard
        </h1>

        <button
          onClick={toggleSidebar}
          className="text-white outline-none"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:static lg:w-64 lg:translate-x-0`}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          toggleProfile={toggleProfile}
          userName={userName}
          userTier={userTier}
        />

        <main className="flex-1 space-y-8 overflow-y-auto bg-gray-100 p-4 md:p-8">
          {/* ==========================================
              PROFILE
          ========================================== */}

          {showProfile && (
            <ProfileSettings
              userName={userName}
              setUserName={setUserName}
              userImage={userImage}
              setUserImage={setUserImage}
            />
          )}

          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* ==========================================
              REAL ACCOUNT STATISTICS
          ========================================== */}

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

          {/* ==========================================
              ACCOUNT OVERVIEW
          ========================================== */}

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
                    Your real available balance
                  </p>
                </div>
              </div>

              <p className="text-4xl font-bold text-gray-900">
                {formatMoney(summary.cashBalance)}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Deposited
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {formatMoney(summary.totalDeposits)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Invested
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {formatMoney(summary.totalInvested)}
                  </p>
                </div>
              </div>
            </div>

            {/* ==========================================
                INVESTMENTS
            ========================================== */}

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
                    Your real investment positions
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
                    Your investments will appear here after you make one.
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
                          {investment.reference || "Investment"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {investment.status || "active"}
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

          {/* ==========================================
              PERFORMANCE
          ========================================== */}

          <div className="grid grid-cols-1 gap-6">
            <PerformanceChart
              data={performance}
              isLoading={isLoading}
            />
          </div>

          {/* ==========================================
              TRANSACTIONS
          ========================================== */}

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
                  Real account transactions from MySQL
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-500">
                  Loading transactions...
                </p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <p className="font-medium text-gray-600">
                  No transactions yet
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Your deposits, withdrawals and investments will appear here.
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
                        key={transaction.id}
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
                              transaction.status === "completed"
                                ? "bg-emerald-50 text-emerald-600"
                                : transaction.status === "failed"
                                ? "bg-red-50 text-red-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {transaction.status || "pending"}
                          </span>
                        </td>

                        <td className="py-4 text-sm text-gray-500">
                          {transaction.reference || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ==========================================
              TRADE FORM
          ========================================== */}

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