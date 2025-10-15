"use client";

import { useEffect } from "react";

export default function liveTracker() {
  useEffect(() => {
    // Load TradingView Widget Script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        container_id: "tradingview_chart",
        width: "100%",
        height: "600",
        symbol: "NASDAQ:AAPL", // Change to OIL, BTC, etc.
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Live Market Tracker</h1>
      <div id="tradingview_chart" className="w-full max-w-6xl h-[600px]"></div>
    </div>
  );
}
