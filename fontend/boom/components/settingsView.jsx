"use client"
import { useState, useEffect } from "react";
import { useClient } from "@/app/context/ClientContext";
import { apiPost } from "../utils/api";

export default function SettingsView() {
  const { client, setClient } = useClient();
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(()=>{ setForm({ name: client?.name||"", email: client?.email||"", address: client?.address||"" }); },[client]);

  const onFileChange = (e) => {
    const file = e.target.files[0]; if(!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setClient(prev => ({...prev, avatar: url}));
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setMsg("");
    try {
      if(avatarFile){
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        fd.append("userId", client.userId);
        const up = await apiPost("upload_avatar.php", fd, true);
        if(up.success) setClient(prev=>({...prev, avatar: up.avatar}));
        else throw new Error(up.error||"Avatar upload failed");
      }
      const res = await apiPost("update_profile.php", { userId: client.userId, name: form.name, address: form.address });
      if(res.success) { setClient(res.client); setMsg("Profile updated"); }
      else throw new Error(res.error||"Profile update failed");
    } catch(err){ setMsg(err.message||"Error"); }
    finally{ setSaving(false); setAvatarFile(null); }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-xl">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-xs text-gray-500">Profile Photo</label>
          <div className="flex items-center gap-3 mt-2">
            <img src={client.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(client.name||"User")}&background=312e81&color=fff`} className="w-20 h-20 rounded-full border"/>
            <label className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded cursor-pointer">
              Choose photo <input type="file" accept="image/*" className="hidden" onChange={onFileChange}/>
            </label>
          </div>
        </div>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-2 border rounded" placeholder="Name"/>
        <input value={form.email} disabled className="w-full p-2 border rounded bg-gray-100" />
        <input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="w-full p-2 border rounded" placeholder="Address"/>
        <button type="submit" className="w-full p-3 rounded bg-indigo-700 text-white" disabled={saving}>{saving? "Saving..." : "Save changes"}</button>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </form>
    </div>
  );
}
