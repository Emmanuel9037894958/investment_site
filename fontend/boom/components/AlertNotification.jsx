"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  UserRound,
  X,
  ShieldCheck,
  Radio,
  Globe2,
} from "lucide-react";

const clientActivities = [
  {
    name: "James",
    country: "United States",
    flag: "🇺🇸",
    action: "opened an account",
    detail: "Account registration",
    type: "account",
  },
  {
    name: "Sophia",
    country: "Nigeria",
    flag: "🇳🇬",
    action: "viewed an investment plan",
    detail: "Investment plans",
    type: "activity",
  },
  {
    name: "Michael",
    country: "United Kingdom",
    flag: "🇬🇧",
    action: "visited the funding page",
    detail: "Account funding",
    type: "activity",
  },
  {
    name: "Emma",
    country: "Canada",
    flag: "🇨🇦",
    action: "reviewed account activity",
    detail: "Account overview",
    type: "activity",
  },
  {
    name: "William",
    country: "Germany",
    flag: "🇩🇪",
    action: "explored the platform",
    detail: "EnergyVest",
    type: "activity",
  },
  {
    name: "Olivia",
    country: "Australia",
    flag: "🇦🇺",
    action: "visited the investment dashboard",
    detail: "Dashboard",
    type: "activity",
  },
  {
    name: "Benjamin",
    country: "South Africa",
    flag: "🇿🇦",
    action: "reviewed the available features",
    detail: "Platform features",
    type: "activity",
  },
  {
    name: "Ava",
    country: "France",
    flag: "🇫🇷",
    action: "visited the account page",
    detail: "Account information",
    type: "activity",
  },
  {
    name: "Lucas",
    country: "Brazil",
    flag: "🇧🇷",
    action: "opened an account",
    detail: "Account registration",
    type: "account",
  },
  {
    name: "Gabriel",
    country: "Brazil",
    flag: "🇧🇷",
    action: "viewed an investment plan",
    detail: "Investment plans",
    type: "activity",
  },
  {
    name: "Isabella",
    country: "Brazil",
    flag: "🇧🇷",
    action: "visited the funding page",
    detail: "Account funding",
    type: "activity",
  },
  {
    name: "Arthur",
    country: "Brazil",
    flag: "🇧🇷",
    action: "reviewed the platform",
    detail: "EnergyVest",
    type: "activity",
  },
  {
    name: "Henry",
    country: "United Kingdom",
    flag: "🇬🇧",
    action: "opened an account",
    detail: "Account registration",
    type: "account",
  },
  {
    name: "Charlotte",
    country: "United Kingdom",
    flag: "🇬🇧",
    action: "viewed the investment dashboard",
    detail: "Dashboard",
    type: "activity",
  },
  {
    name: "George",
    country: "United Kingdom",
    flag: "🇬🇧",
    action: "reviewed available plans",
    detail: "Investment plans",
    type: "activity",
  },
  {
    name: "Amelia",
    country: "United Kingdom",
    flag: "🇬🇧",
    action: "visited the account page",
    detail: "Account information",
    type: "activity",
  },
  {
    name: "Daniel",
    country: "United States",
    flag: "🇺🇸",
    action: "visited the funding page",
    detail: "Account funding",
    type: "activity",
  },
  {
    name: "Mia",
    country: "United States",
    flag: "🇺🇸",
    action: "opened an account",
    detail: "Account registration",
    type: "account",
  },
  {
    name: "Alexander",
    country: "Canada",
    flag: "🇨🇦",
    action: "viewed an investment plan",
    detail: "Investment plans",
    type: "activity",
  },
  {
    name: "Grace",
    country: "Canada",
    flag: "🇨🇦",
    action: "reviewed account activity",
    detail: "Account overview",
    type: "activity",
  },
  {
    name: "Noah",
    country: "Germany",
    flag: "🇩🇪",
    action: "visited the investment dashboard",
    detail: "Dashboard",
    type: "activity",
  },
  {
    name: "Sofia",
    country: "Germany",
    flag: "🇩🇪",
    action: "opened an account",
    detail: "Account registration",
    type: "account",
  },
  {
    name: "Ethan",
    country: "Australia",
    flag: "🇦🇺",
    action: "reviewed available features",
    detail: "Platform features",
    type: "activity",
  },
  {
    name: "Lily",
    country: "Australia",
    flag: "🇦🇺",
    action: "visited the funding page",
    detail: "Account funding",
    type: "activity",
  },
  {
    name: "Samuel",
    country: "Nigeria",
    flag: "🇳🇬",
    action: "opened an account",
    detail: "Account registration",
    type: "account",
  },
  {
    name: "Chiamaka",
    country: "Nigeria",
    flag: "🇳🇬",
    action: "viewed an investment plan",
    detail: "Investment plans",
    type: "activity",
  },
  {
    name: "David",
    country: "South Africa",
    flag: "🇿🇦",
    action: "visited the dashboard",
    detail: "Dashboard",
    type: "activity",
  },
  {
    name: "Ella",
    country: "France",
    flag: "🇫🇷",
    action: "reviewed account activity",
    detail: "Account overview",
    type: "activity",
  },
  {
    name: "Joseph",
    country: "France",
    flag: "🇫🇷",
    action: "opened an account",
    detail: "Account registration",
    type: "account",
  },
  {
    name: "Mateus",
    country: "Brazil",
    flag: "🇧🇷",
    action: "visited the investment dashboard",
    detail: "Dashboard",
    type: "activity",
  },
];

function getRandomIndex(excludeIndex = -1) {
  let next = Math.floor(Math.random() * clientActivities.length);

  while (
    clientActivities.length > 1 &&
    next === excludeIndex
  ) {
    next = Math.floor(Math.random() * clientActivities.length);
  }

  return next;
}

function formatTime(seconds) {
  if (seconds <= 3) return "just now";
  if (seconds < 60) return `${seconds} sec ago`;

  const minutes = Math.floor(seconds / 60);

  if (minutes === 1) return "1 min ago";

  return `${minutes} mins ago`;
}

export default function AlertNotification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
useEffect(() => {
  setCurrentIndex(getRandomIndex());
}, []);

  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const activity = useMemo(
    () => clientActivities[currentIndex],
    [currentIndex]
  );

  useEffect(() => {
    if (dismissed) return;

    const rotationInterval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setCurrentIndex((previous) =>
          getRandomIndex(previous)
        );

        setSecondsAgo(0);
        setVisible(true);
      }, 350);
    }, 6500);

    return () => clearInterval(rotationInterval);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) return;

    const timer = setInterval(() => {
      setSecondsAgo((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [dismissed]);

  if (dismissed) return null;

  const ActivityIcon =
    activity.type === "account" ? UserRound : Activity;

  return (
    <div
      className={`fixed bottom-4 left-3 right-3 z-[9999] sm:bottom-6 sm:left-6 sm:right-auto sm:w-[370px] ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0"
      } transition-all duration-300 ease-out`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">

        {/* LIVE HEADER */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">

          <div className="flex items-center gap-3">

            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Radio size={17} />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900">
                  Live platform activity
                </p>

                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Recent EnergyVest activity
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss activity notification"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>

        </div>

        {/* ACTIVITY */}
        <div className="flex gap-3 p-4">

          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-700">

            <ActivityIcon size={22} />

            <span className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-white text-base shadow-sm">
              {activity.flag}
            </span>

          </div>

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

              <p className="text-sm font-bold text-slate-900">
                {activity.name}
              </p>

              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>

            </div>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              {activity.action}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">

              <Globe2
                size={12}
                className="shrink-0"
              />

              <span>{activity.country}</span>

              <span className="text-slate-300">
                •
              </span>

              <span>{activity.detail}</span>

              <span className="text-slate-300">
                •
              </span>

              <span className="font-medium text-emerald-600">
                {formatTime(secondsAgo)}
              </span>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-2.5">

          <ShieldCheck
            size={14}
            className="shrink-0 text-emerald-600"
          />

          <p className="text-[10px] leading-4 text-slate-500">
            Activity updates automatically while you browse.
          </p>

        </div>

      </div>
    </div>
  );
}