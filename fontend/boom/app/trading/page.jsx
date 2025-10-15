"use client";
import Footer from "@/components/Footer";
import TradingViewChart from "@/components/TradingViewChart";
import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
// import {TradingViewChart} from "@/components/TradingViewChart";


export default function TradingPage() {
  const [marketData, setMarketData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const res = await fetch("/api/market");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (Array.isArray(json)) {
        setMarketData(json);
        setError("");
      } else {
        setError("Unexpected data format from /api/market");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch live prices.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 60_000);
    return () => clearInterval(timer);
  }, []);

  const featuredAssets = [
    {
      title: "Crypto",
      desc: "Trade top coins like Bitcoin, Ethereum & more with real-time liquidity.",
      icon: <LineChart className="w-10 h-10 text-yellow-500" />,
    },
    {
      title: "Stocks",
      desc: "Access US & global equities with low commissions and instant execution.",
      icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
    },
    {
      title: "Forex",
      desc: "24/5 currency trading with tight spreads across 50+ pairs.",
      icon: <ArrowUpRight className="w-10 h-10 text-green-500" />,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-8 lg:px-16 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Global Trading Hub
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Trade crypto, stocks, and forex with lightning-fast execution,
          advanced charts, and institutional-grade security.
        </p>
        <Link href='/register'>
        <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow">
          Open Live Account
        </button>
        </Link>
      </section>

      {/* Live Market Overview */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Live Market Overview
        </h2>

        {loading && <p className="text-gray-500">Loading live prices…</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Live Market Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(marketData) &&
            marketData.map((asset) => {
              const price = asset.price ?? 0;
              const changePct = asset.changesPercentage ?? 0;
              const isPositive = changePct >= 0;

              return (
                <div
                  key={asset.symbol}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {asset.symbol}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white my-2">
                    ${price.toFixed(2)}
                  </p>
                  <span
                    className={`flex items-center font-medium ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {changePct.toFixed(2)}%
                  </span>
                </div>
              );
            })}
        </div>
      </section>

      {/* Featured Asset Classes */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Trade Multiple Markets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAssets.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chart */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Real-Time Trading Chart
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <TradingViewChart />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Start Trading?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Join thousands of investors worldwide. Create an account and start
          trading within minutes.
        </p>
        <div className="space-x-4">
          <Link href="/register">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow">
              Get Started
            </button>
          </Link>
         <Link href="/about">
          <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-transparent dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-xl shadow">
            Learn More
          </button>
         </Link>
        </div>
        <div className="mt-16">
          <Footer />
        </div>
      </section>
    </main>
  );
}
