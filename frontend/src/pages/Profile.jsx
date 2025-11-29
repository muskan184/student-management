import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout, updateMutation, deleteMutation } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div className="p-6">No user</div>;

  const handleDelete = () => {
    if (confirm("Are you sure to delete account?")) {
      deleteMutation.mutate(null, { onSuccess: () => navigate("/signup") });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow flex gap-6">
        <img
          src={user.profilePic || "/default-avatar.png"}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>

          <div className="mt-4 flex gap-3">
            <button
              className="bg-gray-100 px-3 py-1 rounded"
              onClick={() => navigate("/update")}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={handleDelete}
            >
              Delete Account
            </button>
            <button
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
