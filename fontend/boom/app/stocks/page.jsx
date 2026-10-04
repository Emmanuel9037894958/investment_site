"use client";

import { useState } from "react";
import LivePrices from "@/components/LivePrices";
import TradingViewChart from "@/components/TradingViewChart";

export default function StocksPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <LivePrices onSymbolClick={setSelectedSymbol} />

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          <TradingViewChart symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
}