// src/components/TeacherProfileEditor.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteUser, fetchprofile, updateUser } from "../api/authApi";

export default function TeacherProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    profilePic: "",
    subject: "",
  });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    fetchprofile()
      .then((res) => {
        const u = res.user || res;
        setForm({
          name: u.name,
          email: u.email,
          subject: u.subject || "",
          profilePic: u.profilePic || "/default-avatar.png",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      await updateUser({
        name: form.name,
        subject: form.subject,
        profilePic: form.profilePic,
      });
      toast.success("Teacher profile updated");
      setEdit(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const del = async () => {
    try {
      await deleteUser();
      toast.success("Account deleted");
      window.location.href = "/";
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-3">Teacher Profile</h2>

      <div className="flex items-center gap-6">
        <img
          src={form.profilePic}
          className="w-28 h-28 rounded-full object-cover border"
        />

        {edit && (
          <input
            className="border p-2 rounded w-full"
            placeholder="Profile picture URL"
            value={form.profilePic}
            onChange={(e) => setForm({ ...form, profilePic: e.target.value })}
          />
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600">Full Name</p>
          {edit ? (
            <input
              className="border p-2 rounded w-full"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          ) : (
            <p className="font-medium">{form.name}</p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium">{form.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Subject</p>
          {edit ? (
            <input
              className="border p-2 rounded w-full"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Mathematics"
            />
          ) : (
            <p className="font-medium">{form.subject || "Not assigned"}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={save}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Save Changes
          </button>
        )}

        <button
          onClick={del}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
