
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowRightCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import TickerTape from "./TickerTape";

const slides = [
  {
    eyebrow: "Energy & Finance",
    title: "Invest in Energy & Finance with Confidence",
    description:
      "Explore investment opportunities across energy and financial markets with a platform designed to keep you informed.",
  },
  {
    eyebrow: "Your Financial Journey",
    title: "Build Your Financial Future With Purpose",
    description:
      "Discover opportunities, understand your options, and make informed decisions about your financial goals.",
  },
  {
    eyebrow: "Smarter Insights",
    title: "Stay Connected to the Markets That Matter",
    description:
      "Follow market movements and access investment information in one convenient place.",
  },
  {
    eyebrow: "Diversification",
    title: "Explore Opportunities Across Multiple Markets",
    description:
      "Learn about different asset classes and explore opportunities that align with your individual objectives.",
  },
  {
    eyebrow: "Welcome to Energy-vest",
    title: "A More Informed Approach to Investing",
    description:
      "Get started with Energy-vest and explore the tools and information available to support your investment journey.",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((previous) => (previous + 1) % slides.length);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative isolate flex min-h-[90svh] w-full flex-col overflow-hidden bg-[#080b10] text-white sm:min-h-[92svh] lg:min-h-[95svh]"
      aria-label="Energy-vest introduction"
    >
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[#171b22] via-[#080b10] to-[#251608]" />

      <video
        className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoReady(false)}
      >
        <source src="/videothree.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 -z-10 bg-black/50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/45 to-black/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      <div className="pointer-events-none absolute -right-32 top-20 -z-10 h-72 w-72 rounded-full bg-orange-500/10 blur-[100px] sm:h-96 sm:w-96" />

      <div className="mx-auto flex w-full max-w-[1800px] flex-1 items-center px-4 pb-12 pt-2 min-[400px]:px-5 sm:px-8 sm:pb-14 sm:pt-3 md:px-12 lg:px-20 lg:pb-16 lg:pt-4 xl:px-28 2xl:px-36">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(230px,0.42fr)] lg:gap-10 xl:gap-16">
          <div className="mx-auto w-full max-w-4xl lg:mx-0">
            <div className="relative min-h-[240px] min-[400px]:min-h-[250px] sm:min-h-[270px] md:min-h-[280px] lg:min-h-[275px] xl:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: current === 4 ? -6 : 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute inset-x-0 top-0"
                >
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400 sm:mb-4 sm:text-xs">
                    {slides[current].eyebrow}
                  </p>

                  <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight text-white min-[400px]:text-[2rem] sm:text-4xl sm:leading-tight md:text-5xl lg:text-[2.6rem] xl:text-5xl">
                    {slides[current].title.split(" ").map((word, index) => {
                      const highlightedWords = [
                        "Confidence",
                        "Purpose",
                        "Matter",
                        "Markets",
                        "Investing",
                      ];

                      const cleanWord = word.replace(/[.,!?]/g, "");
                      const isHighlighted =
                        highlightedWords.includes(cleanWord);

                      return (
                        <span
                          key={`${word}-${index}`}
                          className={
                            isHighlighted ? "text-orange-400" : undefined
                          }
                        >
                          {word}{" "}
                        </span>
                      );
                    })}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-200 min-[400px]:text-[15px] sm:mt-5 sm:text-base sm:leading-7 lg:text-[15px] xl:text-base">
                    {slides[current].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-5 flex w-full flex-col gap-3 min-[400px]:flex-row sm:mt-6 sm:w-auto sm:gap-4"
            >
              <Link
                href="/investments"
                className="group inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-orange-400 bg-orange-500 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black min-[400px]:w-auto sm:min-h-12 sm:px-6"
              >
                Get Started
                <ArrowRightCircle
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/about"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/30 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-orange-400/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 min-[400px]:w-auto sm:min-h-12 sm:px-6"
              >
                Discover More
                <ArrowRight size={17} className="text-orange-400" />
              </Link>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden w-full max-w-sm justify-self-end lg:block"
          >
            <div className="rounded-3xl border border-white/15 bg-black/30 p-6 shadow-2xl backdrop-blur-xl xl:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/30 bg-orange-500/10 text-orange-400">
                <ShieldCheck size={24} />
              </div>

              <h2 className="mt-5 text-xl font-bold leading-snug text-white xl:text-2xl">
                Make Informed Financial Decisions
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-300">
                Access platform information, explore available opportunities,
                and review the details before making investment decisions.
              </p>

              <div className="my-6 h-px w-full bg-white/15" />

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                  <ArrowRight size={15} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Explore the Platform
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Get familiar with the services and features available.
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-orange-400 hover:text-orange-400"
              >
                Learn About Us
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>

      <div className="relative z-10 w-full border-t border-white/10 bg-black/35 backdrop-blur-md">
        <TickerTape />
      </div>
    </section>
  );
}
