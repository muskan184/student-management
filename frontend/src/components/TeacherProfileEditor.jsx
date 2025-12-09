// src/components/TeacherProfileEditor.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteUser, fetchprofile, updateUser } from "../api/authApi";

export default function TeacherProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    profilePic: "",
    subject: "",
    phone: "",
    dob: "",
    address: "",
    qualification: "",
    experience: "",
  });

  // Fetch user profile
  useEffect(() => {
    fetchprofile()
      .then((res) => {
        const u = res.user || res;

        setForm({
          name: u.name,
          email: u.email,
          role: u.role,
          profilePic: u.profilePic || "/default-avatar.png",
          subject: u.subject || "",
          phone: u.phone || "",
          dob: u.dob || "",
          address: u.address || "",
          qualification: u.qualification || "",
          experience: u.experience || "",
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, profilePic: url }));

    // TODO: if you want to upload to backend/cloudinary → use file here
  };

  const save = async () => {
    try {
      await updateUser(form);
      toast.success("Profile updated successfully!");
      setEdit(false);
    } catch {
      toast.error("Update failed");
    }
  };

  const del = async () => {
    try {
      await deleteUser();
      toast.success("Account deleted successfully");
      window.location.href = "/";
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Teacher Profile</h2>

      {/* Image + Upload */}
      <div className="flex items-center gap-6">
        <img
          src={form.profilePic}
          className="w-32 h-32 rounded-full object-cover border shadow"
        />

        {edit && (
          <input
            type="file"
            accept="image/*"
            className="block w-full text-gray-700"
            onChange={handleImageChange}
          />
        )}
      </div>

      <div className="mt-6 space-y-5">
        {/* Name */}
        <Field
          label="Full Name"
          value={form.name}
          edit={edit}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        {/* Email */}
        <StaticField label="Email" value={form.email} />

        {/* Role */}
        <StaticField label="Role" value={form.role.toUpperCase()} />

        {/* Subject */}
        <Field
          label="Subject"
          placeholder="Mathematics, English..."
          value={form.subject}
          edit={edit}
          onChange={(v) => setForm({ ...form, subject: v })}
        />

        {/* Phone */}

        {/* Qualification */}
        <Field
          label="Qualification"
          placeholder="B.Ed, M.Sc..."
          value={form.qualification}
          edit={edit}
          onChange={(v) => setForm({ ...form, qualification: v })}
        />

        {/* Experience */}
        <Field
          label="Experience (Years)"
          type="number"
          placeholder="3"
          value={form.experience}
          edit={edit}
          onChange={(v) => setForm({ ...form, experience: v })}
        />

        {/* Address */}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={save}
            className="px-5 py-2 bg-green-600 text-white rounded-lg"
          >
            Save Changes
          </button>
        )}

        <button
          onClick={del}
          className="px-5 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

/* Reusable Components */

function Field({ label, value, edit, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      {edit ? (
        type === "textarea" ? (
          <textarea
            className="border p-2 rounded-lg w-full mt-1"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            type={type}
            className="border p-2 rounded-lg w-full mt-1"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      ) : (
        <p className="font-medium">{value || "Not provided"}</p>
      )}
    </div>
  );
}

function StaticField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
