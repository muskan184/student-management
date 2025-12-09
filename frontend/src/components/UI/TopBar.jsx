import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DarkLightToggleButton } from "./DarkLightToggleButton";
import { ColorPiker } from "./ColorPicker";
import { motion, AnimatePresence } from "framer-motion";

import { FaUser } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";

import { useAuth } from "../../context/AuthContext";

export const TopBar = ({ setShowLogoutModal }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [isOpen, setIsOpen] = useState(false);

  const role = user?.role;
  const isStudent = role === "student";
  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const dropVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <motion.div
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90 }}
      className="flex items-center sticky top-0 z-50 justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b shadow-sm"
    >
      {/* Left Area (Empty for now) */}
      <div className="flex-1"></div>

      {/* Right Area */}
      <div className="ml-4 flex gap-4 items-center relative">
        {/* Notifications only when logged in */}
        {user && (
          <IoNotificationsOutline className="text-2xl cursor-pointer text-gray-600 hover:text-[var(--primary-color)] transition" />
        )}

        {/* Color Picker */}
        <ColorPiker />

        {/* Theme Toggle */}
        <DarkLightToggleButton
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />

        {/* ---- USER LOGGED IN ---- */}
        {user ? (
          <div className="relative flex items-center gap-3">
            {/* Profile Image → Direct Profile Page */}
            <button
              onClick={() => navigate("/teacher/profiles")}
              className="flex items-center gap-2 rounded-full px-2 py-1 border border-[var(--primary-color)] bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={user.profileImg}
                alt="user"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:block font-medium text-gray-700">
                {user.firstName}
              </span>
            </button>

            {/* 3 Dots Menu → Dropdown */}
            <button
              onClick={toggleDropdown}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <BsThreeDotsVertical className="text-xl text-gray-600" />
            </button>

            {/* DROPDOWN MENU */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={dropVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="absolute right-0 mt-12 w-56 bg-white shadow-xl rounded-md p-2 border z-50 top-0"
                >
                  {/* Role Dashboards */}
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
                    <DropdownItem to="/admin/panel" icon={<FaUser />}>
                      Admin Panel
                    </DropdownItem>
                  )}

                  {/* Edit Profile */}
                  <DropdownItem to="/edit-profile" icon={<FiSettings />}>
                    Edit Profile
                  </DropdownItem>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setIsOpen(false);
                    }}
                    className="menu-item text-red-600 flex items-center gap-2 p-2 hover:bg-red-50 rounded-md"
                  >
                    <RiLogoutBoxRLine /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // ---- NO USER (Show Login + Signup) ----
          <div className="flex gap-2">
            <NavLink to="/login">
              <button className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-full shadow hover:shadow-md transition">
                Login
              </button>
            </NavLink>

            <NavLink to="/signup">
              <button className="px-4 py-2 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-full shadow-sm hover:shadow-md transition">
                Signup
              </button>
            </NavLink>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* --- REUSABLE DROPDOWN ITEM --- */
const DropdownItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className="menu-item flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-gray-700 transition"
  >
    {icon} {children}
  </NavLink>
);
