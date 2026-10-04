"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (msg) {
      setMsg("");
      setSuccess(false);
    }
  };

  // ----------------------------------------
  // CREATE FIRESTORE USER DOCUMENT
  // ----------------------------------------

  const createFirestoreUser = async (firebaseUser, extraData = {}) => {
    if (!firebaseUser?.uid) {
      throw new Error("Invalid Firebase user.");
    }

    const userRef = doc(db, "users", firebaseUser.uid);
    const existingUser = await getDoc(userRef);

    if (!existingUser.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        fullName:
          extraData.fullName ||
          firebaseUser.displayName ||
          "",
        email: firebaseUser.email || "",
        phone: extraData.phone || "",
        photoURL: firebaseUser.photoURL || "",
        provider: extraData.provider || "email",

        // Financial account fields.
        // These are initial values only.
        balance: 0,
        totalInvested: 0,
        totalWithdrawn: 0,
        totalDeposited: 0,

        status: "active",
        role: "user",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Keep existing financial information untouched.
      // Only update safe profile information.
      await setDoc(
        userRef,
        {
          fullName:
            extraData.fullName ||
            firebaseUser.displayName ||
            existingUser.data().fullName ||
            "",
          email: firebaseUser.email || existingUser.data().email || "",
          photoURL:
            firebaseUser.photoURL ||
            existingUser.data().photoURL ||
            "",
          provider:
            extraData.provider ||
            existingUser.data().provider ||
            "email",
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );
    }
  };

  // ----------------------------------------
  // EMAIL REGISTRATION
  // ----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || googleLoading) return;

    setMsg("");
    setSuccess(false);
    setLoading(true);

    try {
      const fullName = form.fullName.trim();
      const email = form.email.trim().toLowerCase();
      const password = form.password;

      if (!fullName) {
        setMsg("Please enter your full name.");
        return;
      }

      if (!email) {
        setMsg("Please enter your email address.");
        return;
      }

      if (password.length < 6) {
        setMsg("Password must contain at least 6 characters.");
        return;
      }

      // Create the real Firebase Authentication account.
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = credential.user;

      if (!firebaseUser) {
        throw new Error("Firebase did not return a user account.");
      }

      // Save the user's display name in Firebase Auth.
      await updateProfile(firebaseUser, {
        displayName: fullName,
      });

      // Create the corresponding Firestore account.
      await createFirestoreUser(firebaseUser, {
        fullName,
        provider: "email",
      });

      // Get a real Firebase ID token.
      const firebaseToken = await firebaseUser.getIdToken(true);

      // Keep the authenticated user available to the frontend.
      localStorage.setItem("firebaseToken", firebaseToken);

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: firebaseUser.uid,
          full_name: fullName,
          email: firebaseUser.email || email,
          photo: firebaseUser.photoURL || "",
          provider: "email",
        })
      );

      setSuccess(true);
      setMsg("Registration successful! Redirecting to login...");

      setForm({
        fullName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);

      if (error?.code === "auth/email-already-in-use") {
        setMsg(
          "An account with this email already exists. Please log in instead."
        );
      } else if (error?.code === "auth/invalid-email") {
        setMsg("Please enter a valid email address.");
      } else if (error?.code === "auth/weak-password") {
        setMsg("Password must contain at least 6 characters.");
      } else if (error?.code === "auth/network-request-failed") {
        setMsg(
          "Network error. Please check your internet connection and try again."
        );
      } else if (
        error?.code === "permission-denied" ||
        error?.code === "firestore/permission-denied"
      ) {
        setMsg(
          "Your account was authenticated, but Firestore denied profile creation. Please check your Firestore security rules."
        );
      } else {
        setMsg(
          error?.message ||
            "Unable to create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // REAL GOOGLE REGISTRATION
  // ----------------------------------------

  const handleGoogleSignIn = async () => {
    if (googleLoading || loading) return;

    setMsg("");
    setSuccess(false);
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      if (!user) {
        throw new Error("Google authentication did not return a user.");
      }

      // Create or update the user's Firestore account.
      await createFirestoreUser(user, {
        fullName: user.displayName || "",
        provider: "google",
      });

      const firebaseToken = await user.getIdToken(true);

      localStorage.setItem("firebaseToken", firebaseToken);

      localStorage.setItem(
        "googleUser",
        JSON.stringify({
          uid: user.uid,
          full_name: user.displayName || "",
          email: user.email || "",
          photo: user.photoURL || "",
          provider: "google",
        })
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          full_name: user.displayName || "",
          email: user.email || "",
          photo: user.photoURL || "",
          provider: "google",
        })
      );

      setSuccess(true);
      setMsg("Google account verified successfully!");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Google authentication error:", error);

      if (error?.code === "auth/popup-closed-by-user") {
        setMsg("Google sign-in was cancelled.");
      } else if (error?.code === "auth/popup-blocked") {
        setMsg(
          "Your browser blocked the Google sign-in popup. Please allow popups for this site."
        );
      } else if (error?.code === "auth/unauthorized-domain") {
        setMsg(
          "This website domain is not authorized in your Firebase Authentication settings."
        );
      } else if (error?.code === "auth/operation-not-allowed") {
        setMsg(
          "Google Sign-In is not enabled in your Firebase Authentication settings."
        );
      } else if (
        error?.code === "permission-denied" ||
        error?.code === "firestore/permission-denied"
      ) {
        setMsg(
          "Google authentication succeeded, but Firestore denied profile creation. Please check your Firestore security rules."
        );
      } else {
        setMsg(
          error?.message ||
            "Unable to sign in with Google. Please try again."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ----------------------------------------
  // SUCCESS SCREEN
  // ----------------------------------------

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white">
            {googleLoading
              ? "Connecting to Google"
              : "Account created successfully"}
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            {msg}
          </p>

          <div className="mx-auto mt-7 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing your account...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =========================================================
            LEFT SIDE
        ========================================================== */}

        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* LOGO */}

            <Link
              href="/"
              className="flex w-fit items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>

              <div>
                <p className="text-xl font-bold text-white">
                  Energy-Vest
                </p>

                <p className="text-xs text-slate-500">
                  Investment Platform
                </p>
              </div>
            </Link>

            {/* CONTENT */}

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Secure account registration
              </div>

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Start your
                <span className="block text-emerald-400">
                  investment journey.
                </span>
              </h2>

              <p className="mt-6 max-w-lg leading-7 text-slate-400">
                Create your Energy-Vest account and gain access to your
                personal investment dashboard, account activity and
                investment management tools.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <ShieldCheck className="mb-3 h-6 w-6 text-emerald-400" />

                  <p className="font-semibold text-white">
                    Secure Account
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your account credentials are securely protected.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <TrendingUp className="mb-3 h-6 w-6 text-emerald-400" />

                  <p className="font-semibold text-white">
                    Investment Access
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Manage your investment activities from one platform.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Energy-Vest Investment Platform
            </p>
          </div>
        </section>

        {/* =========================================================
            RIGHT SIDE
        ========================================================== */}

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

            <div className="mb-10 flex justify-center lg:hidden">
              <Link
                href="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>

                <div>
                  <p className="text-xl font-bold text-white">
                    Energy-Vest
                  </p>

                  <p className="text-xs text-slate-500">
                    Investment Platform
                  </p>
                </div>
              </Link>
            </div>

            {/* HEADER */}

            <div className="mb-8">
              <p className="mb-3 text-sm font-medium tracking-wide text-emerald-400">
                CREATE ACCOUNT
              </p>

              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Join Energy-Vest and create your personal investment account.
              </p>
            </div>

            {/* FORM CARD */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">

              {/* MESSAGE */}

              {msg && (
                <div
                  className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
                    success
                      ? "border-emerald-500/20 bg-emerald-500/10"
                      : "border-red-500/20 bg-red-500/10"
                  }`}
                >
                  {success ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  )}

                  <p
                    className={`text-sm leading-5 ${
                      success
                        ? "text-emerald-300"
                        : "text-red-300"
                    }`}
                  >
                    {msg}
                  </p>
                </div>
              )}

              {/* =====================================================
                  GOOGLE
              ====================================================== */}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.27-2.09 3.57-5.17 3.57-8.64Z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.13 0-5.79-2.11-6.74-4.95H1.26v3.09A12 12 0 0 0 12 24Z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M5.26 14.29A7.2 7.2 0 0 1 4.88 12c0-.79.14-1.55.38-2.29V6.62H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.38l4-3.09Z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 4.77c1.76 0 3.34.61 4.59 1.81l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.62l4 3.09C5.21 6.88 7.87 4.77 12 4.77Z"
                      />
                    </svg>

                    Continue with Google
                  </>
                )}
              </button>

              {/* AMAZON — INTENTIONALLY INACTIVE */}

              <button
                type="button"
                disabled
                aria-disabled="true"
                className="mt-3 flex h-14 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#131921] text-sm font-semibold text-white opacity-80"
              >
                <span className="relative flex items-center text-lg font-bold">
                  amazon

                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-12 -translate-x-1/2 rotate-[-5deg] rounded-full bg-[#ff9900]" />
                </span>

                Continue with Amazon
              </button>

              {/* DIVIDER */}

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Or register with email
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* =====================================================
                  EMAIL REGISTRATION
              ====================================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* FULL NAME */}

                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      className="h-14 w-full rounded-xl border border-white/10 bg-slate-900 px-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

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
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-14 w-full rounded-xl border border-white/10 bg-slate-900 px-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
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
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="Enter your password"
                      className="h-14 w-full rounded-xl border border-white/10 bg-slate-900 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />

                    {/* EYE */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-emerald-400"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Password must contain at least 6 characters.
                  </p>
                </div>

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* LOGIN */}

              <div className="mt-7 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}

                  <Link
                    href="/login"
                    className="font-semibold text-emerald-400 transition hover:text-emerald-300"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>

            {/* SECURITY */}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4" />
              Secure account registration
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}