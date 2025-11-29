import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followUserApi, getUserById, unfollowUserApi } from "../api/authApi";

export default function UserDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: user, isLoading } = useQuery(["user", id], () =>
    getUserById(id)
  );
  const follow = useMutation((id) => followUserApi(id), {
    onSuccess: () => qc.invalidateQueries(["user", id]),
  });
  const unfollow = useMutation((id) => unfollowUserApi(id), {
    onSuccess: () => qc.invalidateQueries(["user", id]),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => follow.mutate(user._id)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Follow
        </button>
        <button
          onClick={() => unfollow.mutate(user._id)}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Unfollow
        </button>
      </div>
    </div>
  );
}
