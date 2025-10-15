"use client";
import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  const handleInvest = async () => {
    const res = await fetch("http://localhost/investment_site/invest.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, amount }),
    });
    const data = await res.json();
    setMsg(data.message);
  };

  const handleWithdraw = async () => {
    const res = await fetch("http://localhost/investment_site/withdraw.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, amount }),
    });
    const data = await res.json();
    setMsg(data.message);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome {user.name}</h1>
      <p className="mb-4">Balance: ${user.balance}</p>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={handleInvest}
        className="bg-green-600 text-white px-4 py-2 mr-2 rounded"
      >
        Invest
      </button>
      <button
        onClick={handleWithdraw}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Withdraw
      </button>

      {msg && <p className="mt-4 text-blue-600">{msg}</p>}
    </div>
  );
}
