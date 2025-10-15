import { NextResponse } from "next/server";

// choose any coins from CoinGecko's list of IDs
const COINS = [
  "bitcoin",
  "ethereum",
  "litecoin",
  "ripple",
  "cardano",
  "dogecoin",
];

export async function GET() {
  try {
    const ids = COINS.join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Map to your desired format
    const formatted = Object.keys(data).map((coin) => ({
      symbol: coin.toUpperCase(),
      price: data[coin].usd,
      changesPercentage: data[coin].usd_24h_change,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("CoinGecko error:", err);
    return NextResponse.json(
      { error: "Failed to fetch crypto prices" },
      { status: 500 }
    );
  }
}
