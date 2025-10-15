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
  Users,
} from "lucide-react";
import Invest from "./Invest";

// 🔹 Cards Data
const cards = [
  {
    id: 1,
    icon: <Info className="w-10 h-10 text-orange-500" />,
    title: "About Us",
    text: "Trusted investment platform focused on innovation and transparency.",
  },
  {
    id: 2,
    icon: <Briefcase className="w-10 h-10 text-orange-500" />,
    title: "Our Services",
    text: "From oil & gas to sustainable investments, we provide global solutions.",
  },
  {
    id: 3,
    icon: <MessageSquare className="w-10 h-10 text-orange-500" />,
    title: "Get in Touch",
    text: "We are here to answer your questions and guide your investment journey.",
  },
  {
    id: 4,
    icon: <TrendingUp className="w-10 h-10 text-orange-500" />,
    title: "Investment Plans",
    text: "Flexible plans designed to help you achieve financial freedom.",
  },
];

// 🔹 Features Data
const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
    title: "Secure & Trusted",
    desc: "We prioritize security and transparency, ensuring your funds are always safe.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
    title: "Smart Analytics",
    desc: "Track investments in real-time with advanced analytics and reports.",
  },
  {
    icon: <DollarSign className="w-8 h-8 text-orange-500" />,
    title: "Profitable Growth",
    desc: "Get access to high-return opportunities backed by expert strategies.",
  },
  {
    icon: <Globe className="w-8 h-8 text-orange-500" />,
    title: "Global Reach",
    desc: "Invest across multiple industries and global markets with ease.",
  },
];

// 🔹 Testimonials
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
    <div className="bg-gray-50 sm:px-10 md:px-20 py-16">
      {/* 🔹 Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 text-center">
        Learn More About{" "}
        <span className="text-orange-500">Energy-vest</span>
      </h2>
      <p className="text-center mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
        At Energy-vest, we go beyond ordinary investment opportunities. 
        We empower our clients with reliable, transparent, and global 
        investment solutions designed to secure financial freedom.
      </p>

      {/* 🔹 Cards Section */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col items-center text-center border rounded-lg shadow-md p-6 bg-white transition-all hover:shadow-lg hover:shadow-orange-500/40"
          >
            {card.icon}
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {card.title}
            </h3>
            <p className="mt-2 text-gray-600 text-sm">{card.text}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Trust Section */}
      <div className="bg-gray-50 px-6 sm:px-10 md:px-20 py-16">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
            TRUST, <span className="text-orange-500">Security</span>, 
            Prosperity, Insight, Success.
          </h3>
          <p className="mt-6 text-gray-700 text-base sm:text-lg md:text-xl text-justify">
            We are a global financial institution specializing in diversified investment 
            activities across both traditional financial markets and the rapidly evolving 
            digital asset space. Our operations are powered by a team of highly skilled 
            professional traders with deep expertise in equities, commodities, foreign 
            exchange, and cryptocurrency exchanges — delivering reliable strategies 
            designed for long-term growth and stability.
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-2 bg-black text-white 
             rounded-lg h-12 w-44 font-medium shadow-md 
             hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-400/50 
             transition-all duration-300 ease-in-out mt-6 mx-auto md:mx-0"
        >
          Learn More <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* 🔹 Features Section */}
      <div className="py-16">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          Why Choose <span className="text-orange-500">Us</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-md bg-white p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              {feature.icon}
              <h4 className="mt-4 text-lg font-semibold text-gray-800">
                {feature.title}
              </h4>
              <p className="mt-2 text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Video Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <div
          className="relative w-full overflow-hidden rounded-lg shadow-lg"
          style={{ paddingTop: "56.25%" }}
        >
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/VIKJXdkwVgA"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title="Energy-vest Introduction"
          />
        </div>
      </div>

      {/* 🔹 Testimonials Section */}
      <div className="py-20">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          What Our Clients Say
        </h3>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="border rounded-lg shadow-md bg-white p-6 text-center hover:shadow-lg transition"
            >
              <p className="text-gray-600 italic">"{t.text}"</p>
              <h4 className="mt-4 font-semibold text-gray-800">{t.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 CTA Section */}
      <div className="bg-orange-500 py-12 px-6 text-center rounded-2xl text-white">
        <h3 className="text-3xl sm:text-4xl font-bold">
          Ready to Secure Your Financial Future?
        </h3>
        <p className="mt-4 text-lg">
          Join thousands of investors and start growing your wealth today.
        </p>
        <button className="mt-6 bg-white text-orange-600 px-8 py-3 rounded-lg shadow hover:shadow-lg font-semibold">
          Get Started Now
        </button>
      </div>

      {/* 🔹 Investment Plans Section */}
      <Invest />
    </div>
  );
}

export default LearnMore;
