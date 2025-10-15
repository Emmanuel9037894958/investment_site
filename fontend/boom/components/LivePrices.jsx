"use client"
import React, { useState, useEffect } from "react";
export default function LivePrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      // don't toggle layout while fetching; just update data
      const res = await fetch("http://localhost/investment_site/api/prices.php");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPrices(data.data || []);
    } catch (err) {
      console.error("Failed to fetch prices:", err);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    // ✅ FIX 1: Lock container height so page never jumps
    <div className="min-h-[200px] grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
      {loading ? (
        <p className="col-span-full text-center text-gray-400">Loading prices...</p>
      ) : prices.length ? (
        prices.map((p, i) => (
          <div
            key={p.symbol} // ✅ use symbol for stable key
            className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center shadow pt-20"
          >
            <p className="font-semibold">{p.symbol}</p>
            {/* ✅ FIX 2: tabular-nums keeps each digit same width */}
            <p className="text-green-400 font-mono tabular-nums">
              ${Number(p.price).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-400">
          No prices available
        </p>
      )}
    </div>
  );
}
