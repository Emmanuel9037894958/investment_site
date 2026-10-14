"use client";

import React from "react";
import { ShieldCheck, Lock, Server, CheckCircle2 } from "lucide-react";

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "Bank-Grade Encryption",
    description: "All personal data and transactional communications are secured using advanced TLS/SSL protocols.",
  },
  {
    icon: Lock,
    title: "Asset Safeguarding",
    description: "Client portfolios and funds are managed through highly secure, multi-layer authorization controls.",
  },
  {
    icon: Server,
    title: "Protected Infrastructure",
    description: "Our platform operates on robust, redundant cloud systems with continuous security monitoring.",
  },
];

export default function SecuritySection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0b1426] py-8 text-white sm:py-28">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            <CheckCircle2 size={15} />
            Enterprise Protection
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Your Security Is Our <span className="text-emerald-400">Top Priority</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
            We employ rigorous security standards and protocols to ensure your account, 
            investments, and privacy remain fully protected at all times.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {securityFeatures.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={26} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}