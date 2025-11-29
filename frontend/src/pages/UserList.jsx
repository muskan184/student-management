import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllUsers } from "../api/authApi";

export default function UsersList() {
  const { data: users, isLoading } = useQuery(["users"], getAllUsers);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <div className="grid gap-3">
        {users.map((u) => (
          <Link
            key={u._id}
            to={`/user/${u._id}`}
            className="block bg-white p-3 rounded shadow"
          >
            <div className="font-semibold">{u.name}</div>
            <div className="text-xs text-gray-500">{u.email}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
