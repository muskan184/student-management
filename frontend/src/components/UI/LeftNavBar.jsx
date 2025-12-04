import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

// Icons - updated based on name relevance
import { AiFillHome } from "react-icons/ai";
import { RiCompassDiscoverLine } from "react-icons/ri";
import { BsFolder2Open } from "react-icons/bs";
import { FaBloggerB } from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../../context/AuthContext";

export const LeftNavBar = ({ setShowLogoutModal }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const { user } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <motion.div
      initial={{ width: isOpen ? 260 : 64 }}
      animate={{ width: isOpen ? 260 : 64 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="bg-white dark:bg-white text-gray-700 dark:text-white h-screen p-3 fixed md:relative flex flex-col z-50 shadow-lg border-r border-gray-200 dark:border-gray-800"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isOpen && (
            <span className="text-xl font-semibold text-black">
              IntelliConnect
            </span>
          )}
        </div>
        <button
          className="bg-gray-100 dark:bg-black p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={toggleSidebar}
        >
          {isOpen ? <RxCross2 size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="mt-4 flex-1">
        <ul className="space-y-1">
          <NavItem to="/" text="Home" isOpen={isOpen} icon={<AiFillHome />} />

          {/* Divider */}
          {user && (
            <>
              <div className="border-t my-3 border-gray-300 dark:border-gray-700" />
              <NavItem
                to="/edit-profile"
                text="Edit Profile"
                isOpen={isOpen}
                icon={<FaUserEdit />}
              />
              <li>
                <div
                  onClick={() => setShowLogoutModal(true)}
                  className={`flex items-center ${
                    isOpen ? "gap-3" : "justify-center"
                  } p-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-gray-800 cursor-pointer transition`}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-6 h-6 flex justify-center items-center"
                  >
                    <FaSignOutAlt size={20} />
                  </motion.div>
                  {isOpen && (
                    <span className="text-sm font-medium">Logout</span>
                  )}
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>
    </motion.div>
  );
};

const NavItem = ({ to, text, icon, isOpen }) => {
  return (
    <li className="relative group">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center relative overflow-hidden ${
            isOpen ? "gap-3" : "justify-center"
          } p-3 rounded-lg transition-all duration-300 z-10 font-medium
          ${
            isActive
              ? "bg-[var(--primary-color)]/20 text-[var(--primary-color)] shadow-inner shadow-[var(--primary-color)]"
              : "hover:bg-[var(--primary-color)]/10 text-gray-700 dark:text-white"
          }`
        }
      >
        {/* Animated background glow */}
        <span className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--primary-color)] opacity-10 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 z-0" />

        {/* Active glowing dot */}
        {({ isActive }) =>
          isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--primary-color)] rounded-full shadow-sm animate-pulse" />
          )
        }

        {/* Icon with slide-rotate-bounce */}
        <motion.div
          initial={{ x: -10 }}
          whileHover={{ x: 0, rotate: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-6 h-6 flex justify-center items-center z-10 group-hover:text-[var(--primary-color)]"
        >
          {icon}
        </motion.div>

        {/* Text with bounce zoom effect */}
        {isOpen && (
          <motion.span
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="z-10 text-sm tracking-wide group-hover:text-[var(--primary-color)] group-hover:drop-shadow-md"
          >
            {text}
          </motion.span>
        )}
      </NavLink>

      {/* Under-glow line effect */}
      <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-[var(--primary-color)] group-hover:w-5 transition-all duration-500 rounded-full" />
    </li>
  );
};
