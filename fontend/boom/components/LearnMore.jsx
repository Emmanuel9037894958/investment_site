"use client";

import React from "react";
import {
  Info,
  Briefcase,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  DollarSign,
  Globe,
  Quote,
} from "lucide-react";
import Invest from "./Invest";

const cards = [
  {
    id: 1,
    icon: Info,
    title: "About Us",
    text: "Trusted investment platform focused on innovation and transparency.",
  },
  {
    id: 2,
    icon: Briefcase,
    title: "Our Services",
    text: "From oil & gas to sustainable investments, we provide global solutions.",
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "Get in Touch",
    text: "We are here to answer your questions and guide your investment journey.",
  },
  {
    id: 4,
    icon: TrendingUp,
    title: "Investment Plans",
    text: "Flexible plans designed to help you achieve financial freedom.",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Secure & Trusted",
    desc: "We prioritize security and transparency, ensuring your funds are always safe.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Track investments in real-time with advanced analytics and reports.",
  },
  {
    icon: DollarSign,
    title: "Profitable Growth",
    desc: "Get access to high-return opportunities backed by expert strategies.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "Invest across multiple industries and global markets with ease.",
  },
];

const testimonials = [
  {
    name: "Michael O.",
    text: "Energy-vest has completely transformed the way I invest. I now have a steady passive income stream and total control over my assets.",
  },
  {
    name: "Sarah A.",
    text: "I love the transparency! Their reports are clear, and withdrawals are always smooth. Highly recommended.",
  },
  {
    name: "James K.",
    text: "Best investment platform I've ever used. Their oil & gas plans are unmatched in profitability and security.",
  },
];

function LearnMore() {
  return (
    <main className="w-full overflow-hidden bg-[#f7f8fa] text-gray-900">
      {/* HERO / INTRO */}
      <section className="w-full px-4 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mx-auto max-w-4xl text-center">

            <h2 className="mt-6 text-3xl font-extrabold leading-[1.08] tracking-tight text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Learn More About{" "}
              <span className="text-orange-500">Energy-vest</span>
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8 md:text-xl">
              At Energy-vest, we go beyond ordinary investment opportunities.
              We empower our clients with reliable, transparent, and global
              investment solutions designed to secure financial freedom.
            </p>
          </div>

          {/* QUICK LINKS - Flowing on page without card boxes */}
          <div className="mt-6 grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.id} className="flex flex-col items-start">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-gray-900">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
                    {card.text}
                  </p>

                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 cursor-pointer hover:underline">
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST / SECURITY */}
      <section className="w-full border-y border-gray-200 bg-white">
        <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 gap-10 px-4 py-8 sm:px-6 sm:py-20 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-16 xl:px-24 2xl:px-32">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Our Commitment
            </span>

            <h3 className="mt-4 text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl md:text-5xl">
              TRUST,{" "}
              <span className="text-orange-500">Security</span>, Prosperity,
              Insight, Success.
            </h3>

            {/* <div className="mt-6 h-1 w-20 rounded-full bg-orange-500" /> */}
          </div>

          <div>
            <p className="text-base leading-7 text-gray-600 sm:text-lg sm:leading-8 md:text-xl">
              We are a global financial institution specializing in diversified
              investment activities across both traditional financial markets
              and the rapidly evolving digital asset space. Our operations are
              powered by a team of highly skilled professional traders with
              deep expertise in equities, commodities, foreign exchange, and
              cryptocurrency exchanges ,delivering reliable strategies
              designed for long-term growth and stability.
            </p>

            <button className="group mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-gray-950 px-7 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-orange-500 hover:shadow-orange-500/20 sm:h-14 sm:px-8 sm:text-base">
              Learn More
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="w-full px-4 py-6 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Why Energy-vest
            </span>

            <h3 className="mt-3 text-3xl font-extrabold text-gray-950 sm:text-4xl md:text-5xl">
              Why Choose <span className="text-orange-500">Us</span>
            </h3>

            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
              Built around security, insight, accessibility, and opportunities
              across global markets.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div key={index} className="flex flex-col items-start">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-950 text-orange-400">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h4 className="mt-5 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="w-full bg-gray-950 px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="mx-auto w-full max-w-[1300px]">
          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Discover Energy-vest
            </span>

            <h3 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
              See How We Operate
            </h3>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/30">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/VIKJXdkwVgA"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Energy-vest Introduction"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="w-full px-4 py-8 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Client Experience
            </span>

            <h3 className="mt-3 text-3xl font-extrabold text-gray-950 sm:text-4xl md:text-5xl">
              What Our Clients Say
            </h3>
          </div>

          <div className=" grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col items-start">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Quote className="h-5 w-5" />
                </div>

                <p className="mt-5 text-base leading-7 text-gray-600">
                  “{testimonial.text}”
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-500">Verified Client</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-4 sm:px-6 sm:pb-20 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="relative mx-auto w-full max-w-[1600px] overflow-hidden rounded-3xl bg-orange-500 px-5 py-8 text-center sm:px-10 sm:py-16 md:px-16 md:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
              Start Your Journey
            </span>

            <h3 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Ready to Secure Your Financial Future?
            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg md:text-xl">
              Join thousands of investors and start growing your wealth today.
            </p>

            <button className="mt-8 inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-orange-600 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-950 hover:text-white sm:px-9 sm:text-base">
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* INVESTMENT PLANS */}
      <section className="w-full">
        <Invest />
      </section>
    </main>
  );
}

export default LearnMore;