import React from "react";
import { TrendingUp, Users, DollarSign, Globe } from "lucide-react";

export default function TrustAndMarket() {
  const stats = [
    {
      icon: <TrendingUp className="w-10 h-10 text-green-500" />,
      label: "Average Annual Returns",
      value: "+18%",
    },
    {
      icon: <Users className="w-10 h-10 text-green-500" />,
      label: "Active Investors",
      value: "150,000+",
    },
    {
      icon: <DollarSign className="w-10 h-10 text-green-500" />,
      label: "Total Investments",
      value: "$250M+",
    },
    {
      icon: <Globe className="w-10 h-10 text-green-500" />,
      label: "Countries Served",
      value: "30+",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      {/* Stats */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-green-900">
          Why Investors Trust Us
        </h2>
        <p className="text-gray-600 mt-2">
          Building wealth with transparency and security.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mb-20">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 bg-white border rounded-2xl shadow-md hover:shadow-lg transition"
          >
            {stat.icon}
            <h3 className="text-2xl font-bold text-green-800 mt-4">
              {stat.value}
            </h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Market Chart */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold text-center text-green-900 mb-6">
          Live Market Trends
        </h3>
        <div className="bg-white shadow-lg roun ded-2xl overflow-hidden">
          <iframe
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_advanced_chart"
            width="100%"
            height="500"
            style={{ background: "transparent" }}
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>
    </section>
  );
}
