"use client";

export const Card = ({ children, className='' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 ${className}`}>{children}</div>
);

export const CardHeader = ({ children }) => <div className="mb-3">{children}</div>;
export const CardTitle = ({ children, className='' }) => (
  <h3 className={`text-lg font-bold text-gray-800 ${className}`}>{children}</h3>
);
export const CardContent = ({ children, className='' }) => <div className={className}>{children}</div>;
