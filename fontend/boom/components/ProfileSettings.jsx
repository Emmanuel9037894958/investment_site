"use client";
import React, { useState, useEffect } from "react";

export const ProfileSettings = ({ onProfileUpdate }) => {
  const [userName, setUserName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/default-avatar.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Load saved data from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedName) setUserName(savedName);
    if (savedAvatar) setAvatarPreview(savedAvatar);
  }, []);

  const handleSave = async () => {
    if (!userName) {
      setMessage("❌ Please enter your name.");
      return;
    }

    let avatarUrl = avatarPreview;

    // ✅ If new image selected, create a temporary URL
    if (selectedFile) {
      avatarUrl = URL.createObjectURL(selectedFile);
      localStorage.setItem("userAvatar", avatarUrl);
      setAvatarPreview(avatarUrl);
    }

    // ✅ Save name and avatar permanently in browser
    localStorage.setItem("userName", userName);

    // ✅ Notify parent (like the header) to update
    if (onProfileUpdate) {
      onProfileUpdate({ name: userName, avatar: avatarUrl });
    }

    setMessage("✅ Profile saved successfully!");
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

      {/* Avatar Preview */}
      <img
        src={avatarPreview}
        alt="Avatar"
        className="w-24 h-24 rounded-full border object-cover"
      />

      {/* Upload File */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="mt-2"
      />

      {/* Name Input */}
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="border p-2 rounded mt-3 w-full"
        placeholder="Enter your name"
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white rounded-lg py-2 mt-2 hover:bg-blue-700 w-full"
      >
        Save Changes
      </button>

      {/* Message */}
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
};
