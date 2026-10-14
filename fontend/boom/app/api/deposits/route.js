import { NextResponse } from "next/server";

const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1/invoice";

export async function POST(request) {
  try {
    const body = await request.json();

    const amount = Number(body?.amount);
    const crypto = String(body?.crypto_currency || "").toLowerCase();
    const plan = String(body?.plan || "Investment");

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid investment amount.",
        },
        { status: 400 }
      );
    }

    const allowedCurrencies = [
      "btc",
      "usdttrc20",
      "usdtbsc",
      "eth",
      "trx",
    ];

    if (!allowedCurrencies.includes(crypto)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported cryptocurrency.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY;

    if (!apiKey) {
      console.error("NOWPAYMENTS_API_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          message: "NOWPayments API key is not configured on the server.",
        },
        { status: 500 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://investment-app-tau.vercel.app";

    const orderId = `EV-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}`;

    const payload = {
      price_amount: amount,
      price_currency: "usd",
      order_id: orderId,
      order_description: `EnergyVest ${plan} investment`,
      ipn_callback_url: `${appUrl}/api/nowpayments/ipn`,
      success_url: `${appUrl}/investment?payment=success`,
      cancel_url: `${appUrl}/investment?payment=cancelled`,
    };

    /*
      IMPORTANT:

      NOWPayments hosted invoices are created in fiat/price currency
      and the customer can complete the payment through the hosted
      NOWPayments page.

      The selected crypto is passed separately below when supported
      by the invoice configuration.
    */

    const nowPaymentsResponse = await fetch(NOWPAYMENTS_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const nowPaymentsData = await nowPaymentsResponse.json();

    console.log("NOWPayments response:", nowPaymentsData);

    if (!nowPaymentsResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            nowPaymentsData?.message ||
            nowPaymentsData?.error ||
            "NOWPayments failed to create the invoice.",
          details: nowPaymentsData,
        },
        {
          status: nowPaymentsResponse.status,
        }
      );
    }

    const paymentUrl =
      nowPaymentsData?.invoice_url ||
      nowPaymentsData?.payment_url ||
      nowPaymentsData?.url;

    if (!paymentUrl) {
      console.error(
        "NOWPayments did not return an invoice/payment URL:",
        nowPaymentsData
      );

      return NextResponse.json(
        {
          success: false,
          message: "NOWPayments did not return a payment URL.",
          details: nowPaymentsData,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "NOWPayments invoice created successfully.",
      deposit: {
        id: nowPaymentsData?.id || orderId,
        order_id: orderId,
        amount,
        crypto_currency: crypto,
        plan,
        payment_url: paymentUrl,
        invoice_url: nowPaymentsData?.invoice_url || paymentUrl,
        status:
          nowPaymentsData?.payment_status ||
          nowPaymentsData?.status ||
          "waiting",
        nowpayments: nowPaymentsData,
      },
    });
  } catch (error) {
    console.error("NOWPayments deposit error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "An unexpected error occurred while creating the payment.",
      },
      { status: 500 }
    );
  }
}