"use client";
import React from "react";
import Link from "next/link";
import FaqPreview from "./FaqPreview";
import { ArrowRight } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      id: 1,
      title: "Forex Trading",
      description: "Forex is a portmanteau of foreign currency and exchange...",
      link: "https://financialit.net/news/trading-systems/forex-indicators-every-trader-should-know",
      image: "/forext.jpeg",
    },
    {
      id: 2,
      title: "Real Estate Investments",
      description: "Real estate investments involve the purchase, ownership, management...",
      link: "/services/real-estate",
      image: "/realEastate.jpeg",
    },
    {
      id: 3,
      title: "Gold Investments",
      description: "Commonly seen as a great store of wealth...",
      link: "/services/gold-investments",
      image: "/Gold.jpg",
    },
    {
      id: 4,
      title: "Retirement Planning",
      description: "Saving for retirement can be a daunting task...",
      link: "/services/retirement-planning",
      image: "/recuriteimage.jpeg",
    },
    {
      id: 5,
      title: "Medical Cannabis",
      description: "For many years we have been working conscientiously...",
      link: "/services/medical-cannabis",
      image: "/medicine.jpeg",
    },
    {
      id: 6,
      title: "Cryptocurrencies",
      description:
        "Energy-Vest.xyz now offers all traders the opportunity to trade top-ranked digital coins 24/7...",
      link: "/services/cryptocurrencies",
      image: "/currency.jpeg",
    },
    {
      id: 7,
      title: "Financial Planning",
      description:
        "A financial plan is a comprehensive evaluation of an investors current and future financial state...",
      link: "/services/financial-planning",
      image: "/finical.jpeg",
    },
    {
      id: 8,
      title: "Oil and Gas",
      description: "Anyone can invest in the oil market to make a profit...",
      link: "/services/oil-gas",
      image: "/oil.webp",
    },
    {
      id: 9,
      title: "Loans and Grants",
      description: "Getting a loan does not have to be intimidating...",
      link: "/services/loans-grants",
      image: "/loans2.jpeg",
    },
    {
      id: 10,
      title: "Stock or Share",
      description: "A stock or share represents ownership in a company...",
      link: "https://corporatefinanceinstitute.com/resources/equities/what-is-a-stock/",
      image: "/stocks.jpeg",
    },
  ];

  return (
    <section
      id="learn-more"
      className="w-full bg-[#f7f8fa] py-20 px-6 sm:px-10 lg:px-20 text-gray-900"
    >
      <div className="mx-auto max-w-7xl text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
          Global Opportunities
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-gray-950">
          Our Services
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
          Explore a wide range of investment opportunities tailored for your
          financial growth and long-term security.
        </p>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="group flex flex-col items-start text-left"
          >
            {/* Service Image with smooth hover effect */}
            <div className="w-full h-56 rounded-2xl mb-5 overflow-hidden shadow-sm bg-gray-200">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Service Title */}
            <h3 className="text-xl font-bold text-gray-950 mb-2">
              {service.title}
            </h3>

            {/* Service Description */}
            <p className="text-gray-600 text-sm leading-6 mb-5 flex-1">
              {service.description}
            </p>

            {/* Learn More Action Link */}
            <Link href={service.link}>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 transition-colors group-hover:text-orange-600">
                Learn More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-24">
        <FaqPreview />
      </div>
    </section>
  );
}