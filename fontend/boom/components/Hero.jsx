"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import TickerTape from "./TickerTape";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const slides = [
    "Invest in Energy & Finance with Confidence",
    "Grow Your Wealth Safely and Quickly",
    "Track Live Investments in Real-Time",
    "Diversify Your Portfolio with Ease",
    "Join Thousands of Successful Investors",
  ];

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Show loader for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(
        () => setCurrent((prev) => (prev + 1) % slides.length),
        6000
      );
      return () => clearInterval(interval);
    }
  }, [loading]);

  /* ✨ 4–Dot Loader Component */
  const DotLoader = () => {
    const dots = [0, 1, 2, 3];
    return (
      <div className="flex items-center justify-center gap-3">
        {dots.map((d) => (
          <motion.span
            key={d}
            className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-yellow-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: d * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  /* 🔹 Loader screen before hero */
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-black">
        <DotLoader />
        <p className="text-yellow-400 mt-6 text-lg font-semibold tracking-wider">
          Loading&nbsp;your&nbsp;experience…
        </p>
      </section>
    );
  }

  /* 🔹 Actual hero after loader */
  return (
    <section className="relative w-full flex flex-col justify-center items-center overflow-hidden min-h-[80vh] sm:min-h-[90vh]">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videothree.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-12 flex-1 gap-6">
        <motion.div
          key={current}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <h1
            className="
              text-2xl sm:text-4xl md:text-5xl lg:text-6xl
              font-bold leading-tight text-white
              max-w-lg sm:max-w-2xl lg:max-w-5xl mt-24
            "
          >
            {slides[current]}
          </h1>
        </motion.div>

        <p
          className="
            text-sm sm:text-base md:text-lg lg:text-xl
            max-w-sm sm:max-w-2xl mx-auto text-white px-2
          "
        >
          Secure your future with trusted energy investment opportunities.
        </p>

        <div className="flex flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-center">
          <Link href="/register">
            <button
              className="
                bg-yellow-500 text-black
                border border-yellow-500
                hover:bg-transparent hover:text-yellow-500
                font-semibold
                px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5
                rounded-full shadow-lg
                text-sm sm:text-base md:text-lg lg:text-xl
                transition flex items-center justify-center gap-2
              "
            >
              Get Started <ArrowRightCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Link>

          <Link href="/about">
            <button
              className="
                border border-yellow-500 text-yellow-500
                hover:bg-yellow-500 hover:text-black
                font-semibold
                px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5
                rounded-full shadow-lg
                text-sm sm:text-base md:text-lg lg:text-xl
                transition
              "
            >
              Learn More
            </button>
          </Link>
        </div>
      </div>

      <div className="relative z-10 w-full">
        <TickerTape />
      </div>
    </section>
  );
}
