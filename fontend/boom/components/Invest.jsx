"use client";
import React from "react";
import Image from "next/image";
import whatappImage from "../public/whatappImage.jpg";
import { Coins, ArrowRightCircle } from "lucide-react";
import ScrollStats from "./ScrollStats";
import Link from "next/link";

const plans = [
  {
    id: 1,
    title: "STAKING A",
    min: "$100.00",
    max: "$500.00",
    profit: "4.5%",
    duration: "Daily for just 24hours",
    referral: "10%",
    category: "Crypto Currency Trading",
    link: "https://www.tradingview.com/",
  },
  {
    id: 2,
    title: "STAKING B",
    min: "$850.00",
    max: "$1,500.00",
    profit: "5.0%",
    duration: "Daily for just 24hours",
    referral: "20%",
    category: "Crypto Currency Trading",
    link: "https://www.tradingview.com/",
  },
  {
    id: 3,
    title: "STAKING C",
    min: "$2,000.00",
    max: "$5,000.00",
    profit: "6.5%",
    duration: "Daily for just 24hours",
    referral: "25%",
    category: "Crypto Currency Trading",
    link: "https://www.tradingview.com/",
  },
  {
    id: 4,
    title: "STAKING D",
    min: "$5,001.00",
    max: "$10,000.00",
    profit: "10.0%",
    duration: "Daily for 24hours",
    referral: "30%",
    category: "Crypto Currency Trading",
    link: "https://www.tradingview.com/",
  },
];

function Invest() {
  return (
    <>
      {/* 🔹 Investment Section with video & plans */}
      <section className="relative w-full py-16 mt-5 px-6 sm:px-10 md:px-20 overflow-hidden">
        {/* 🔹 Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video4.mp4" type="video/mp4" />
        </video>

        {/* 🔹 Optional Dark Overlay for readability */}
        {/* <div className="absolute inset-0 bg-black/60 -z-10"></div> */}

        {/* 🔹 Content */}
        <div className="relative z-10 text-white text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Invest on{" "}
            <span className="text-orange-400">Crypto Currency Trading</span>
          </h1>
          <p className="mt-4 text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed">
            Choose the perfect staking plan that suits your financial goals. Our
            crypto investment packages are designed to give you flexible options,
            steady profits, and the confidence of trading with professionals.
          </p>
        </div>

        {/* 🔹 Plans Grid */}
        <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between border rounded-2xl shadow-md p-6 bg-white/90 hover:bg-white transition-all"
            >
              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <Coins className="w-10 h-10 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {plan.title}
                </h3>
              </div>

              {/* Details */}
              <ul className="mt-4 space-y-2 text-gray-600 text-sm md:text-base">
                <li>Minimum: {plan.min}</li>
                <li>Maximum: {plan.max}</li>
                <li>Profit: {plan.profit}</li>
                <li>Duration: {plan.duration}</li>
                <li>Referral Bonus: {plan.referral}</li>
                <li>
                  Category:{" "}
                  <a
                    href={plan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline font-medium"
                  >
                    {plan.category}
                  </a>
                </li>
              </ul>

              {/* Button */}
             <Link href="/investments">
              <button
                className="mt-6 flex items-center justify-center gap-2 bg-black text-white 
                         rounded-lg h-11 w-full font-medium shadow-md 
                         hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-400/50 
                         transition-all duration-300 ease-in-out"
              >
                Get Started <ArrowRightCircle className="w-5 h-5" />
              </button>
             </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Separate last text (not styled by section above) */}
      <div className="text-center mt-8 px-6 max-w-4xl mx-auto">
  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
    Energy-Vest offers Card to investors on the REAL ASSET FUND PLAN
  </h1>
  <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
    At <span className="font-semibold text-orange-500">Energy-Vest</span>, we believe 
    financial freedom should be accessible to everyone. That is why we created the 
    <span className="font-semibold"> Energy-Vest Global Investor Card</span> — a secure 
    and reliable way for our investors to enjoy their returns with ease.
  </p>
  <p className="mt-3 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
    With a minimum balance of <span className="font-semibold">$1,000</span>, you all receive 
    a virtual card instantly, while a physical card is mailed to you. The card works at 
    <span className="font-semibold"> over 45 million merchants and ATMs worldwide</span>, 
    anywhere major credit cards are accepted.
  </p>
  <p className="mt-3 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
    Backed by Energy-Vests commitment to 
    <span className="font-semibold"> trust, transparency, and security</span>, this card 
    gives you the confidence to invest, spend, and grow your wealth globally.
  </p>
  <p className="mt-4 font-semibold text-orange-600 text-base sm:text-lg md:text-xl">
     Invest smart. Spend freely. Trust Energy-Vest.
  </p>
</div>
<div className="mt-8 flex justify-center">
  <Image
    src="/whatappImage.jpg"   // since it's inside /public
    alt="WhatsApp Contact"
    width={500}               // required
    height={400}              // required
    className="rounded-xl shadow-lg"
  />
</div>
<div>
    <ScrollStats />
</div>
    </>
  );
}

export default Invest;
