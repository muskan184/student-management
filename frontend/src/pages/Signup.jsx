// src/pages/Signup.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { ROLE_LIST } from "../utils/roles";

export default function Signup() {
  const navigate = useNavigate();
  const { registerMutation } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLE_LIST[0],
    profilePic: "", // base64
  });

  const [error, setError] = useState("");

  // Convert Image → Base64
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profilePic: reader.result }); // Base64 image
    };
    reader.readAsDataURL(file);
  };

  const handleChanges = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    registerMutation.mutate(form, {
      onSuccess: () => {
        if (form.role === "student") navigate("/student/dashboard");
        if (form.role === "teacher") navigate("/teacher/dashboard");
        if (form.role === "admin") navigate("/admin/dashboard");
      },
      onError: (err) => {
        setError(err.response?.data?.message || "Registration failed");
      },
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded text-center mb-3">
            {error}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Profile Image + Preview */}
          <div className="flex flex-col items-center">
            <img
              src={
                form.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border mb-2"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="text-sm"
            />
          </div>

          <input
            name="name"
            placeholder="Enter Full Name"
            value={form.name}
            onChange={handleChanges}
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChanges}
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="password"
            type="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChanges}
            className="w-full p-3 border rounded-lg"
          />

          {/* Role selection */}
          <div>
            <p className="text-sm font-medium mb-1">Select Role:</p>
            <div className="flex gap-2 flex-wrap">
              {ROLE_LIST.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={`px-4 py-2 text-sm rounded-full border ${
                    form.role === role
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
          >
            {registerMutation.isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
