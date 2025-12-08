import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FiEdit2, FiTrash2, FiCamera } from "react-icons/fi";

const Profile = () => {
  const { user } = useAuth();

  const [profilePic, setProfilePic] = useState(user?.profilePic || null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setProfilePic(imgURL);
    }
  };

  const handleDelete = () => {
    setProfilePic(null);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md relative">
        {/* Profile Picture Block */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={
                profilePic ||
                "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
              }
              alt="profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover"
            />

            {/* Hover Overlay */}
            <div
              className="absolute inset-0 bg-black/40 rounded-full
             flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <label className="cursor-pointer flex flex-col items-center text-white">
                <FiCamera size={24} />
                <p className="text-xs">Change</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-3">
            <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-700">
              <FiEdit2 />
              Edit Info
            </button>

            {profilePic && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg shadow hover:bg-red-700"
              >
                <FiTrash2 />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 space-y-2 text-lg">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
