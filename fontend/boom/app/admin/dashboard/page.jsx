"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  DollarSign,
  Briefcase,
  LogOut,
  Bell,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp, // Added a relevant icon for investments
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState("");
  const [stats, setStats] = useState({
    users: 0,
    payments: 0,
    investments: 0,
    pending: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          "http://localhost/investment_site/api/get_dashboard_stats.php",
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.success) {
          setStats({
            users: data.stats?.users || 0,
            payments: data.stats?.payments || 0,
            investments: data.stats?.investments || 0,
            pending: data.stats?.pending || 0,
          });
          setUsers(data.users || []);
          setPayments(data.payments || []);
        } else {
          setError(data.message || "Failed to fetch stats");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost/investment_site/api/logout.php", {
      credentials: "include",
    });
    router.push("/admin/login");
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    if (!notif.trim()) return alert("Enter a message");
    const res = await fetch(
      "http://localhost/investment_site/api/admin/send_notification.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: notif }),
      }
    );
    const data = await res.json();
    if (data.success) {
      alert("✅ Notification sent to all users!");
      setNotif("");
    } else alert("❌ Failed to send notification");
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(
      `http://localhost/investment_site/api/admin/delete_user.php?id=${id}`
    );
    const data = await res.json();
    if (data.success) {
      alert("User deleted");
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-400" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-center text-white p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-400">⚠️ {error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-800 border-b border-gray-700 text-white px-8 py-4 sticky top-0 z-10 shadow-xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-indigo-400">
          EnergyVest Admin Panel
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-white font-medium transition-all shadow-lg"
        >
          <LogOut size={20} /> Logout
        </button>
      </header>

      {/* Stats Overview */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
        <StatCard
          icon={<User size={24} />}
          label="Total Users"
          value={stats?.users ?? 0}
          color="indigo"
        />
        <StatCard
          icon={<DollarSign size={24} />}
          label="Payments"
          value={`$${stats?.payments ?? 0}`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Investments"
          value={stats?.investments ?? 0}
          color="purple"
        />
        <StatCard
          icon={<Bell size={24} />}
          label="Pending Requests"
          value={stats?.pending ?? 0}
          color="orange"
        />
      </section>

      {/* --- */}

      {/* Tables Section */}
      <main className="p-8 space-y-10">
        {/* Users Table */}
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-700 overflow-x-auto transition-all duration-300 hover:shadow-indigo-500/30">
          <h2 className="text-xl font-bold mb-5 text-indigo-400">
            👥 Registered Users
          </h2>

          {users.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No users found.</p>
          ) : (
            <div className="min-w-full overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-700 text-gray-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 text-left rounded-tl-xl">ID</th>
                    <th className="p-4 text-left">Username</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Joined</th>
                    <th className="p-4 text-center rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr
                      key={u.id}
                      className={`border-t border-gray-700 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-700/50"
                      } hover:bg-gray-700`}
                    >
                      <td className="p-4 font-mono">{u.id}</td>
                      <td className="p-4 break-words max-w-[150px] font-medium">
                        {u.username || "—"}
                      </td>
                      <td className="p-4 break-words max-w-[220px] text-indigo-300">
                        {u.email}
                      </td>
                      <td className="p-4 whitespace-nowrap">{u.created_at}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-gray-700 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- */}

        {/* Payments Table */}
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-700 overflow-x-auto transition-all duration-300 hover:shadow-green-500/30">
          <h2 className="text-xl font-bold mb-5 text-green-400">
            💲 Recent Payments
          </h2>
          {payments.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No payments found.</p>
          ) : (
            <div className="min-w-full overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-700 text-gray-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 text-left rounded-tl-xl">ID</th>
                    <th className="p-4 text-left">User ID</th>
                    <th className="p-4 text-left">Amount</th>
                    <th className="p-4 text-left">Currency</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-center rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, index) => (
                    <tr
                      key={p.id}
                      className={`border-t border-gray-700 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-700/50"
                      } hover:bg-gray-700`}
                    >
                      <td className="p-4 font-mono">{p.id}</td>
                      <td className="p-4 text-purple-300">{p.user_id}</td>
                      <td className="p-4 font-semibold text-green-400">
                        ${p.amount}
                      </td>
                      <td className="p-4">{p.currency}</td>
                      <td
                        className={`p-4 font-medium ${
                          p.status === "Completed"
                            ? "text-teal-400"
                            : p.status === "Pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {p.status}
                      </td>
                      <td className="p-4 flex justify-center gap-3">
                        {/* Assuming this is to update the payment status */}
                        <button
                          className="text-teal-500 hover:text-teal-400 p-2 rounded-full hover:bg-gray-700 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-gray-700 transition-colors"
                          title="Decline"
                        >
                          <XCircle size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- */}

        {/* Notification Sender */}
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-700 transition-all duration-300 hover:shadow-purple-500/30">
          <h2 className="text-xl font-bold mb-5 text-purple-400">
            📢 Broadcast Notification
          </h2>
          <form
            onSubmit={sendNotification}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              className="flex-grow bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 placeholder-gray-400 outline-none transition-all duration-300"
              placeholder="Enter message to all users..."
              value={notif}
              onChange={(e) => setNotif(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

// Stat Card Component
// I've added a 'color' prop to dynamically set the colors and implemented the custom hover shadow.
function StatCard({ icon, label, value, color }) {
  // Utility function to map color prop to Tailwind classes
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-600",
      ring: "focus:ring-indigo-500",
      iconBg: "bg-indigo-700/50",
      shadow: "shadow-indigo-500/50",
      hoverShadow: "hover:shadow-[0_0_20px_0_rgba(255,255,255,0.7)]", // White Shadow
    },
    green: {
      bg: "bg-green-600",
      ring: "focus:ring-green-500",
      iconBg: "bg-green-700/50",
      shadow: "shadow-green-500/50",
      hoverShadow: "hover:shadow-[0_0_20px_0_rgba(255,255,255,0.7)]", // White Shadow
    },
    purple: {
      bg: "bg-purple-600",
      ring: "focus:ring-purple-500",
      iconBg: "bg-purple-700/50",
      shadow: "shadow-purple-500/50",
      hoverShadow: "hover:shadow-[0_0_20px_0_rgba(249,115,22,0.7)]", // Orange Shadow
    },
    orange: {
      bg: "bg-orange-600",
      ring: "focus:ring-orange-500",
      iconBg: "bg-orange-700/50",
      shadow: "shadow-orange-500/50",
      hoverShadow: "hover:shadow-[0_0_20px_0_rgba(249,115,22,0.7)]", // Orange Shadow
    },
  };

  const styles = colorClasses[color] || colorClasses.indigo; // Default to indigo

  return (
    <div
      className={`bg-gray-800 rounded-xl shadow-xl p-5 flex items-center gap-4 border border-gray-700 transition-all duration-300 transform hover:scale-[1.03] cursor-pointer ${styles.hoverShadow} relative overflow-hidden`}
    >
      {/* Background Gradient Effect */}
      <div className={`absolute inset-0 opacity-10 ${styles.bg}`}></div>

      <div className={`p-4 rounded-full text-white z-10 ${styles.iconBg}`}>
        {icon}
      </div>
      <div className="z-10">
        <p className="text-gray-400 text-sm uppercase tracking-wider">
          {label}
        </p>
        <h3 className="text-3xl font-extrabold text-white mt-1">
          {/* Currency formatting check for payments */}
          {label === "Payments" &&
          typeof value === "string" &&
          value.startsWith("$")
            ? value
            : value.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}
