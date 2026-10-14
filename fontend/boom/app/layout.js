import Navbar from "@/components/Navbar";
import { BarChart } from "lucide-react";
import AlertNotification from "@/components/AlertNotification";
import "./globals.css";

import { UserProvider } from "@/app/context/UserContext";
import { ClientProvider } from "@/app/context/ClientContext";

export const metadata = {
  title: "Energy-Vest Platform",
  description: "Secure investment dashboard",
  icons: {
    icon: "/barchart.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 relative min-h-screen w-full overflow-x-hidden">
        <UserProvider>
          <ClientProvider>
            <AlertNotification />

            {/* Full-width Header */}
            <header className="w-full flex items-center justify-between bg-white shadow-md px-4 sm:px-8">
              <div className="flex items-center">
                <BarChart className="w-8 h-8 text-orange-500 mr-2" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Energy-Vest
                </h1>
              </div>
            </header>

            {/* Navbar */}
            <div className="w-full">
              <Navbar />
            </div>

            {/* Full-width Main Content Area */}
            <main className="w-full pt-6 px-4 sm:px-8 lg:px-12">
              {children}
            </main>
          </ClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}