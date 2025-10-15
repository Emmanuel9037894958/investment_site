"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setSuccess(false);

    try {
      const res = await fetch("http://localhost/investment_site/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // ✅ fixed — send full form data
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setMsg("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000); // redirect after 2 seconds
        setForm({ fullName: "", email: "", password: "" });
      } 
      // ✅ Auto-redirect if email already exists
      else if (data.message?.toLowerCase().includes("already")) {
        setMsg("Email already registered. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } 
      else {
        setMsg(data.message || "Registration failed");
      }
    } catch (err) {
      setMsg("Server error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-xl border border-orange-100">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join <span className="text-orange-600 font-semibold">Energy-Vest</span> today!
        </p>

        {msg && (
          <p
            className={`text-center font-medium mb-4 animate-pulse ${
              success ? "text-green-600" : "text-red-500"
            }`}
          >
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-orange-600 text-white font-semibold shadow-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-300 transition-colors duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 font-medium hover:underline hover:text-orange-700"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
