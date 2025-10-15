"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { ProfileSettings } from "@/components/ProfileSettings";
import { TradeForm } from "@/components/TradeForm";
import { Wallet, TrendingUp, DollarSign, FileText, Menu, X } from "lucide-react";

const API_BASE = "http://localhost/investment_site/api";

export const dataService = {
  getSummary: async () => {
    const res = await fetch(`${API_BASE}/summary.php`);
    if (!res.ok) throw new Error("Failed to fetch summary");
    const data = await res.json();
    return data.data;
  },
  getPerformanceHistory: async () => {
    const res = await fetch(`${API_BASE}/performances.php`);
    if (!res.ok) throw new Error("Failed to fetch performance history");
    const data = await res.json();
    return data.data;
  },
  getHoldings: async () => {
    const res = await fetch(`${API_BASE}/holdings.php`);
    if (!res.ok) throw new Error("Failed to fetch holdings");
    const data = await res.json();
    return data.data;
  },
};

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalAssets: 0,
    dailyChange: 0,
    totalGainLoss: 0,
    cashBalance: 0,
  });
  const [performance, setPerformance] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userName, setUserName] = useState("Maria pio");
  const [userTier, setUserTier] = useState("Tier 3 Investor");
  const [userImage, setUserImage] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleProfile = () => setShowProfile((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryData, performanceData, holdingsData] = await Promise.all([
        dataService.getSummary(),
        dataService.getPerformanceHistory(),
        dataService.getHoldings(),
      ]);
      setSummary(summaryData);
      setPerformance(performanceData);
      setHoldings(holdingsData);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Trade form
  const [tradeSymbol, setTradeSymbol] = useState("AAPL");
  const [tradeQty, setTradeQty] = useState(1);
  const [tradeType, setTradeType] = useState("buy");

  const handlePlaceOrder = () => {
    if (tradeQty <= 0) return alert("Quantity must be positive");
    alert(`Order executed: ${tradeType.toUpperCase()} ${tradeQty} shares of ${tradeSymbol}`);
    setTradeQty(1);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 antialiased">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden flex items-center justify-between bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-lg font-semibold">Investment Dashboard</h1>
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-64 z-40`}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleProfile={toggleProfile} userName={userName} userTier={userTier} />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8 space-y-8">
          {/* Profile Settings */}
          {showProfile && (
            <ProfileSettings
              userName={userName}
              setUserName={setUserName}
              userImage={userImage}
              setUserImage={setUserImage}
            />
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="Total Managed Assets" value={summary.totalAssets} icon={Wallet} change={summary.totalGainLoss} />
            <StatCard title="24h Market Change" value={summary.dailyChange} icon={TrendingUp} change={summary.dailyChange} />
            <StatCard title="Available Cash Balance" value={summary.cashBalance} icon={DollarSign} change={0} />
            <StatCard title="Total P&L (All Time)" value={summary.totalGainLoss} icon={FileText} change={summary.totalGainLoss} />
          </div>

          {/* Performance Chart */}
          <div className="grid grid-cols-1 gap-6">
            <PerformanceChart data={performance} isLoading={isLoading} />
          </div>

          {/* Trade Form */}
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

          {error && <p className="text-red-500 font-semibold mt-4">{error}</p>}
        </main>
      </div>
    </div>
  );
}
