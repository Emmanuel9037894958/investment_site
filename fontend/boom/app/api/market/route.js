import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const COINS = [
  { id: "bitcoin", symbol: "BITCOIN", binance: "BTCUSDT" },
  { id: "ethereum", symbol: "ETHEREUM", binance: "ETHUSDT" },
  { id: "litecoin", symbol: "LITECOIN", binance: "LTCUSDT" },
  { id: "ripple", symbol: "RIPPLE", binance: "XRPUSDT" },
  { id: "cardano", symbol: "CARDANO", binance: "ADAUSDT" },
  { id: "dogecoin", symbol: "DOGECOIN", binance: "DOGEUSDT" },
];

async function fetchCoinGecko() {
  const url = new URL(
    "https://api.coingecko.com/api/v3/simple/price"
  );

  url.searchParams.set(
    "ids",
    COINS.map((coin) => coin.id).join(",")
  );
  url.searchParams.set("vs_currencies", "usd");
  url.searchParams.set("include_24hr_change", "true");

  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko HTTP ${response.status}`);
  }

  const data = await response.json();

  const prices = COINS.filter(
    (coin) => Number.isFinite(Number(data[coin.id]?.usd))
  ).map((coin) => ({
    symbol: coin.symbol,
    price: Number(data[coin.id].usd),
    changesPercentage:
      data[coin.id].usd_24h_change == null
        ? null
        : Number(data[coin.id].usd_24h_change),
  }));

  if (!prices.length) {
    throw new Error("CoinGecko returned no valid prices");
  }

  return prices;
}

async function fetchBinanceFallback() {
  const url = new URL(
    "https://api.binance.com/api/v3/ticker/24hr"
  );

  url.searchParams.set(
    "symbols",
    JSON.stringify(COINS.map((coin) => coin.binance))
  );

  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Binance HTTP ${response.status}`);
  }

  const data = await response.json();

  const prices = COINS.filter((coin) =>
    data.some(
      (item) =>
        item.symbol === coin.binance &&
        Number.isFinite(Number(item.lastPrice))
    )
  ).map((coin) => {
    const item = data.find(
      (entry) => entry.symbol === coin.binance
    );

    return {
      symbol: coin.symbol,
      price: Number(item.lastPrice),
      changesPercentage: Number(item.priceChangePercent),
    };
  });

  if (!prices.length) {
    throw new Error("Binance returned no valid prices");
  }

  return prices;
}

export async function GET() {
  try {
    const prices = await fetchCoinGecko();

    return NextResponse.json(prices, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (coinGeckoError) {
    console.error(
      "CoinGecko unavailable:",
      coinGeckoError.message
    );
  }

  try {
    const prices = await fetchBinanceFallback();

    return NextResponse.json(prices, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (binanceError) {
    console.error(
      "Binance fallback unavailable:",
      binanceError.message
    );

    return NextResponse.json(
      { error: "Market data is temporarily unavailable." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}