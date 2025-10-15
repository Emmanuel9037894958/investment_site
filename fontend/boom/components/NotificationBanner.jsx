"use client";
import React from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * NotificationBanner
 * @param {string} type - "success" | "error" | "warning" | "info"
 * @param {string} message - The message to display
 * @param {function} onClose - Close handler
 */
export default function NotificationBanner({ type = "info", message, onClose }) {
  if (!message) return null;

  // Style presets for each notification type
  const styles = {
    success: {
      bg: "bg-green-100 border-green-500 text-green-800",
      Icon: CheckCircle,
    },
    error: {
      bg: "bg-red-100 border-red-500 text-red-800",
      Icon: AlertTriangle,
    },
    warning: {
      bg: "bg-yellow-100 border-yellow-500 text-yellow-800",
      Icon: AlertTriangle,
    },
    info: {
      bg: "bg-blue-100 border-blue-500 text-blue-800",
      Icon: Info,
    },
  };

  const { bg, Icon } = styles[type] || styles.info;

  return (
    <div
      className={`w-full border-l-4 p-4 mb-4 rounded-md shadow-md flex items-start justify-between ${bg}`}
    >
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-lg font-bold hover:opacity-70"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
