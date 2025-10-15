"use client";
import { useEffect, useRef } from "react";

export default function TradingViewChart({ symbol }) {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    const scriptId = "tradingview-script";

    // Create script if not exists
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => initWidget(symbol);
      document.body.appendChild(script);
    } else {
      initWidget(symbol);
    }

    function initWidget(sym) {
      // Clear previous chart
      container.current.innerHTML = "";

      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: container.current.id,
          symbol: sym,
          autosize: true,
          interval: "60", // 1-hour candles
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
        });
      }
    }

    // Cleanup
    return () => {
      if (container.current) container.current.innerHTML = "";
    };
  }, [symbol]);

  return (
    <div
      id="tradingview_chart"
      ref={container}
      className="w-full h-[500px] rounded-lg shadow-md"
    />
  );
}
