"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Download, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ReportsPage() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    profit: 0,
    roi: 0,
    balance: 0,
  });

  useEffect(() => {
    // Simulate performance data
    const mockData = [
      { name: "Mon", value: 1100 },
      { name: "Tue", value: 1180 },
      { name: "Wed", value: 1250 },
      { name: "Thu", value: 1320 },
      { name: "Fri", value: 1400 },
      { name: "Sat", value: 1435 },
      { name: "Sun", value: 1500 },
    ];
    setData(mockData);

    // Mock summary values
    setSummary({
      profit: 380,
      roi: 12.7,
      balance: 1500,
    });
  }, []);

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Day,Value", ...data.map((d) => `${d.name},${d.value}`)].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "investment_report.csv";
    document.body.appendChild(link);
    link.click();
  };

  const exportPDF = () => {
    window.print(); // Quick client-side export simulation
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Performance Reports
      </h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-md border rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 font-medium">Total Profit</h3>
              <TrendingUp className="text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-800">
              ${summary.profit}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 font-medium">ROI</h3>
              <BarChart2 className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-800">
              {summary.roi}%
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 font-medium">Account Balance</h3>
              <TrendingDown className="text-orange-500" />
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-800">
              ${summary.balance}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="shadow-md border rounded-2xl bg-white mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity Table */}
      <Card className="shadow-md border rounded-2xl bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 text-sm"
              >
                <Download size={16} /> CSV
              </button>
              <button
                onClick={exportPDF}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 text-sm"
              >
                <Download size={16} /> PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Asset</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "2025-10-01",
                    asset: "Crude Oil",
                    type: "Buy",
                    amount: 1200,
                    profit: "+8%",
                  },
                  {
                    date: "2025-10-03",
                    asset: "Natural Gas",
                    type: "Sell",
                    amount: 800,
                    profit: "-3%",
                  },
                  {
                    date: "2025-10-05",
                    asset: "Energy ETF",
                    type: "Buy",
                    amount: 950,
                    profit: "+5%",
                  },
                ].map((tx, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50 transition text-sm"
                  >
                    <td className="p-3">{tx.date}</td>
                    <td className="p-3">{tx.asset}</td>
                    <td className="p-3">{tx.type}</td>
                    <td className="p-3">${tx.amount}</td>
                    <td
                      className={`p-3 font-medium ${
                        tx.profit.includes("+")
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {tx.profit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
