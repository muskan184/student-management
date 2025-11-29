import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  followUserApi,
  getUserSuggestions,
  unfollowUserApi,
} from "../api/authApi";

export default function Suggestions() {
  const qc = useQueryClient();
  const { data: suggestions, isLoading } = useQuery(
    ["suggestions"],
    getUserSuggestions
  );
  const follow = useMutation((id) => followUserApi(id), {
    onSuccess: () => qc.invalidateQueries(["suggestions", "users"]),
  });
  const unfollow = useMutation((id) => unfollowUserApi(id), {
    onSuccess: () => qc.invalidateQueries(["suggestions", "users"]),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!suggestions || suggestions.length === 0)
    return <div className="p-6">No suggestions</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">People you may know</h2>
      <div className="grid gap-3">
        {suggestions.map((s) => (
          <div
            key={s._id}
            className="flex items-center justify-between bg-white p-3 rounded shadow"
          >
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-gray-500">{s.email}</div>
            </div>
            <div>
              <button
                onClick={() => follow.mutate(s._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
              >
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
