"use client";
import { useEffect, useState } from "react";

export default function ClientTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);

    if (savedUser) {
      fetch(`http://localhost/investment_site/get_transactions.php?user_id=${savedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setTransactions(data.transactions);
        });
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Transactions</h1>
      <table className="border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3">ID</th>
            <th className="border px-3">Type</th>
            <th className="border px-3">Amount</th>
            <th className="border px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="border px-3">{t.id}</td>
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
