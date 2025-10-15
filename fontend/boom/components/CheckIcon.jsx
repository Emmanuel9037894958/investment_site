"use client";
import React from "react";

export default function CheckIcon({ size = 60, iconScale = 0.95 }) {
  return (
    <div
      className="bg-orange-400 rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white" // check color
        strokeWidth={2}
        style={{ width: size * iconScale, height: size * iconScale }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
}
