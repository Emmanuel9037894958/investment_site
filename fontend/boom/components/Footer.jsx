"use client";
import { Mail, Phone, MapPin, Shield, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Signup Section */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
          <p className="text-gray-400 mb-4">
            Subscribe to our newsletter to receive the latest investment news and opportunities.
          </p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-2/3 px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Energyvest</h2>
          <p className="text-sm text-gray-400">
            Smart investments made simple. Trusted by thousands of investors worldwide.
          </p>
          <div className="flex space-x-3 mt-4">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"><Facebook className="w-5 h-5"/></a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"><Twitter className="w-5 h-5"/></a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"><Linkedin className="w-5 h-5"/></a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"><Instagram className="w-5 h-5"/></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-blue-400">Home</a></li>
            <li><a href="/dashboard" className="hover:text-blue-400">Dashboard</a></li>
            <li><a href="/investments" className="hover:text-blue-400">Investments</a></li>
            <li><a href="/trading" className="hover:text-blue-400">Trading</a></li>
            <li><a href="/referrals" className="hover:text-blue-400">Referrals</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
            <li><a href="/privacy" className="hover:text-blue-400">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-blue-400">Terms & Conditions</a></li>
            <li><a href="/support" className="hover:text-blue-400">Support</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <p className="flex items-center space-x-2"><Mail className="w-4 h-4"/> <span>support@energyvest.com</span></p>
          <p className="flex items-center space-x-2 mt-2"><Phone className="w-4 h-4"/> <span>+1 234 567 890</span></p>
          <p className="flex items-center space-x-2 mt-2"><MapPin className="w-4 h-4"/> <span>New York, USA</span></p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        <div className="flex justify-center items-center space-x-2">
          <Shield className="w-4 h-4 text-green-400"/> <span>SSL Secured & Regulated</span>
        </div>
        <p className="mt-2">© {new Date().getFullYear()} Energyvest. All Rights Reserved.</p>
        <p className="text-xs text-gray-500 mt-1">Investing involves risks. Please invest wisely.</p>
      </div>
    </footer>
  );
}
