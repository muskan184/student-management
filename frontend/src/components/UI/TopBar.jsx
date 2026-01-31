import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DarkLightToggleButton } from "./DarkLightToggleButton";
import { ColorPicker } from "./ColorPicker";

import {
  FaSignOutAlt,
  FaHome,
  FaBell
} from "react-icons/fa";
import {
  IoNotificationsOutline
} from "react-icons/io5";
import {
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronDown
} from "react-icons/fi";
import {
  MdDashboard
} from "react-icons/md";

import { useAuth } from "../../context/AuthContext";
import { fetchMyNotifications } from "../../api/notificationApi";

export const TopBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const role = user?.role;
  const isStudent = role === "student";
  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleNotifications = () => setNotificationOpen(!notificationOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
      if (notificationOpen) setNotificationOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, notificationOpen]);

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">


      {/* Center section - Empty for now */}
      <div className="flex-1"></div>

      {/* Right section - Controls */}
      <div className="flex items-center gap-9 mx-5">
        {/* Color Picker */}
        <div className="hover:scale-105 active:scale-95 transition-transform">
          <ColorPicker />
        </div>

        {/* Dark/Light Toggle */}
        <div className="hover:scale-105 active:scale-95 transition-transform">
          <DarkLightToggleButton />
        </div>

        {/* User Actions */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[var(--primary-color)]/30 dark:hover:border-[var(--primary-color)]/50 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <IoNotificationsOutline className="text-xl text-gray-600 dark:text-gray-400 hover:text-[var(--primary-color)] dark:hover:text-[var(--primary-color)] transition-colors" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[var(--primary-color)]/10 to-[var(--primary-dark)]/10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                      <span className="text-sm text-[var(--primary-color)] font-medium">
                        {unreadCount} unread
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {unreadCount === 0 ? (
                      <div className="p-8 text-center">
                        <FaBell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
                      </div>
                    ) : (
                      <div className="p-4">
                        <p className="text-gray-500 dark:text-gray-400 text-center">Notifications will appear here</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/50">
                    <button
                      onClick={() => navigate("/notifications")}
                      className="w-full text-center text-[var(--primary-color)] hover:text-[var(--primary-dark)] font-medium text-sm py-2 rounded-lg hover:bg-[var(--primary-color)]/10 transition-colors"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[var(--primary-color)]/30 dark:hover:border-[var(--primary-color)]/50 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src={user?.profilePic || "/default-avatar.png"}
                    alt={user?.firstName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md group-hover:border-[var(--primary-color)]/50 transition-colors"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>

                <div className="hidden md:block text-left">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                </div>

                <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* User Dropdown */}
              {isOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[var(--primary-color)]/10 to-[var(--primary-dark)]/10">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.profilePic || "/default-avatar.png"}
                        alt={user?.firstName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{user.role}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <DropdownItem
                      to="/"
                      icon={<FaHome className="w-4 h-4" />}
                      label="Home"
                      onClick={() => setIsOpen(false)}
                    />

                    {isStudent && (
                      <DropdownItem
                        to="/student/dashboard"
                        icon={<MdDashboard className="w-4 h-4" />}
                        label="Student Dashboard"
                        onClick={() => setIsOpen(false)}
                      />
                    )}
                    {isTeacher && (
                      <DropdownItem
                        to="/teacher/dashboard"
                        icon={<MdDashboard className="w-4 h-4" />}
                        label="Teacher Dashboard"
                        onClick={() => setIsOpen(false)}
                      />
                    )}
                    {isAdmin && (
                      <DropdownItem
                        to="/admin/dashboard"
                        icon={<MdDashboard className="w-4 h-4" />}
                        label="Admin Dashboard"
                        onClick={() => setIsOpen(false)}
                      />
                    )}

                    <DropdownItem
                      to={isStudent ? "/student/profile" : isTeacher ? "/teacher/profile" : "/admin/profile"}
                      icon={<FiUser className="w-4 h-4" />}
                      label="Edit Profile"
                      onClick={() => setIsOpen(false)}
                    />

                    <DropdownItem
                      to="/settings"
                      icon={<FiSettings className="w-4 h-4" />}
                      label="Settings"
                      onClick={() => setIsOpen(false)}
                    />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 dark:border-gray-700"></div>

                  {/* Logout */}
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-3 w-full p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Login/Signup buttons for non-authenticated users
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2.5 bg-[var(--primary-color)] text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-[var(--primary-dark)] transition-all"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DropdownItem = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 mb-1 ${
        isActive
          ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)] dark:text-[var(--primary-color)] border border-[var(--primary-color)]/20"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm"
      }`
    }
  >
    <div className={`p-2 rounded-lg ${
      isActive 
        ? "bg-[var(--primary-color)]/20 text-[var(--primary-color)]" 
        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    }`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </NavLink>
);