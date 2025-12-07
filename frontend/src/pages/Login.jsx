import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const { loginMutation } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(form, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 border mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="w-full p-3 border mb-4"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {loginMutation.isLoading ? "Logging..." : "Login"}
        </button>
        {loginMutation.isError && (
          <p className="text-red-500 mt-2">
            {loginMutation.error?.response?.data?.message || "Login failed"}
          </p>
        )}
        <p className="mt-3">
          No account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};
