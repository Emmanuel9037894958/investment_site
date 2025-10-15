"use client";
import { useEffect, useState } from "react";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost/investment_site/admin_transactions.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTransactions(data.transactions);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
      <table className="border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3">ID</th>
            <th className="border px-3">User</th>
            <th className="border px-3">Email</th>
            <th className="border px-3">Type</th>
            <th className="border px-3">Amount</th>
            <th className="border px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="border px-3">{t.id}</td>
              <td className="border px-3">{t.name}</td>
              <td className="border px-3">{t.email}</td>
              <td className="border px-3">{t.type}</td>
              <td className="border px-3">${t.amount}</td>
              <td className="border px-3">{t.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
