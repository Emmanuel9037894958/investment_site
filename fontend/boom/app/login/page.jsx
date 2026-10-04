"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useClient } from "@/app/context/ClientContext";

export default function LoginPage() {
  const router = useRouter();
  const { setClient } = useClient();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (msg) {
      setMsg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setMsg("");
    setLoading(true);

    try {
      const email = form.email.trim().toLowerCase();
      const password = form.password;

      if (!email || !password) {
        setMsg("Email and password are required.");
        setLoading(false);
        return;
      }

      if (!auth) {
        throw new Error(
          "Firebase authentication is not configured correctly."
        );
      }

      // ==========================================================
      // REAL FIREBASE AUTHENTICATION
      // ==========================================================

      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = credential.user;

      if (!firebaseUser) {
        throw new Error("Firebase did not return a valid user.");
      }

      // ==========================================================
      // GET FRESH FIREBASE ID TOKEN
      // ==========================================================

      const firebaseToken = await firebaseUser.getIdToken(true);

      if (!firebaseToken) {
        throw new Error("Unable to obtain Firebase authentication token.");
      }

      // ==========================================================
      // READ FIREBASE CUSTOM CLAIMS
      // ==========================================================

      const tokenResult = await firebaseUser.getIdTokenResult(true);
      const claims = tokenResult.claims || {};
      const isAdmin = claims.admin === true;

      // ==========================================================
      // REAL USER OBJECT
      // ==========================================================

      const userData = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        full_name:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Energy-Vest User",
        email: firebaseUser.email || email,
        phone: firebaseUser.phoneNumber || null,
        role: isAdmin ? "admin" : "user",
        status: firebaseUser.disabled ? "suspended" : "active",
        emailVerified: firebaseUser.emailVerified,
        created_at: firebaseUser.metadata?.creationTime || null,
        last_login: firebaseUser.metadata?.lastSignInTime || null,
      };

      // ==========================================================
      // SAVE REAL FIREBASE SESSION
      // ==========================================================

      localStorage.setItem("firebaseToken", firebaseToken);
      localStorage.setItem("token", firebaseToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // ==========================================================
      // UPDATE CLIENT CONTEXT
      // ==========================================================

      if (typeof setClient === "function") {
        setClient(userData);
      }

      // ==========================================================
      // SUCCESS
      // ==========================================================

      setLoginSuccess(true);

      // ==========================================================
      // REAL ROLE-BASED REDIRECT
      // ==========================================================

      setTimeout(() => {
        if (isAdmin) {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/");
        }
      }, 700);
    } catch (error) {
      console.error("Firebase login error:", error);

      let errorMessage =
        "Unable to sign in. Please check your details and try again.";

      switch (error?.code) {
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;

        case "auth/user-not-found":
          errorMessage = "No account exists with this email address.";
          break;

        case "auth/wrong-password":
          errorMessage = "The password you entered is incorrect.";
          break;

        case "auth/invalid-credential":
          errorMessage = "Invalid email or password.";
          break;

        case "auth/user-disabled":
          errorMessage =
            "This account has been disabled. Please contact support.";
          break;

        case "auth/too-many-requests":
          errorMessage =
            "Too many login attempts. Please wait a few minutes and try again.";
          break;

        case "auth/network-request-failed":
          errorMessage =
            "Network connection failed. Please check your internet connection.";
          break;

        case "auth/operation-not-allowed":
          errorMessage =
            "Email/password authentication is not enabled in Firebase.";
          break;

        case "auth/internal-error":
          errorMessage =
            "Firebase encountered an internal error. Please try again.";
          break;

        default:
          if (error?.message) {
            errorMessage = error.message;
          }
      }

      setMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SUCCESS SCREEN
  // ============================================================
  if (loginSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white">
            Login successful
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Your Firebase account has been authenticated successfully.
          </p>

          <div className="mx-auto mt-7 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting...
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // LOGIN PAGE
  // ============================================================
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ======================================================
            LEFT BRANDING
        ====================================================== */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link href="/" className="flex w-fit items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>

              <div>
                <p className="text-xl font-bold text-white">Energy-Vest</p>

                <p className="text-xs text-slate-500">
                  Investment Platform
                </p>
              </div>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Secure account access
              </div>

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Welcome back to your
                <span className="block text-emerald-400">
                  investment journey.
                </span>
              </h2>

              <p className="mt-6 max-w-lg leading-7 text-slate-400">
                Access your account, monitor your portfolio, review your
                transactions and manage your investment activities from one
                secure platform.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <ShieldCheck className="mb-3 h-6 w-6 text-emerald-400" />

                  <p className="font-semibold text-white">Secure Access</p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Protected authentication for your account.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <TrendingUp className="mb-3 h-6 w-6 text-emerald-400" />

                  <p className="font-semibold text-white">
                    Portfolio Access
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    View your account activity and investments.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Energy-Vest Investment Platform
            </p>
          </div>
        </section>

        {/* ======================================================
            LOGIN SECTION
        ====================================================== */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* MOBILE BRAND */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>

                <div>
                  <p className="text-xl font-bold text-white">Energy-Vest</p>

                  <p className="text-xs text-slate-500">
                    Investment Platform
                  </p>
                </div>
              </Link>
            </div>

            {/* HEADING */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium tracking-wide text-emerald-400">
                ACCOUNT LOGIN
              </p>

              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Sign in to continue to your Energy-Vest account.
              </p>
            </div>

            {/* LOGIN CARD */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
              {/* ERROR */}
              {msg && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                  <p className="text-sm leading-5 text-red-300">{msg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      disabled={loading}
                      className="h-14 w-full rounded-xl border border-white/10 bg-slate-900 px-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      disabled={loading}
                      className="h-14 w-full rounded-xl border border-white/10 bg-slate-900 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-emerald-400 disabled:opacity-50"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* OPTIONS */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-emerald-500"
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* REGISTER */}
              <div className="mt-7 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-emerald-400 transition hover:text-emerald-300"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            {/* SECURITY */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4" />
              Secured by Firebase Authentication
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}