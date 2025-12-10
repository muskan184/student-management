/* --- STUDENT SIDEBAR WITH DROPDOWN MENUS --- */

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import { AiFillHome } from "react-icons/ai";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { RiFlashlightLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { PiRobotBold } from "react-icons/pi";

import { useAuth } from "../../context/AuthContext";

export const LeftNavBar = ({ setShowLogoutModal, isOpen, setIsOpen }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const { user } = useAuth();

  // ⛔ If no user → don't render sidebar
  if (!user) {
    return null;
  }

  const role = user?.role?.toLowerCase();

  const toggleDropdown = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <motion.div
      initial={{ width: isOpen ? 260 : 70 }}
      animate={{ width: isOpen ? 260 : 70 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-r h-screen fixed left-0 top-0 z-50 p-3 shadow-sm"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        {isOpen && (
          <span className="text-xl font-semibold whitespace-nowrap">
            IntelliConnect
          </span>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded hover:bg-gray-100"
        >
          {isOpen ? <RxCross2 size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="mt-6">
        <ul className="space-y-2">
          {role === "student" && (
            <>
              <NavItem
                to="/student/dashboard"
                text="Dashboard"
                isOpen={isOpen}
                icon={<AiFillHome />}
              />

              <DropdownMenu
                title="Notes"
                menuKey="notes"
                isOpen={isOpen}
                openMenu={openMenu}
                toggleDropdown={toggleDropdown}
                icon={<MdOutlineLibraryBooks />}
                links={[
                  { to: "/student/notes", label: "All Notes" },
                  { to: "/student/notes/create", label: "Create Note" },
                ]}
              />

              <DropdownMenu
                title="Flashcards"
                menuKey="flashcards"
                isOpen={isOpen}
                openMenu={openMenu}
                toggleDropdown={toggleDropdown}
                icon={<RiFlashlightLine />}
                links={[
                  { to: "/student/flashcards", label: "All Flashcards" },
                  {
                    to: "/student/flashcards/create",
                    label: "Create Flashcard",
                  },
                ]}
              />

              <DropdownMenu
                title="Planner"
                menuKey="planner"
                isOpen={isOpen}
                openMenu={openMenu}
                toggleDropdown={toggleDropdown}
                icon={<TbListDetails />}
                links={[
                  { to: "/student/planner", label: "All Tasks" },
                  { to: "/student/planner/add-task", label: "Add Task" },
                ]}
              />

              <DropdownMenu
                title="Q/A Forum"
                menuKey="questions"
                isOpen={isOpen}
                openMenu={openMenu}
                toggleDropdown={toggleDropdown}
                icon={<RiQuestionAnswerLine />}
                links={[
                  { to: "/student/questions", label: "All Questions" },
                  { to: "/student/questions/ask", label: "Ask Question" },
                ]}
              />

              <NavItem
                to="/student/ai"
                text="AI Assistant"
                isOpen={isOpen}
                icon={<PiRobotBold />}
              />
            </>
          )}

          {/* Edit Profile */}
          <NavItem
            to="/student/profile"
            text="Edit Profile"
            isOpen={isOpen}
            icon={<FaUserEdit />}
          />

          {/* LOGOUT */}
          <li className="pt-4 border-t">
            <div
              onClick={() => setShowLogoutModal(true)}
              className={`flex items-center p-2 cursor-pointer text-red-500 ${
                isOpen ? "gap-3" : "justify-center"
              }`}
            >
              <FaSignOutAlt size={20} />
              {isOpen && "Logout"}
            </div>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};

const NavItem = ({ to, text, icon, isOpen }) => (
  <li>
    <NavLink
      to={to}
      className="flex items-center gap-3 p-3 rounded hover:bg-gray-100"
    >
      {icon}
      {isOpen && <span>{text}</span>}
    </NavLink>
  </li>
);

const DropdownMenu = ({
  title,
  icon,
  links,
  menuKey,
  isOpen,
  openMenu,
  toggleDropdown,
}) => (
  <li>
    <button
      onClick={() => toggleDropdown(menuKey)}
      className="flex items-center w-full p-3 gap-3 hover:bg-gray-100 rounded"
    >
      {icon}
      {isOpen && (
        <div className="flex justify-between w-full">
          <span>{title}</span>
          <span>{openMenu === menuKey ? "▲" : "▼"}</span>
        </div>
      )}
    </button>

    {openMenu === menuKey && (
      <ul className="ml-10 space-y-1">
        {links.map((item, i) => (
          <NavLink key={i} to={item.to} className="block p-2 hover:underline">
            {item.label}
          </NavLink>
        ))}
      </ul>
    )}
  </li>
);
