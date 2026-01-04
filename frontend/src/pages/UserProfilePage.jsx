import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../api/authApi";
import { ArrowLeft } from "lucide-react";

export const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await getUserById(id);
      setUser(data);
    };
    load();
  }, [id]);

  if (!user) {
    return (
      <div className="text-center text-gray-500 py-10">
        Profile not found
      </div>
    );
  }

  const isTeacher = user.role === "teacher";
  const isStudent = user.role === "student";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 text-md bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col sm:flex-row gap-6">
        <img
          src={user.profilePic || "/default-avatar.png"}
          alt={user.name}
          className="w-28 h-28 rounded-full object-cover border"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{user.name}</h1>

          <p className="text-sm text-gray-500 capitalize mt-1">
            {user.role}
            {isTeacher && user.subject ? ` • ${user.subject}` : ""}
          </p>

          <div className="flex flex-col mt-4 text-sm text-gray-600">
            {isTeacher && (
              <span>
                <strong>{user.experience || 0}</strong> yrs experience
              </span>
            )}
            <div className="flex gap-4">
              <span>
                <strong>{user.followers?.length || 0}</strong> followers
              </span>
              <span>
                <strong>{user.following?.length || 0}</strong> following
              </span>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
              Follow
            </button>
            <button className="px-5 py-2 rounded-md border text-sm hover:bg-gray-100">
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-8 bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Profile Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Common */}
          <Detail label="Email" value={user.email} />
          <Detail label="Phone" value={user.phone} />
          <Detail label="Address" value={user.address} />
          <Detail
            label="Date of Birth"
            value={user.dob ? new Date(user.dob).toDateString() : ""}
          />

          {/* Teacher only */}
          {isTeacher && (
            <>
              <Detail label="Subject" value={user.subject} />
              <Detail label="Qualification" value={user.qualification} />
            </>
          )}

          {/* Student only */}
          {isStudent && (
            <>
              <Detail label="Course" value={user.course} />
              <Detail label="Branch" value={user.branch} />
              <Detail label="Semester" value={user.semester} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-400">{label}</p>
    <p className="text-gray-800">{value || "—"}</p>
  </div>
);
