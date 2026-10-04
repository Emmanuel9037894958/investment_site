"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  LockKeyhole,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your administrator email.");
      return;
    }

    if (!password) {
      setError("Please enter your administrator password.");
      return;
    }

    setLoading(true);

    try {
      // ========================================================
      // REAL FIREBASE AUTHENTICATION
      // ========================================================

      const credential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const firebaseUser = credential.user;

      if (!firebaseUser) {
        throw new Error("Firebase authentication failed.");
      }

      // ========================================================
      // GET FRESH FIREBASE TOKEN
      // ========================================================

      const firebaseToken = await firebaseUser.getIdToken(true);

      if (!firebaseToken) {
        throw new Error(
          "Firebase authentication token was not returned."
        );
      }

      // ========================================================
      // READ FIREBASE ADMIN CUSTOM CLAIM
      // ========================================================

      const tokenResult = await firebaseUser.getIdTokenResult(true);
      const claims = tokenResult.claims || {};
      const isAdmin = claims.admin === true;

      // ========================================================
      // DO NOT ALLOW NORMAL USERS INTO ADMIN PANEL
      // ========================================================

      if (!isAdmin) {
        // Sign the user back out because this account does
        // not have administrator privileges.
        await auth.signOut();

        setError(
          "This Firebase account does not have administrator privileges."
        );
        return;
      }

      // ========================================================
      // REAL ADMIN USER DATA
      // ========================================================

      const adminData = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        full_name:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Administrator",
        email: firebaseUser.email || cleanEmail,
        phone: firebaseUser.phoneNumber || null,
        role: "admin",
        status: firebaseUser.disabled ? "suspended" : "active",
        emailVerified: firebaseUser.emailVerified,
        created_at: firebaseUser.metadata?.creationTime || null,
        last_login: firebaseUser.metadata?.lastSignInTime || null,
      };

      // ========================================================
      // STORE REAL FIREBASE SESSION
      // ========================================================

      localStorage.setItem("firebaseToken", firebaseToken);
      localStorage.setItem("token", firebaseToken);
      localStorage.setItem("admin", JSON.stringify(adminData));
      localStorage.setItem("adminUser", JSON.stringify(adminData));
      localStorage.setItem("user", JSON.stringify(adminData));

      // ========================================================
      // SHOW SUCCESS
      // ========================================================

      setSuccess(true);

      // ========================================================
      // SEND ADMIN TO DASHBOARD
      // ========================================================

      setTimeout(() => {
        router.replace("/admin/dashboard");
      }, 700);
    } catch (err) {
      console.error("Firebase admin login error:", err);

      let message = "Unable to sign in. Please check your credentials.";

      switch (err?.code) {
        case "auth/invalid-email":
          message = "Please enter a valid administrator email.";
          break;

        case "auth/user-not-found":
          message = "No Firebase account was found with this email.";
          break;

        case "auth/wrong-password":
          message = "The administrator password is incorrect.";
          break;

        case "auth/invalid-credential":
          message = "Invalid administrator email or password.";
          break;

        case "auth/user-disabled":
          message =
            "This administrator account has been disabled in Firebase.";
          break;

        case "auth/too-many-requests":
          message = "Too many login attempts. Please wait and try again.";
          break;

        case "auth/network-request-failed":
          message =
            "Network connection failed. Please check your internet connection.";
          break;

        case "auth/operation-not-allowed":
          message =
            "Email/password authentication is not enabled in Firebase.";
          break;

        case "auth/internal-error":
          message =
            "Firebase encountered an internal error. Please try again.";
          break;

        default:
          if (err?.message) {
            message = err.message;
          }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // SUCCESS SCREEN
  // ============================================================
  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
            <CheckCircle2 size={42} className="text-emerald-400" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white">
            Administrator authenticated
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Your Firebase administrator account has been verified.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 size={18} className="animate-spin" />
            Opening administrator dashboard...
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // ADMIN LOGIN PAGE
  // ============================================================
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md">
        {/* BRANDING HEADER */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/10">
            <ShieldCheck size={40} className="text-emerald-400" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Administrator Login
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Energy-Vest Management System
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          {/* ERROR ALERT */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-400"
              />
              <p className="text-sm leading-6 text-red-300">{error}</p>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Administrator Email
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="admin@energyvest.com"
                  autoComplete="username"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Administrator Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Secure Login
                </>
              )}
            </button>
          </form>

          {/* SECURITY BANNER */}
          <div className="mt-7 border-t border-slate-800 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Authorized administrators only
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Authentication is secured by Firebase Authentication.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Energy-Vest
        </p>
      </div>
    </main>
  );
}