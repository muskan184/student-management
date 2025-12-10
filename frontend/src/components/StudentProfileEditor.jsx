// src/components/StudentProfileEditor.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteUser, fetchprofile, updateUser } from "../api/authApi";

export default function StudentProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    profilePic: "",
    phone: "",
    dob: "",
    address: "",
    course: "",
    branch: "",
    semester: "",
  });
  console.log(form);

  // Fetch profile
  useEffect(() => {
    fetchprofile()
      .then((res) => {
        const u = res.user || res;

        setForm({
          name: u.name,
          email: u.email,
          role: u.role,
          profilePic: u.profilePic || "/default-avatar.png",
          phone: u.phone || "",
          dob: u.dob || "",
          address: u.address || "",
          course: u.course || "",
          branch: u.branch || "",
          semester: u.semester || "",
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, profilePic: url }));
  };

  // Save profile
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
      toast.success("Account deleted");
      window.location.href = "/";
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Student Profile</h2>

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
            className="block text-gray-700"
            onChange={handleImageChange}
          />
        )}
      </div>

      <div className="mt-6 space-y-5">
        <Field
          label="Full Name"
          value={form.name}
          edit={edit}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        <StaticField label="Email" value={form.email} />

        <StaticField label="Role" value={form.role.toUpperCase()} />

        <Field
          label="Course"
          placeholder="BCA, BSc, etc."
          value={form.course}
          edit={edit}
          onChange={(v) => setForm({ ...form, course: v })}
        />

        <Field
          label="Branch"
          placeholder="Computer Science"
          value={form.branch}
          edit={edit}
          onChange={(v) => setForm({ ...form, branch: v })}
        />

        <Field
          label="Semester / Year"
          placeholder="4th Sem / 2nd Year"
          value={form.semester}
          edit={edit}
          onChange={(v) => setForm({ ...form, semester: v })}
        />
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

/* Reusable Field Components */
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
