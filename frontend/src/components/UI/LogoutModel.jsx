import { use } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LogoutModal = ({ onClose }) => {
  const { logoutMutation } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center dark:bg-white/15 bg-black/15 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Are you sure?</h2>
        <p className="text-gray-600 mt-2">Do you really want to logout?</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Yes, Logout
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
