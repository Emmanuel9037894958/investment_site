
"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  ChartNoAxesCombined,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  LockKeyhole,
  Activity,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Security & Transparency",
    description:
      "Make informed decisions with clear plan information, accessible account details, and transparent transaction records.",
    points: [
      "Account activity visibility",
      "Clear transaction records",
      "Account verification processes",
    ],
    accent: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  {
    number: "02",
    icon: ChartNoAxesCombined,
    title: "Investment Opportunities",
    description:
      "Explore available investment plans, understand their terms, and review the risks before committing your funds.",
    points: [
      "Plan details at a glance",
      "Risk-aware decisions",
      "Clear investment terms",
    ],
    accent: "from-violet-500 to-indigo-600",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-700",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Convenient Transactions",
    description:
      "Manage funding and withdrawal requests through a streamlined dashboard designed to keep your account activity organized.",
    points: [
      "Simple funding interface",
      "Transaction status visibility",
      "Organized account overview",
    ],
    accent: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-16"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700 shadow-sm">
            <Activity size={15} />
            The EnergyVest Advantage
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              EnergyVest?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Take control of your investment journey with accessible account
            tools, clear information, and a convenient way to manage your
            financial activity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                }}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5 sm:p-8"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.accent} opacity-80 transition-opacity group-hover:opacity-100`}
                />

                <div className="mb-8 flex items-start justify-between gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg} ${feature.iconColor} transition duration-300 group-hover:scale-105`}
                  >
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-bold tracking-widest text-slate-300">
                    {feature.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  {feature.description}
                </p>

                <div className="my-6 h-px bg-slate-100" />

                <ul className="mt-auto space-y-3">
                  {feature.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-indigo-700 transition-colors group-hover:text-indigo-900">
                  <span>Built around your experience</span>
                  <ArrowUpRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:mt-10 sm:flex-row sm:items-center sm:p-6 lg:p-7"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <LockKeyhole size={23} />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-slate-900">
              Make informed financial decisions
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Review investment terms, fees, withdrawal conditions, and
              potential risks before investing. Returns are guaranteed.
            </p>
          </div>

          <ShieldCheck
            size={25}
            className="hidden shrink-0 text-indigo-600 sm:block"
          />
        </motion.div>
      </div>
    </section>
  );
}
