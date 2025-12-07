import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { ROLE_LIST } from "../utils/roles";

export const Signup = () => {
  const navigate = useNavigate();
  const { registerMutation } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLE_LIST[0],
  });
  const [error, setError] = useState("");

  const handleChanges = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
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
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-4"></h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Enter Name"
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
          <div>
            <p className="text-sm text-gray-700 font-medium mb-2">
              Select Role:
            </p>
            <div className="flex gap-2 flex-wrap">
              {ROLE_LIST.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setForm({ ...form, role })}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    form.role === role
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {registerMutation.isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
