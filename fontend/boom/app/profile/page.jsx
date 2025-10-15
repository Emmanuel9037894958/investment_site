"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/referrals/context/UserContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch user profile
    fetch(`/api/users/${user._id}`)
      .then((res) => res.json())
      .then((data) => setProfile(data.user))
      .catch(console.error);

    // Fetch user payments
    fetch(`/api/payments`)
      .then((res) => res.json())
      .then((data) => {
        const userPayments = data.payments.filter(p => p.userId?._id === user._id);
        setPayments(userPayments);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();
    setProfile(data.user);
    alert("Profile image updated!");
  };

  if (loading || !profile) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <p><strong>Name:</strong> {profile.name || "N/A"}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>

        {/* Profile Image */}
        {profile.avatar ? (
          <img src={profile.avatar} alt="Profile Image" className="mt-4 w-32 h-32 rounded-full" />
        ) : (
          <p className="mt-4 italic text-gray-500">No profile image uploaded.</p>
        )}

        {/* Upload new avatar */}
        <form onSubmit={handleUpload} className="mt-4 flex gap-2 items-center">
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Upload</button>
        </form>

        {/* Payments History */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Your Payments</h2>
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Amount</th>
              <th className="border p-2">Method</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td className="border p-2">${p.amount}</td>
                <td className="border p-2">{p.method}</td>
                <td className="border p-2">{p.status}</td>
                <td className="border p-2">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan="4" className="border p-2 text-center">No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
