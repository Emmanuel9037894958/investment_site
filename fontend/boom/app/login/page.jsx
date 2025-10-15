"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClient } from "@/app/context/ClientContext";

export default function LoginPage() {
  const router = useRouter();
  const { setClient } = useClient();

  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [postLogin, setPostLogin] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost/investment_site/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include", // ✅ required for PHP sessions
      });

      // Ensure PHP sends valid JSON
      const text = await res.text();

      try {
        const data = JSON.parse(text);

        if (data.success) {
          setClient(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));

          setPostLogin(true);
          setTimeout(() => {
            if (data.user.role === "admin") router.push("/admin");
            else router.push("/");
          }, 3000);
        } else {
          setMsg(data.message || "Invalid credentials");
        }
      } catch {
        console.error("Invalid JSON:", text);
        setMsg("Server returned invalid response.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMsg("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading screen after login
  if (postLogin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-semibold">Please hold on, initializing your account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96 space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login
        </h1>

        {msg && <p className="text-red-500 text-center">{msg}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 mb-3 w-full rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 mb-3 w-full rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don not have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
