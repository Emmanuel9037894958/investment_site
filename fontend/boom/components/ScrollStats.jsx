"use client";

import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import SecuritySection from "./SecuritySection";

const stats = [
  { id: 1, value: 51, suffix: "+", label: "Million Transactions" },
  { id: 2, value: 100.6, suffix: "+", label: "Thousand Active Accounts" },
  { id: 3, value: 1020, suffix: "+", label: "Trusted Partners" },
  { id: 4, value: 15, suffix: "+", label: "Years of Experience" },
];

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative w-full overflow-hidden bg-white py-20 sm:py-28">
      {/* Subtle modern background glow accent */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[800px] rounded-full bg-emerald-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div ref={ref} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-950 p-8 shadow-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              <div className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {inView ? (
                  <CountUp 
                    end={stat.value} 
                    duration={2.5} 
                    decimals={stat.value % 1 !== 0 ? 1 : 0} 
                  />
                ) : (
                  0
                )}
                <span className="text-emerald-400">{stat.suffix}</span>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <SecuritySection />
      </div>
    </section>
  );
}