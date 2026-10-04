"use client";

import { useEffect, useRef } from "react";

export default function TradingViewChart({
  symbol = "NASDAQ:AAPL",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");

    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (
        !window.TradingView ||
        !containerRef.current
      ) {
        return;
      }

      new window.TradingView.widget({
        container_id: containerRef.current.id,
        width: "100%",
        height: 600,
        symbol,
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        autosize: true,
      });
    };

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-gray-900">
      <div
        ref={containerRef}
        id="tradingview_chart"
        className="h-[600px] w-full"
      />
    </div>
  );
}