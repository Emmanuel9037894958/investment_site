"use client";

import LiveTicker from "../components/LiveTicker";
import TradingViewChart from "../components/TradingViewChart";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">USA Investment Platform</h1>
      <LiveTicker />
      <div className="mt-6">
        <TradingViewChart symbol="BTCUSDT" />
      </div>
    </div>
  );
}
