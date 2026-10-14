
"use client";

export const Card = ({ children, className = "" }) => (
  <div
    className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-900/5 sm:rounded-3xl sm:p-6 ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`mb-5 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3
    className={`text-lg font-bold tracking-tight text-slate-900 sm:text-xl ${className}`}
  >
    {children}
  </h3>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`min-w-0 text-sm leading-6 text-slate-600 ${className}`}>
    {children}
  </div>
);
