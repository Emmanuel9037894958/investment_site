
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  UserRound,
  X,
  ShieldCheck,
} from "lucide-react";

const sampleActivities = [
  {
    name: "James",
    country: "United States",
    flag: "🇺🇸",
    action: "opened an account",
    detail: "Welcome to EnergyVest",
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
];

export default function AlertNotification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const interval = setInterval(() => {
      setVisible(false);

      const timeout = setTimeout(() => {
        setCurrentIndex((previous) => {
          let next = Math.floor(
            Math.random() * sampleActivities.length
          );

          if (sampleActivities.length > 1) {
            while (next === previous) {
              next = Math.floor(
                Math.random() * sampleActivities.length
              );
            }
          }

          return next;
        });

        setVisible(true);
      }, 350);

      return () => clearTimeout(timeout);
    }, 6500);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const activity = sampleActivities[currentIndex];

  const ActivityIcon =
    activity.type === "account" ? UserRound : Activity;

  return (
    <div
      className={`fixed bottom-4 left-3 right-3 z-[9999] sm:bottom-6 sm:left-6 sm:right-auto sm:w-[360px] ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0"
      } transition-all duration-300 ease-out`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-950/15">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Activity size={17} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900">
                EnergyVest activity
              </p>
              <p className="text-[10px] text-slate-500">
                Sample notification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss activity notification"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

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

              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                Sample
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              {activity.action}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              <span>{activity.flag}</span>
              <span>{activity.country}</span>
              <span className="text-slate-300">•</span>
              <span>{activity.detail}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-2.5">
          <ShieldCheck size={14} className="shrink-0 text-emerald-600" />
          <p className="text-[10px] leading-4 text-slate-500">
            Illustrative activity only. Not a verified live transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
