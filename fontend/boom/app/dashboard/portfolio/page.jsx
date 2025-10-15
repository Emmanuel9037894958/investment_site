"use client";
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  RefreshCw,
  BarChart,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

/**
 * Aesthetic and Responsive Loading Component
 * Simulates data fetching by displaying a professional spinner
 * and contextually relevant messages for an investment dashboard.
 */
const PortfolioLoader = () => (
  <div className="flex flex-col items-center justify-center p-8 sm:p-12 h-[70vh] w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 animate-pulse-slow">
    <div className="relative">
      {/* Outer Ring */}
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full"></div>
      {/* Spinning Icon */}
      <RefreshCw className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 animate-spin-slow" />
    </div>

    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-6 mb-2">
      Retrieving Real-Time Portfolio Data...
    </h2>
    <p className="text-sm text-gray-500 max-w-sm text-center">
      Securing live prices and calculating metrics. This may take a moment based
      on market connectivity.
    </p>

    {/* Mock progress bar to enhance visual effect */}
    <div className="w-full max-w-xs mt-6 bg-gray-200 rounded-full h-1.5 overflow-hidden">
      {/* The width is static here to show 'continuous' loading, but could be dynamic */}
      <div
        className="h-1.5 bg-indigo-500 rounded-full animate-pulse-fast"
        style={{ width: "85%" }}
      ></div>
    </div>
  </div>
);

/**
 * Main Portfolio Page Component
 * Currently configured to always show the continuous loading state.
 */
export default function PortfolioPage() {
  // State set permanently to true to demonstrate the continuous loading effect as requested.
  const [isLoading, setIsLoading] = useState(true);

  // Custom Tailwind animation classes defined inline for this single file component
  const style = `
        @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 2s linear infinite;
        }
        @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-fast {
            animation: pulse-slow 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    `;

  // Function to handle browser navigation back
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback for when there is no history (e.g., direct link)
      // You might redirect to a main dashboard page here instead.
      console.log(
        "No history to go back to. Implement fallback navigation if needed."
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Apply custom styles */}
      <style>{style}</style>

      <header className="mb-8">
        {/* Navigation and Title Container */}
        <div className="flex items-center justify-between mb-4">
          {/* Go Back Button */}
          <button
            onClick={handleGoBack}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 p-2 rounded-lg hover:bg-indigo-100"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Go Back</span>
          </button>

          {/* Spacer for alignment if needed, or keep Title inline below */}
          <div></div>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 flex items-center">
          <BarChart className="w-8 h-8 mr-3 text-indigo-600" />
          Portfolio Dashboard
        </h1>
        <p className="text-base text-gray-600 max-w-2xl">
          Viewing current investment status and performance metrics.
        </p>
      </header>

      {/* Content Display based on Loading State */}
      {isLoading ? (
        <PortfolioLoader />
      ) : (
        <div className="text-center p-12 bg-white rounded-xl shadow-lg">
          {/* Placeholder for actual content once isLoading is false */}
          <h2 className="text-2xl font-semibold text-green-600">
            Data Loaded Successfully!
          </h2>
        </div>
      )}
    </div>
  );
}
