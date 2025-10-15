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
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mb-11">
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500">
                {inView ? <CountUp end={stat.value} duration={2.5} /> : 0}
                {stat.suffix}
              </h2>
              <p className="mt-2 text-gray-700 text-base sm:text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <SecuritySection />
    </section>
  );
}
