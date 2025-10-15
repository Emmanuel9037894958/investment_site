import { WalletIcon, CreditCardIcon, ClockIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { useClient } from "@/app/context/ClientContext";

export default function KeyMetrics() {
  const { client } = useClient();
  const metrics = [
    { name: "Total Portfolio", value: client ? `$${client.totalValue?.toLocaleString()}` : "--", sub: client ? `${client.dailyChange>=0?"+":""}$${client.dailyChange?.toFixed(2)}` : "", icon: WalletIcon },
    { name: "Buying Power", value: client ? `$${client.buyingPower?.toLocaleString()}` : "--", sub: "Available cash", icon: CreditCardIcon },
    { name: "Market Status", value: client?.marketStatus ?? "Closed", sub: "", icon: ClockIcon },
    { name: "Recent Activity", value: client?.recentTransactions?.length ?? 0, sub: "transactions", icon: ChartBarIcon },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m)=>(
        <div key={m.name} className="p-4 rounded-xl bg-white shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <m.icon className="w-8 h-8 text-indigo-600" />
            <div>
              <div className="text-sm text-gray-500">{m.name}</div>
              <div className="text-xl font-bold">{m.value}</div>
              <div className="text-xs text-gray-400">{m.sub}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
