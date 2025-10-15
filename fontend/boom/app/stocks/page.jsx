"use client";
import { useState } from "react";
import LiveStocks from "@/components/LiveStocks"; 
import TradingViewChart from "@/components/TradingViewChart";

export default function StocksPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT"); // default chart

  return (
    <div className="p-6">
      <LiveStocks onSymbolClick={setSelectedSymbol} />
      <div className="mt-6">
        <TradingViewChart symbol={selectedSymbol} />
      </div>
    </div>
  );
}
