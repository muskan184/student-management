import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { registerMutation } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(form, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <input
          name="name"
          placeholder="Name"
          className="w-full p-3 border mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <button className="w-full bg-green-600 text-white py-2 rounded">
          {registerMutation.isLoading ? "Signing..." : "Signup"}
        </button>
        {registerMutation.isError && (
          <p className="text-red-500 mt-2">
            {registerMutation.error?.response?.data?.message || "Signup failed"}
          </p>
        )}
        <p className="mt-3">
          Have account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
