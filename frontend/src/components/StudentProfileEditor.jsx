// src/components/StudentProfileEditor.jsx
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { deleteUser, fetchprofile, updateUser } from "../api/authApi";

export default function StudentProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", profilePic: "" });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    fetchprofile()
      .then((res) => {
        const u = res.user || res;
        setForm({
          name: u.name,
          email: u.email,
          profilePic: u.profilePic || u.avatar || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      await updateUser({ name: form.name, profilePic: form.profilePic });
      toast.success("Profile updated");
      setEdit(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const del = async () => {
    try {
      await deleteUser();
      toast.success("Account deleted");
      window.location.href = "/"; // logout flow depends on auth context removing token
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <div className="flex items-center gap-4">
        <img
          src={form.profilePic || "/default-avatar.png"}
          className="w-24 h-24 rounded-full object-cover"
          alt="avatar"
        />
        <div>
          <h3 className="text-xl font-bold">{form.name}</h3>
          <p className="text-sm text-gray-600">{form.email}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <input
          disabled={!edit}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 border rounded"
        />
        <input
          disabled={!edit}
          value={form.profilePic}
          onChange={(e) => setForm({ ...form, profilePic: e.target.value })}
          placeholder="Profile image URL"
          className="w-full p-3 border rounded"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setEdit(!edit)}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          {edit ? "Cancel" : "Edit"}
        </button>
        {edit && (
          <button
            onClick={save}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        )}
        <button
          onClick={del}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
