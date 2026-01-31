// src/pages/Signup.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { ROLE_LIST } from "../utils/roles";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaCamera,
  FaArrowRight,
} from "react-icons/fa";

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

  // Role icons mapping
  const roleIcons = {
    student: <FaUserGraduate className="mr-2" />,
    teacher: <FaChalkboardTeacher className="mr-2" />,
    admin: <FaUserShield className="mr-2" />,
  };

  // Convert Image → Base64
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profilePic: reader.result });
      setError("");
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header section */}
          <div className="p-8 pb-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Account
              </h2>
              <p className="text-gray-600 mt-2">Join our community today</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center animate-fadeIn">
                <span className="text-red-600 text-sm font-medium">
                  {error}
                </span>
              </div>
            )}

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-blue-300 transition-all duration-300">
                  <img
                    src={
                      form.profilePic ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    }
                    alt="Profile Preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-300 shadow-lg group-hover:scale-110">
                  <FaCamera className="text-lg" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
                <div className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Click camera icon to upload photo
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>
                <input
                  name="name"
                  placeholder="Enter Full Name"
                  value={form.name}
                  onChange={handleChanges}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 placeholder-gray-400"
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter Email Address"
                  value={form.email}
                  onChange={handleChanges}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 placeholder-gray-400"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Create Password"
                  value={form.password}
                  onChange={handleChanges}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300 placeholder-gray-400"
                />
              </div>

              {/* Role Selection */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Select Your Role:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {ROLE_LIST.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setForm({ ...form, role })}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300
                        ${
                          form.role === role
                            ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md scale-[1.02]"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600"
                        }
                      `}
                    >
                      <div className="text-2xl mb-2">{roleIcons[role]}</div>
                      <span className="text-sm font-semibold capitalize">
                        {role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={registerMutation.isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {registerMutation.isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50/50 border-t border-gray-100/50">
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 inline-flex items-center gap-1"
              >
                Sign In
                <FaArrowRight className="text-sm" />
              </Link>
            </p>
          </div>
        </div>

        {/* Terms & Privacy */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
