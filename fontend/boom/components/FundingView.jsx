import { useState } from "react";
import { useClient } from "@/app/context/ClientContext";
import { apiPost } from "../utils/api";

export default function FundingView() {
  const { client, setClient } = useClient();
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Deposit");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const doTransaction = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) return;
    setLoading(true); setMsg("");
    try {
      const res = await apiPost("add_transaction.php", { user_id: client.userId, amount: num, type: mode });
      if (res.success) {
        setClient(prev => ({ ...prev, buyingPower: res.newBuyingPower, recentTransactions: [res.newTransaction, ...(prev.recentTransactions||[])] }));
        setMsg(`${mode} of $${num.toFixed(2)} successful`);
      } else setMsg(res.error||"Transaction failed");
    } catch(err){ setMsg(err.message||"Transaction error"); }
    finally { setLoading(false); setAmount(""); }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="mb-3 text-gray-500 text-sm">Available: <span className="font-bold">${client.buyingPower?.toLocaleString()}</span></div>
      <form onSubmit={doTransaction} className="space-y-3">
        <input type="number" step="0.01" placeholder="Amount" className="w-full p-2 border rounded" value={amount} onChange={e=>setAmount(e.target.value)} />
        <div className="flex gap-2">
          <button type="button" onClick={()=>setMode("Deposit")} className={`flex-1 p-2 rounded ${mode==="Deposit"?"bg-indigo-600 text-white":"bg-gray-100"}`}>Deposit</button>
          <button type="button" onClick={()=>setMode("Withdrawal")} className={`flex-1 p-2 rounded ${mode==="Withdrawal"?"bg-indigo-600 text-white":"bg-gray-100"}`}>Withdraw</button>
        </div>
        <button type="submit" className="w-full p-3 rounded bg-indigo-700 text-white" disabled={loading}>{loading? "Processing..." : mode}</button>
      </form>
      {msg && <div className="text-sm mt-2">{msg}</div>}
      <div className="mt-4 text-xs text-gray-400">Deposits: 1-3 business days. Withdrawals: up to 5 days.</div>
    </div>
  );
}
