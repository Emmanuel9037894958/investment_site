"use client";

import { useEffect, useState } from "react";

const SYMBOLS = [
  { symbol: "BINANCE:BTCUSDT", name: "BTC", icon: "https://cryptoicons.org/api/icon/btc/32" },
  { symbol: "BINANCE:ETHUSDT", name: "ETH", icon: "https://cryptoicons.org/api/icon/eth/32" },
  { symbol: "BINANCE:USDTUSDT", name: "USDT", icon: "https://cryptoicons.org/api/icon/usdt/32" },
  { symbol: "BINANCE:ADAUSDT", name: "ADA", icon: "https://cryptoicons.org/api/icon/ada/32" },
];

export default function LiveTicker({ onSymbolClick }) {
  const [prices, setPrices] = useState(
    SYMBOLS.map((s) => ({ ...s, price: 0, prevPrice: 0 }))
  );

  useEffect(() => {
    const ws = new WebSocket(
      `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );

    ws.onopen = () => {
      SYMBOLS.forEach((s) =>
        ws.send(JSON.stringify({ type: "subscribe", symbol: s.symbol }))
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "trade") {
        setPrices((prev) =>
          prev.map((p) => {
            const trade = data.data.find((d) => d.s === p.symbol);
            if (trade) return { ...p, prevPrice: p.price, price: trade.p };
            return p;
          })
        );
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        SYMBOLS.forEach((s) =>
          ws.send(JSON.stringify({ type: "unsubscribe", symbol: s.symbol }))
        );
      }
      ws.close();
    };
  }, []);

  return (
    <div className="overflow-hidden bg-gray-800 py-2 rounded">
      <div className="flex animate-ticker whitespace-nowrap">
        {prices.concat(prices).map((p, idx) => {
          const isUp = p.price >= p.prevPrice;
          return (
            <div
              key={idx}
              className={`flex items-center px-6 cursor-pointer font-semibold ${
                p.price === 0
                  ? "text-gray-400"
                  : isUp
                  ? "text-green-500"
                  : "text-red-500"
              }`}
              onClick={() => onSymbolClick?.(p.symbol)}
            >
              <img src={p.icon} alt={p.name} className="w-6 h-6 mr-2" />
              {p.name}: ${p.price.toFixed(2)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
