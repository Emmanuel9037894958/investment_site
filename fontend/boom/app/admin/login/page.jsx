"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false); // password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return false;
    }
    // basic email format check
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost/investment_site/api/admin/admin_login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // keeps PHP session cookie
          body: JSON.stringify({ email: email.trim(), password }),
        }
      );

      // If server returned non-JSON (HTML error), handle gracefully
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.success) {
          // success -> redirect to admin dashboard
          router.push("/admin/dashboard");
        } else {
          setError(data.message || "Invalid credentials");
        }
      } catch {
        // invalid JSON response (PHP warning, etc.)
        console.error("Unexpected server response:", text);
        setError("Server returned an unexpected response. Check server logs.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Make sure server is running and CORS is configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md bg-gray-900/60 border border-gray-700 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-4 text-green-400">Admin Login</h1>

        {error && (
          <div className="mb-4 text-sm text-center text-red-300 bg-red-900/20 border border-red-700 rounded-md p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={visible ? "text" : "password"}
                placeholder="Your password"
                className="w-full pr-12 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-300 hover:text-white"
              >
                {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Tip: click the eye to toggle visibility</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} EnergyVest Admin Panel
        </div>
      </div>
    </div>
  );
}
