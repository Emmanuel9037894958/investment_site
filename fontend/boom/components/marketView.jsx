import React, { useEffect, useState } from "react";

export default function MarketView() {
  const [market, setMarket] = useState([]);

  const fetchMarket = async () => {
    try {
      const res = await fetch("http://localhost/investment_site/api/market.php", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        console.warn("Market fetch failed:", res.status);
        return;
      }

      const data = await res.json();
      console.log("Market data:", data);

      if (data.success) {
        setMarket(data.markets || []); // adjust according to your PHP response
      } else {
        console.warn("Backend error:", data.error);
      }
    } catch (err) {
      console.error("Error fetching market:", err.message);
    }
  };

  useEffect(() => {
    fetchMarket();
  }, []);

  if (!market.length)
    return <div className="p-4 text-gray-500">Loading market data…</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-bold text-lg mb-2">Market Overview</h2>
      <ul>
        {market.map((item) => (
          <li key={item.id} className="border-b py-2 flex justify-between">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
