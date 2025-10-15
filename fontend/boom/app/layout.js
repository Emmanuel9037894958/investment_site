import Navbar from "@/components/Navbar";
import { BarChart } from "lucide-react";
import AlertNotification from "@/components/AlertNotification";
import "./globals.css";

// ✅ Import both contexts
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
      <head>
        {/* ✅ Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 relative">
        {/* ✅ Wrap with BOTH providers */}
        <UserProvider>
          <ClientProvider>
            <AlertNotification />

            <header className="w-full flex items-center justify-center sm:justify-start bg-white shadow-md px-6 py-4">
              <BarChart className="w-8 h-8 text-orange-500 mr-2" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Energy-Vest
              </h1>
            </header>

            <Navbar />

            <main className="pt-6 px-4 sm:px-6 lg:px-8">{children}</main>
          </ClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
