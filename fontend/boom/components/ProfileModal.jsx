"use client";
import React, { useState } from "react";

export const ProfileModal = ({ currentName, currentAvatar, onClose, onSave }) => {
  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState(currentAvatar);

  // ✅ Convert file to Base64 string
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ name, avatar });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Avatar</label>
            <div className="mt-3 flex justify-center">
              <img
                src={avatar || "/default-avatar.png"}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border mb-7"
              />
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 pt-3">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
