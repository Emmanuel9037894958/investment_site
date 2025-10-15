"use client";
import { useEffect, useRef } from "react";

export default function TickerTape() {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear old widget/scripts
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: "dark", // black background
      locale: "en",
      largeChartUrl: "",
    });

    container.current.appendChild(script);

    // Cleanup
    return () => {
      if (container.current) container.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={container}
      className="tradingview-widget-container"
      style={{
        width: "100%",
        height: "80px",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#000", // fallback black
      }}
    />
  );
}
