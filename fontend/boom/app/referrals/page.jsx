"use client";

import { useState, useEffect } from "react";
import { Gift, Share2, Users, DollarSign } from "lucide-react";
// ✅ Make sure this path matches where your UserContext file really lives
import { useUser } from "@/app/context/UserContext";

export default function RefilerPage() {
  const { user } = useUser(); // 🔑 access current logged-in user

  // Build the referral link dynamically
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    const base =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

    // Use username if available, otherwise id, otherwise fallback code
    const code = user?.username || user?.id || "GUEST123";
    setReferralLink(`${base}/register?ref=${encodeURIComponent(code)}`);
  }, [user]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert("Referral link copied!");
    } catch {
      alert("Failed to copy link");
    }
  };

  const shareOnWhatsApp = () =>
    window.open(
      `https://wa.me/?text=Join me on Energy-Vest and earn rewards! Sign up here: ${encodeURIComponent(
        referralLink
      )}`,
      "_blank"
    );

  const shareOnFacebook = () =>
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      "_blank"
    );

  const shareOnTwitter = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=Join%20me%20on%20Energy-Vest%20and%20earn%20rewards!&url=${encodeURIComponent(
        referralLink
      )}`,
      "_blank"
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Gift className="w-10 h-10 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">
            Invite & Earn Rewards
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Share your unique referral link with friends and family. For every{" "}
          <span className="font-semibold text-orange-600">5 people</span> you
          refer who successfully join and invest, you all earn{" "}
          <span className="font-semibold text-green-600">$50 bonus</span>{" "}
          directly into your wallet.
        </p>

        {/* Referral Link */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between mb-8">
          <span className="text-gray-700 text-sm break-all">
            {referralLink || "Generating your link..."}
          </span>
          <button
            onClick={copyLink}
            className="ml-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            disabled={!referralLink}
          >
            Copy
          </button>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-orange-50 p-4 rounded-lg shadow text-center">
            <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Invite Friends</h3>
            <p className="text-gray-600 text-sm">
              Share your referral link with your network.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow text-center">
            <Share2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">They Join</h3>
            <p className="text-gray-600 text-sm">
              Your friends register and start investing.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">You Earn</h3>
            <p className="text-gray-600 text-sm">
              Earn bonuses when your referrals are active.
            </p>
          </div>
        </div>

        {/* Share Options */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Share on Social Media 🌍
          </h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={shareOnWhatsApp}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              disabled={!referralLink}
            >
              WhatsApp
            </button>
            <button
              onClick={shareOnFacebook}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              disabled={!referralLink}
            >
              Facebook
            </button>
            <button
              onClick={shareOnTwitter}
              className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
              disabled={!referralLink}
            >
              Twitter
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Start Referring Today
          </h2>
          <p className="text-gray-600 mb-4">
            The more you share, the more you earn. There is no limit!
          </p>
          <button
            onClick={copyLink}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-700"
            disabled={!referralLink}
          >
            Share My Referral Link
          </button>
        </div>
      </div>
    </div>
  );
}
