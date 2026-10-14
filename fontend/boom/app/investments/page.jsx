
"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bitcoin,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Copy,
  CreditCard,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Wallet,
  X,
  Zap,
  AlertCircle,
} from "lucide-react";

const API_BASE = "";

const PLANS = [
  {
    value: "starter",
    name: "Starter",
    description: "For exploring the platform",
    icon: Wallet,
    features: ["Account access", "Investment tracking"],
  },
  {
    value: "pro",
    name: "Pro",
    description: "For experienced users",
    icon: Zap,
    features: ["Portfolio overview", "Transaction history"],
  },
  {
    value: "vip",
    name: "VIP",
    description: "For users seeking additional services",
    icon: ShieldCheck,
    features: ["Account overview", "Priority support access"],
  },
];

const CRYPTO_OPTIONS = [
  { value: "btc", label: "Bitcoin (BTC)" },
  { value: "usdttrc20", label: "Tether (USDT TRC20)" },
  { value: "usdtbsc", label: "Tether (USDT BEP20)" },
  { value: "eth", label: "Ethereum (ETH)" },
  { value: "trx", label: "TRON (TRX)" },
];

const formatUSD = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function InvestmentsPage() {
  const [form, setForm] = useState({
    plan: "",
    amount: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedPlan = PLANS.find(
    (item) => item.value === form.plan
  );

  const handleOpenModal = (e) => {
    e.preventDefault();
    setFormError("");

    const amount = Number(form.amount);

    if (!form.plan) {
      setFormError("Please choose an investment plan.");
      return;
    }

    if (!Number.isFinite(amount) || amount < 1 || amount > 1000000) {
      setFormError("Enter an amount between $1 and $1,000,000.");
      return;
    }

    setModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <header className="border-b border-white/10 bg-[#101b30]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d9ad5b] text-[#101b30]">
              <CircleDollarSign size={25} />
            </div>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-white">
                Energy<span className="text-[#d9ad5b]">-</span>Vest
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Investment platform
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-300 sm:flex">
            <Wallet size={17} className="text-[#d9ad5b]" />
            Investment center
          </div>
        </div>
      </header>

      <section className="bg-[#101b30]">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#d9ad5b]">
              Investment services
            </p>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Choose your plan.
              <span className="mt-1 block text-[#d9ad5b]">
                Set your amount.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Select a plan, enter the amount you wish to pay, and choose
              your preferred payment method to continue.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <form onSubmit={handleOpenModal}>
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Select an investment plan
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                Choose the plan you want to continue with.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                const active = form.plan === plan.value;

                return (
                  <button
                    key={plan.value}
                    type="button"
                    onClick={() => {
                      setForm((previous) => ({
                        ...previous,
                        plan: plan.value,
                      }));
                      setFormError("");
                    }}
                    aria-pressed={active}
                    className={`relative flex min-w-0 flex-col rounded-2xl border bg-white p-5 text-left transition sm:p-6 ${
                      active
                        ? "border-emerald-600 ring-2 ring-emerald-100 shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          active
                            ? "bg-emerald-700 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Icon size={23} />
                      </div>

                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          active
                            ? "border-emerald-700 bg-emerald-700 text-white"
                            : "border-slate-300 text-transparent"
                        }`}
                      >
                        <Check size={14} />
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-slate-900">
                      {plan.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {plan.description}
                    </p>

                    <div className="my-5 h-px bg-slate-100" />

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-sm text-slate-600"
                        >
                          <CheckCircle2
                            size={16}
                            className="shrink-0 text-emerald-600"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex items-center justify-between">
                      <span
                        className={`text-sm font-semibold ${
                          active
                            ? "text-emerald-700"
                            : "text-slate-500"
                        }`}
                      >
                        {active ? "Selected" : "Choose plan"}
                      </span>

                      <ChevronRight
                        size={18}
                        className={
                          active
                            ? "text-emerald-700"
                            : "text-slate-400"
                        }
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <CircleDollarSign size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Investment amount
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the amount in US dollars.
                  </p>
                </div>
              </div>

              <label
                htmlFor="investment-amount"
                className="mb-2 mt-7 block text-sm font-semibold text-slate-700"
              >
                Amount to pay
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                  $
                </span>

                <input
                  id="investment-amount"
                  type="number"
                  name="amount"
                  min="1"
                  max="1000000"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={(e) => {
                    setForm((previous) => ({
                      ...previous,
                      amount: e.target.value,
                    }));
                    setFormError("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-10 pr-4 text-xl font-bold text-slate-900 outline-none transition placeholder:text-base placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  required
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[25, 50, 100, 250, 500].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setForm((previous) => ({
                        ...previous,
                        amount: String(value),
                      }));
                      setFormError("");
                    }}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                      Number(form.amount) === value
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50"
                    }`}
                  >
                    ${value}
                  </button>
                ))}
              </div>

              {formError && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  <p>{formError}</p>
                </div>
              )}
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Order summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review your selection before checkout.
              </p>

              <div className="my-5 h-px bg-slate-100" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-semibold text-slate-900">
                    {selectedPlan?.name || "Not selected"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-semibold text-slate-900">
                    {formatUSD(form.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Payment fees</span>
                  <span className="text-right text-xs text-slate-500">
                    Confirm at checkout
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-slate-100" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  Total before fees
                </span>

                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {formatUSD(form.amount)}
                </span>
              </div>

              <button
                type="submit"
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              >
                Continue to payment
                <ArrowRight size={18} />
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                You can review your payment method before continuing.
              </p>
            </aside>
          </div>
        </form>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-slate-500">
          Review the applicable investment terms, fees, and risks before
          making a payment. Investment returns are not guaranteed.
        </p>
      </section>

      {modalOpen && (
        <PaymentModal
          plan={form.plan}
          amount={form.amount}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}

function PaymentModal({ plan, amount, onClose }) {
  const [method, setMethod] = useState("crypto");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-[#07101f]/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        className="my-auto max-h-[95svh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="bg-[#101b30] px-5 py-5 text-white sm:px-7 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e4bd73]">
                Energy-Vest checkout
              </p>

              <h2
                id="payment-modal-title"
                className="mt-2 text-2xl font-bold tracking-tight"
              >
                Choose payment method
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Select how you would like to pay.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close payment window"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="text-xs text-slate-400">Selected plan</p>
              <p className="mt-1 font-semibold capitalize text-white">
                {plan}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Amount</p>
              <p className="mt-1 text-xl font-bold text-[#e4bd73]">
                {formatUSD(amount)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <PaymentMethodButton
              active={method === "crypto"}
              onClick={() => setMethod("crypto")}
              icon={Bitcoin}
              title="Cryptocurrency"
              subtitle="Pay with crypto"
            />

            <PaymentMethodButton
              active={method === "flutterwave"}
              onClick={() => setMethod("flutterwave")}
              icon={CreditCard}
              title="Card / Bank Transfer"
              subtitle="Pay by card or bank"
            />
          </div>

          <div className="mt-5">
            {method === "crypto" ? (
              <NowPaymentsPay
                amount={amount}
                plan={plan}
                onClose={onClose}
              />
            ) : (
              <FlutterwavePay
                amount={amount}
                plan={plan}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodButton({
  active,
  onClick,
  icon: Icon,
  title,
  subtitle,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-0 rounded-xl border p-3.5 text-left transition sm:p-4 ${
        active
          ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <Icon size={22} />

        {active && (
          <CheckCircle2 size={17} className="text-emerald-600" />
        )}
      </div>

      <p className="mt-3 text-sm font-bold">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </button>
  );
}

function NowPaymentsPay({ amount, plan, onClose }) {
  const [crypto, setCrypto] = useState("btc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null);
  const [copied, setCopied] = useState(false);

  const createPayment = async () => {
    setError("");

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount < 1 ||
      numericAmount > 1000000
    ) {
      setError("Please enter a valid payment amount.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again to continue.");
      return;
    }

    try {
      setLoading(true);

      // Send the request to the Next.js API route.
      const response = await fetch("/api/deposits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numericAmount,
          crypto_currency: crypto,
          plan,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create the payment. Please try again."
        );
      }

      if (!data.deposit) {
        throw new Error(
          "Payment details were not returned by the server."
        );
      }

      // Redirect directly to NOWPayments checkout.
      if (data.deposit.payment_url) {
        window.location.href = data.deposit.payment_url;
        return;
      }

      // Keep the payment instructions available if the API
      // returns a payment address but no hosted checkout URL.
      setPayment(data.deposit);
    } catch (err) {
      console.error("Crypto payment error:", err);

      setError(
        err?.message || "Unable to create the payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    if (!payment?.payment_address) return;

    try {
      await navigator.clipboard.writeText(payment.payment_address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Copy payment address error:", err);
      setError("Could not copy the address. Please copy it manually.");
    }
  };

  return (
    <div className="space-y-4">
      {!payment && (
        <div>
          <label
            htmlFor="crypto"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Cryptocurrency and network
          </label>

          <select
            id="crypto"
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
          >
            {CRYPTO_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <ErrorNotice message={error} />}

      {payment && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-sm font-bold text-slate-900">
              Payment instructions
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Follow the payment details provided for this transaction.
            </p>
          </div>

          {payment.crypto_amount && (
            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <p className="text-xs text-slate-500">Amount to send</p>

              <p className="mt-1 break-all text-lg font-bold text-slate-900">
                {payment.crypto_amount} {payment.crypto_currency || ""}
              </p>
            </div>
          )}

          {payment.payment_address && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Payment address
              </label>

              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                <p className="min-w-0 flex-1 break-all text-xs leading-5 text-slate-700">
                  {payment.payment_address}
                </p>

                <button
                  type="button"
                  onClick={copyAddress}
                  aria-label="Copy payment address"
                  className="shrink-0 rounded-lg border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-100"
                >
                  {copied ? (
                    <Check size={17} className="text-emerald-600" />
                  ) : (
                    <Copy size={17} />
                  )}
                </button>
              </div>

              {copied && (
                <p className="mt-1.5 text-xs text-emerald-700">
                  Address copied.
                </p>
              )}
            </div>
          )}

          {payment.payment_url && (
            <a
              href={payment.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Open payment instructions
              <ExternalLink size={17} />
            </a>
          )}

          <p className="text-xs leading-5 text-slate-500">
            Make sure the amount, asset, and network match the instructions
            before sending funds.
          </p>
        </div>
      )}

      {!payment && (
        <p className="text-sm leading-6 text-slate-500">
          Continue to request payment details for your selected cryptocurrency.
        </p>
      )}

      <button
        type="button"
        onClick={createPayment}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Creating payment...
          </>
        ) : payment ? (
          <>
            <ArrowUpRight size={18} />
            Create another payment
          </>
        ) : (
          <>
            Continue securely
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
      >
        Close
      </button>
    </div>
  );
}

function FlutterwavePay({ amount, plan, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
  });

  const [checkoutOpened, setCheckoutOpened] = useState(false);

  const loadFlutterwave = async () => {
    if (window.FlutterwaveCheckout) return;

    const scriptUrl = "https://checkout.flutterwave.com/v3.js";
    let script = document.querySelector(`script[src="${scriptUrl}"]`);

    if (script) {
      await new Promise((resolve, reject) => {
        if (window.FlutterwaveCheckout) {
          resolve();
          return;
        }

        script.addEventListener("load", resolve, { once: true });

        script.addEventListener(
          "error",
          () => reject(new Error("Unable to load checkout.")),
          { once: true }
        );
      });

      return;
    }

    await new Promise((resolve, reject) => {
      script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error("Unable to load checkout."));
      document.body.appendChild(script);
    });
  };

  const handleFlutterwavePay = async (e) => {
    e.preventDefault();
    setError("");
    setCheckoutOpened(false);

    const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again to continue.");
      return;
    }

    if (!publicKey) {
      setError("Card and bank payments are not configured yet.");
      return;
    }

    if (
      !customer.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
    ) {
      setError("Enter your full name and a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await loadFlutterwave();

      const txRef = `EV-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

      window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: txRef,
        amount: Number(amount),
        currency: "USD",
        payment_options: "card,banktransfer",
        customer: {
          email: customer.email.trim(),
          name: customer.name.trim(),
        },
        customizations: {
          title: "Energy-Vest",
          description: `Investment payment - ${plan}`,
          logo: "/logo.png",
        },
        callback: function () {
          setCheckoutOpened(false);
          setError(
            "Checkout has returned. Payment confirmation is pending verification."
          );
        },
        onclose: function () {
          setLoading(false);
          setCheckoutOpened(false);
        },
      });

      setCheckoutOpened(true);
    } catch (err) {
      console.error("Card checkout error:", err);

      setError(
        err?.message || "Unable to open checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFlutterwavePay} className="space-y-4">
      <div>
        <label
          htmlFor="customer-name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Full name
        </label>

        <input
          id="customer-name"
          type="text"
          autoComplete="name"
          maxLength={120}
          value={customer.name}
          onChange={(e) =>
            setCustomer((previous) => ({
              ...previous,
              name: e.target.value,
            }))
          }
          placeholder="Enter your full name"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          required
        />
      </div>

      <div>
        <label
          htmlFor="customer-email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email address
        </label>

        <input
          id="customer-email"
          type="email"
          autoComplete="email"
          maxLength={254}
          value={customer.email}
          onChange={(e) =>
            setCustomer((previous) => ({
              ...previous,
              email: e.target.value,
            }))
          }
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          required
        />
      </div>

      {error && <ErrorNotice message={error} />}

      {checkoutOpened && (
        <p className="text-xs leading-5 text-slate-500">
          Complete or close the checkout window before trying again.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Opening checkout...
          </>
        ) : (
          <>
            Continue securely
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        Close
      </button>
    </form>
  );
}

function ErrorNotice({ message }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5">
      <AlertCircle
        size={18}
        className="mt-0.5 shrink-0 text-red-600"
      />

      <p className="text-sm leading-5 text-red-700">{message}</p>
    </div>
  );
}
