"use client";
import React, { useState, useEffect } from "react";
import { ProfileModal } from "@/components/ProfileModal";

export const Header = () => {
  const [userName, setUserName] = useState("Maria Pio");
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Load saved profile safely
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedAvatar = localStorage.getItem("userAvatar");

    // Prevent invalid blob or missing image
    if (savedName) setUserName(savedName);
    if (savedAvatar && !savedAvatar.startsWith("blob:")) {
      setAvatar(savedAvatar);
    }
  }, []);

  // ✅ Update both state + localStorage after save
  const handleProfileUpdate = ({ name, avatar }) => {
    setUserName(name);

    // If it's a blob, don’t store it permanently
    if (avatar && !avatar.startsWith("blob:")) {
      setAvatar(avatar);
      localStorage.setItem("userAvatar", avatar);
    } else {
      // fallback to default image
      setAvatar("/default-avatar.png");
      localStorage.removeItem("userAvatar");
    }

    localStorage.setItem("userName", name);
    setIsModalOpen(false);
  };

  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        title="Edit Profile"
      >
        <span className="font-medium">{userName}</span>
        <img
          src={avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border"
          onError={(e) => (e.target.src = "/default-avatar.png")} // ✅ fallback
        />
      </div>

      {/* ✅ Modal */}
      {isModalOpen && (
        <ProfileModal
          currentName={userName}
          currentAvatar={avatar}
          onClose={() => setIsModalOpen(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </header>
  );
};
