"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, HelpCircle, Zap } from "lucide-react";

const faqs = [
  {
    question: "How long does it take to process my withdrawal?",
    answer:
      "Withdrawals are usually processed within 24 hours, depending on your payment method.",
  },
  {
    question: "How many times can I make a deposit?",
    answer:
      "You can make deposits as many times as you like. There are no limits on the number of deposits.",
  },
  {
    question: "How do I make a withdrawal?",
    answer:
      "Simply go to your dashboard, click on 'Withdraw Funds,' choose your payment method, and submit the request.",
  },
  {
    question:
      "How long does my deposit take before it can reflect on my Investments account dashboard?",
    answer:
      "Deposits reflect almost instantly, but in some cases it may take up to 1 to 2 hours.",
  },
  {
    question: "Can I have more than two accounts?",
    answer:
      "No, for security reasons, each user is limited to only one account.",
  },
  {
    question: "How do I make a deposit?",
    answer:
      "Log into your dashboard, select 'Deposit Funds,' choose your preferred payment method, and follow the steps.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen w-full bg-black text-white">
      <div className="w-full">
        
        {/* Company Intro Banner - Full Width */}
        <div className="relative w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-24 px-6 sm:px-12 lg:px-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
          
          <div className="w-full text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest">
              <Zap size={14} /> Who We Are
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Global Financial & Investment <span className="text-orange-500">Excellence</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 w-full max-w-5xl mx-auto leading-relaxed px-4">
              We are an international financial company engaged in investment
              activities, which are related to trading on financial markets and
              cryptocurrency exchanges performed by qualified professional
              traders.
            </p>

            <div className="pt-4">
              <Link href="/about">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold text-sm rounded-xl shadow-xl hover:bg-orange-600 transition-all transform hover:-translate-y-0.5">
                  Learn More About Us
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Begin Trading in 3 Steps - Full Width */}
        <div className="w-full py-24 px-6 sm:px-12 lg:px-20 bg-black">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Simple Onboarding
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Begin Trading in Three Steps
            </h2>
            <p className="mt-4 text-gray-400 text-base sm:text-lg">
              Get started quickly with our seamless account setup and funding process.
            </p>
          </div>

          <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col justify-between p-10 bg-gray-900/30 transition-all duration-300 hover:bg-gray-900/60">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 font-extrabold text-2xl mb-6">
                  01
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Register</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Create an account in a few minutes, verify your email and you are set to go.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col justify-between p-10 bg-gray-900/30 transition-all duration-300 hover:bg-gray-900/60">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 font-extrabold text-2xl mb-6">
                  02
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Deposit</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Choose a deposit plan and payment method that is convenient for you, sit back and watch.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col justify-between p-10 bg-gray-900/30 transition-all duration-300 hover:bg-gray-900/60 sm:col-span-2 lg:col-span-1">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 font-extrabold text-2xl mb-6">
                  03
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Withdraw</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  As soon as your deposit plan duration is completed, you can withdraw directly to your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Full Width */}
        <div className="w-full py-24 px-6 sm:px-12 lg:px-20 bg-gray-950/40">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-4 py-1.5 rounded-full">
              <HelpCircle size={14} /> Got Questions?
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">
              Find quick answers about deposits, withdrawals, and account management.
            </p>
          </div>

          <div className="space-y-4 w-full">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="w-full bg-gray-900/50 transition-colors duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left font-semibold text-white sm:text-lg hover:bg-gray-800/40 transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-400 transition-transform duration-300 ${openIndex === index ? "rotate-180 bg-orange-500 text-white" : ""}`}>
                    <ChevronDown size={18} />
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-300 text-sm sm:text-base leading-relaxed pt-2 bg-gray-900/80 w-full">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}