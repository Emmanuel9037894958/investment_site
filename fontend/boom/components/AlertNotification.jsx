"use client";
import { useEffect, useState } from "react";

export default function AlertNotification() {
  const names = [
    "James", "Sophia", "Michael", "Emma", "William", "Olivia",
    "Benjamin", "Ava", "Lucas", "Isabella", "Ethan", "Mia",
    "Alexander", "Charlotte", "Daniel", "Amelia", "Henry",
    "Harper", "Matthew", "Evelyn",
  ];

  const actions = [
    "just deposited $5,000!",
    "withdrew $1,200!",
    "started trading with $3,500!",
    "invested $7,800!",
    "made a profit of $900!",
    "joined with $4,000!",
    "is trading with $10,000!",
    "just opened an account!",
    "made a withdrawal of $5,300!",
    "is making big moves!",
  ];

  const countryAlerts = [
    "Someone from USA just deposited $5,000!",
    "A user from Nigeria withdrew $1,200!",
    "Investor from Canada started trading with $3,500!",
    "Someone from Germany invested $7,800!",
    "Trader from UK made a profit of $900!",
  ];

  const [message, setMessage] = useState("");
  const [position, setPosition] = useState("middle");

  useEffect(() => {
    const randomMsg = () => {
      if (Math.random() > 0.5) {
        const n = names[Math.floor(Math.random() * names.length)];
        const a = actions[Math.floor(Math.random() * actions.length)];
        return `🔥 ${n} ${a}`;
      }
      return countryAlerts[Math.floor(Math.random() * countryAlerts.length)];
    };

    const showNotification = () => {
      setMessage(randomMsg());
      setPosition((prev) => (prev === "middle" ? "bottom" : "middle"));
    };

    showNotification();
    const interval = setInterval(showNotification, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 🔥 Notification */}
      <div
        className={`fixed z-[9999] px-5 py-3 rounded-lg 
        text-orange-600 font-bold bg-white text-sm sm:text-base md:text-lg 
        shadow-lg transition-all duration-500 ease-in-out
        ${
          position === "middle"
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-slide-down"
            : "bottom-8 left-1/2 -translate-x-1/2 animate-slide-up"
        }`}
      >
        {message}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -150%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translate(-50%, 150%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0%);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slideDown 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
