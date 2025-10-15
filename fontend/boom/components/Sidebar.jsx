"use client";
import { Home, TrendingUp, DollarSign, FileText, Users, Settings, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Portfolio Manager', href: '/dashboard/portfolio', icon: TrendingUp },
  { name: 'Trade Execution', href: '/dashboard/trade', icon: DollarSign },
  { name: 'Financial Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Client Records (CRM)', href: '/dashboard/clients', icon: Users, admin: true },
  { name: 'Account Settings', href: '/dashboard/settings', icon: Settings },
];

export const Sidebar = () => {
  const isAdmin=true;
  const currentPath='/dashboard';

  return (
    <div className="flex flex-col w-72 bg-gray-900 text-white shadow-2xl min-h-screen">
      <div className="flex items-center justify-center h-20 border-b border-gray-700 p-4">
        <h1 className="text-4xl font-extrabold text-cyan-400 tracking-tight">InvestPro</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map(item=>{
          if(item.admin && !isAdmin) return null;
          const Icon=item.icon;
          const isActive=item.href===currentPath;
          return (
            <a key={item.name} href={item.href} className={`flex items-center space-x-3 p-4 rounded-lg transition-colors duration-200 ${isActive?'bg-teal-700 text-white font-bold shadow-md':'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </a>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={()=>alert('Signing out')} className="flex items-center w-full space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors duration-200 font-medium">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
