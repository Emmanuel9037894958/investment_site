"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }

      try {
        setUser(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          setProfile(userData);

          setFullName(
            userData.fullName ||
              firebaseUser.displayName ||
              ""
          );
        } else {
          const newProfile = {
            uid: firebaseUser.uid,
            fullName: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
            provider: "password",
            role: "user",
            balance: 0,
            totalInvested: 0,
            totalDeposited: 0,
            totalWithdrawn: 0,
          };

          setProfile(newProfile);
          setFullName(firebaseUser.displayName || "");
        }
      } catch (error) {
        console.error("Profile loading error:", error);

        setErrorMessage(
          "Unable to load your profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    const cleanName = fullName.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      setSuccessMessage("");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      await updateProfile(user, {
        displayName: cleanName,
      });

      const userRef = doc(db, "users", user.uid);

      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        await updateDoc(userRef, {
          fullName: cleanName,
          updatedAt: serverTimestamp(),
        });
      }

      setProfile((previousProfile) => ({
        ...(previousProfile || {}),
        fullName: cleanName,
      }));

      setSuccessMessage(
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error("Profile update error:", error);

      setErrorMessage(
        error?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="rounded-2xl bg-white px-8 py-10 text-center shadow-lg">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-gray-600">
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    profile?.fullName ||
    user.displayName ||
    "Energy-Vest User";

  const email =
    profile?.email ||
    user.email ||
    "No email available";

  const photoURL =
    profile?.photoURL ||
    user.photoURL ||
    "";

  const balance = Number(profile?.balance || 0);
  const totalInvested = Number(
    profile?.totalInvested || 0
  );
  const totalDeposited = Number(
    profile?.totalDeposited || 0
  );
  const totalWithdrawn = Number(
    profile?.totalWithdrawn || 0
  );

  const firstLetter =
    displayName.charAt(0).toUpperCase();

  let joinedDate = null;

  if (profile?.createdAt?.toDate) {
    joinedDate = profile.createdAt.toDate();
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage your Energy-Vest account information.
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-4xl font-bold text-white ring-4 ring-blue-100">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  firstLetter
                )}
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                {displayName}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {email}
              </p>

              <div className="mt-5 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                {profile?.role === "admin"
                  ? "Administrator"
                  : "Investor Account"}
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Account ID
                </span>

                <span className="max-w-[150px] truncate text-xs font-medium text-gray-700">
                  {user.uid}
                </span>
              </div>

              {joinedDate && (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Joined
                  </span>

                  <span className="text-sm font-medium text-gray-700">
                    {joinedDate.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Main Content */}
          <section className="space-y-6 lg:col-span-2">
            {/* Personal Information */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the information associated with your account.
                </p>
              </div>

              <form
                onSubmit={handleSaveProfile}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Your email address is managed by Firebase
                    Authentication.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Financial Overview */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Account Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your current account figures from Firestore.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-blue-50 p-5">
                  <p className="text-sm font-medium text-blue-600">
                    Available Balance
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ₦{balance.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-5">
                  <p className="text-sm font-medium text-green-600">
                    Total Invested
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ₦{totalInvested.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-5">
                  <p className="text-sm font-medium text-purple-600">
                    Total Deposited
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ₦{totalDeposited.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-5">
                  <p className="text-sm font-medium text-orange-600">
                    Total Withdrawn
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ₦{totalWithdrawn.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Account Status
              </h2>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-green-50 p-4">
                <div className="h-3 w-3 rounded-full bg-green-500" />

                <div>
                  <p className="font-semibold text-green-800">
                    Account Active
                  </p>

                  <p className="text-sm text-green-700">
                    Your Firebase account is currently authenticated.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}