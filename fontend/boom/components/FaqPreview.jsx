"use client";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "How long does it take to process my withdrawal?",
    answer:
      "Withdrawals are usually processed within 24 hours, depending on your payment method.",
  },
  {
    question: "How many times can I make a deposit?",
    answer:
      "You can make depositMs as many times as you like. There are no limits on the number of deposits.",
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
    <section className="min-h-screen bg-black text-white py-12 px-6 mt-14">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* 🔹 Company Intro */}
        <div className="text-center p-8 bg-gray-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(249,115,22,0.7)]">
          <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are an international financial company engaged in investment
            activities, which are related to trading on financial markets and
            cryptocurrency exchanges performed by qualified professional
            traders.
          </p>
         <Link  href="/about">
          <button className="mt-6 px-6 py-2 bg-orange-500 text-white font-medium rounded-lg shadow-md hover:bg-orange-600 transition">
            Learn More
          </button>
         </Link>
        </div>

        {/* 🔹 Begin Trading in 3 Steps */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-10">
            Begin Trading in Three Steps
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Step 1 */}
            <div className="p-6 bg-gray-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(249,115,22,0.7)] hover:-translate-y-2">
              <span className="text-4xl font-extrabold text-orange-500">
                1
              </span>
              <h3 className="text-xl font-semibold mt-4">Register</h3>
              <p className="text-gray-300 mt-2">
                Create an account in a few minutes, verify your email and you
                are set to go.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-gray-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(249,115,22,0.7)] hover:-translate-y-2">
              <span className="text-4xl font-extrabold text-orange-500">
                2
              </span>
              <h3 className="text-xl font-semibold mt-4">Deposit</h3>
              <p className="text-gray-300 mt-2">
                Choose a deposit plan and payment method that is convenient for
                you, sit back and watch.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-gray-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(249,115,22,0.7)] hover:-translate-y-2">
              <span className="text-4xl font-extrabold text-orange-500">
                3
              </span>
              <h3 className="text-xl font-semibold mt-4">Withdraw</h3>
              <p className="text-gray-300 mt-2">
                As soon as your deposit plan duration is completed, you can
                withdraw directly to your wallet.
              </p>
            </div>
          </div>
        </div>

        {/* 🔹 FAQ Section */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-4 text-left font-medium text-white hover:bg-gray-800 transition-colors"
                >
                  {faq.question}
                  <span className="ml-2 text-orange-500 text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="p-4 text-gray-300 border-t border-gray-700 bg-gray-900">
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
