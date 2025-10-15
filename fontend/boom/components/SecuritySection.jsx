"use client";
import React from "react";
import { Shield, Lock, Users, Award } from "lucide-react";
import Link from "next/link";


export default function SecuritySection() {
  const securityItems = [
    {
      id: 1,
      icon: (
        <Shield className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
      ),
      title: "Regulated Activities",
      description: "FSO license No. 1426969",
    },
    {
      id: 2,
      icon: (
        <Lock className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
      ),
      title: "Negative Balance Protection",
      description: "Your funds are fully secure",
    },
    {
      id: 3,
      icon: (
        <Users className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
      ),
      title: "Financial Commission Participant",
      description: "Trusted by global standards",
    },
    {
      id: 4,
      icon: (
        <Award className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
      ),
      title: "Execution Quality Certificate",
      description: "Verified by Verify My Trade",
    },
  ];

  return (
    <section className="bg-orange-500 py-16 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Security of Client's Funds
        </h2>
        <p className="text-white text-sm sm:text-base md:text-lg mb-12">
          Your funds are fully secured when you invest with{" "}
          <span className="font-semibold">wealth-catalyst.xyz</span>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-white">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/login">
            <button className="bg-white text-orange-500 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg shadow-orange-700/50 hover:shadow-2xl transition-all">
              Login
            </button>
          </Link>

          <Link href="/signup">
            <button className="bg-white text-orange-500 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg shadow-orange-700/50 hover:shadow-2xl transition-all">
              Create Account
            </button>
          </Link>
        </div>
      </div>
      <div>
       
      </div>
    </section>
  );
}
