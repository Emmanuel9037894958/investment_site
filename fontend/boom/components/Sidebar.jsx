"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Home,
  TrendingUp,
  DollarSign,
  FileText,
  Users,
  Settings,
  LogOut,
  WalletCards,
} from "lucide-react";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Home,
  },

  {
    name: "Portfolio Manager",
    href: "/dashboard/portfolio",
    icon: TrendingUp,
  },

  {
    name: "Trade Execution",
    href: "/dashboard/trade",
    icon: DollarSign,
  },

  {
    name: "Withdraw Funds",
    href: "/withdraw",
    icon: WalletCards,
  },

  {
    name: "Financial Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },

  {
    name: "Client Records (CRM)",
    href: "/dashboard/clients",
    icon: Users,
    admin: true,
  },

  {
    name: "Account Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const Sidebar = ({ onClose }) => {
  const router = useRouter();
  const pathname = usePathname();

  /*
    This is temporary until we connect the
    admin role directly to the authenticated user.
  */
  const isAdmin = true;

  const handleNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("firebaseToken");
    localStorage.removeItem("googleUser");

    router.push("/login");
  };

  return (
    <div className="flex min-h-screen w-72 flex-col bg-gray-900 text-white shadow-2xl">
      {/* ==========================================
          LOGO
      ========================================== */}

      <div className="flex h-20 items-center justify-center border-b border-gray-700 p-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-cyan-400">
          InvestPro
        </h1>
      </div>

      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          if (item.admin && !isAdmin) {
            return null;
          }

          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleNavigation}
              className={`flex items-center space-x-3 rounded-lg p-4 transition-colors duration-200 ${
                isActive
                  ? "bg-teal-700 font-bold text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ==========================================
          SIGN OUT
      ========================================== */}

      <div className="border-t border-gray-700 p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center space-x-3 rounded-lg p-3 font-medium text-red-400 transition-colors duration-200 hover:bg-gray-700"
        >
          <LogOut className="h-5 w-5" />

          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};