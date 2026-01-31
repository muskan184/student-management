import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DarkLightToggleButton } from "./DarkLightToggleButton";
import { ColorPicker } from "./ColorPicker";
import { motion } from "framer-motion";

import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

import { useAuth } from "../../context/AuthContext";
import { fetchMyNotifications } from "../../api/notificationApi";

export const TopBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  // 🔔 unread count only
  const [unreadCount, setUnreadCount] = useState(0);

  const role = user?.role;
  const isStudent = role === "student";
  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔔 Load unread count
  const loadNotifications = async () => {
    if (!user) return;
    try {
      const data = await fetchMyNotifications();
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.log("Notification error", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  return (
    <motion.div
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90 }}
      className="flex items-center sticky top-0 z-50 justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b shadow-sm"
    >
      <div className="flex-1"></div>

      <div className="ml-4 flex gap-4 items-center relative">
        {/* 🔔 NOTIFICATION BELL */}
        {user && (
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/notifications")}
          >
            <IoNotificationsOutline className="text-2xl text-gray-600 hover:text-[var(--primary-color)]" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        )}

        <ColorPicker />
        <DarkLightToggleButton />

        {/* USER AREA */}
        {user ? (
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => {
                if (isStudent) navigate("/student/profile");
                else if (isTeacher) navigate("/teacher/profile");
                else if (isAdmin) navigate("/admin/profile");
              }}
              className="flex items-center gap-2 rounded-full px-2 py-1 border border-[var(--primary-color)] bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={user.profilePic || "/default-avatar.png"}
                alt="user"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:block font-medium text-gray-700">
                {user.firstName}
              </span>
            </button>

            <button
              onClick={toggleDropdown}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <BsThreeDotsVertical className="text-xl text-gray-600" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-12 w-56 bg-white shadow-xl rounded-md p-2 border z-50 top-0">
                {isStudent && (
                  <DropdownItem to="/student/dashboard" icon={<FaUser />}>
                    Student Dashboard
                  </DropdownItem>
                )}
                {isTeacher && (
                  <DropdownItem to="/teacher/dashboard" icon={<FaUser />}>
                    Teacher Dashboard
                  </DropdownItem>
                )}
                {isAdmin && (
                  <DropdownItem to="/admin/dashboard" icon={<FaUser />}>
                    Admin Dashboard
                  </DropdownItem>
                )}

                <DropdownItem to="/student/profile" icon={<FiSettings />}>
                  Edit Profile
                </DropdownItem>

                <div className="border-t mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 p-2 text-red-500 hover:bg-red-50 rounded-md transition"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <NavLink to="/login">
              <button className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-full shadow">
                Login
              </button>
            </NavLink>

            <NavLink to="/signup">
              <button className="px-4 py-2 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-full">
                Signup
              </button>
            </NavLink>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const DropdownItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-gray-700 transition"
  >
    {icon} {children}
  </NavLink>
);
