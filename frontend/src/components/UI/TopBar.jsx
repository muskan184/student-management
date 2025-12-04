import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DarkLightToggleButton } from "./DarkLightToggleButton";
import { ColorPiker } from "./ColorPicker";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

export const TopBar = ({ setShowLogoutModal }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user, logoutUser } = useAuth();

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (search !== "") navigate(`/search/${search}`);
    else navigate("/");
  }, [search]);

  useEffect(() => {
    let theme = localStorage.getItem("theme");
    setIsDarkMode(theme === "dark");
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.style.setProperty("--sb-track-color", "#232e33");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "");
      document.documentElement.style.setProperty("--sb-track-color", "#f3f4f6");
      localStorage.removeItem("theme");
    }
  }, [isDarkMode]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 12 }}
      className="flex items-center sticky top-0 z-50 justify-between px-4 py-2 backdrop-blur-md bg-white/70 dark:bg-gray-100 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      {/* Search Bar */}
      <motion.div
        className="flex-1 max-w-md relative hidden sm:block"
        whileFocus={{ scale: 1.02 }}
      ></motion.div>

      {/* Logo on mobile */}
      <div className="flex items-center gap-2 sm:hidden text-lg">
        <img
          className="dark:invert w-6 md:w-8 transition-all"
          src="/logo.png"
          alt="Logo"
        />
        <span className="font-bold text-md text-[var(--primary-color)]"></span>
      </div>

      {/* Actions: Theme, ColorPicker, Auth */}
      <div className="ml- flex gap-4 md:gap-6 items-center relative">
        {/* Notification Icon */}
        <div className="relative group cursor-pointer">
          <div className="icon-hover-light">
            <IoNotificationsOutline className="text-2xl text-gray-600 dark:text-black" />
          </div>
        </div>

        {/* Color Picker */}
        <div className="relative group cursor-pointer">
          <div className="icon-hover-light">
            <ColorPiker />
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="relative group cursor-pointer">
          <div className="icon-hover-light">
            <DarkLightToggleButton
              toggleDarkMode={toggleDarkMode}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* User Avatar Dropdown */}
        {user ? (
          <div className="relative group">
            <div className="icon-hover-light">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:scale-105 rounded-full ring-2 ring-[var(--primary-color)] p-1 transition"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={user.profileImg}
                    alt="user"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="hidden sm:block text-sm md:text-base font-medium dark:text-white">
                  {user.firstName}
                </div>
              </button>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-md rounded-lg z-50"
                >
                  <NavLink
                    to={`/profile/${user.username}`}
                    onClick={() => setIsOpen(false)}
                    className="flex gap-2 items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaUser /> View Profile
                  </NavLink>
                  <NavLink
                    to="/edit-profile"
                    onClick={() => setIsOpen(false)}
                    className="flex gap-2 items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiSettings /> Edit Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex gap-2 items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-600 dark:text-white"
                  >
                    <RiLogoutBoxRLine /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <NavLink to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-semibold rounded-full hover:opacity-80 focus:ring-2"
            >
              Login
            </motion.button>
          </NavLink>
        )}
      </div>
    </motion.div>
  );
};
