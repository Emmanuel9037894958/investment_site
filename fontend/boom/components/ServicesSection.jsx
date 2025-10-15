"use client";
import React from "react";
import Link from "next/link";
import FaqPreview from "./FaqPreview";

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
      className="px-6 sm:px-10 lg:px-20 bg-gray-100 py-16"
    >
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Our Services
        </h2>
        <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg">
          Explore a wide range of investment opportunities tailored for your
          financial growth.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col items-center text-center"
          >
            {/* 🔹 Service Image */}
            <div className="w-full h-40 rounded-xl mb-4 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* 🔹 Service Title */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              {service.title}
            </h3>

            {/* 🔹 Service Description */}
            <p className="text-gray-600 text-sm sm:text-base md:text-base mb-4">
              {service.description}
            </p>

            {/* 🔹 Learn More Button */}
            <Link href={service.link}>
              <button className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-orange-600 transition-all">
                Learn More
              </button>
            </Link>
          </div>
        ))}
      </div>
      <FaqPreview />
    </section>
  );
}
