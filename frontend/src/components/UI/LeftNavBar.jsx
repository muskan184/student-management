import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Keep your icon imports as they are
import { 
  AiFillHome,
  AiOutlineHome,
  AiOutlineRobot
} from "react-icons/ai";
import { 
  FaUserEdit, 
  FaSignOutAlt,
  FaChevronDown
} from "react-icons/fa";
import { 
  FiMenu,
  FiSettings,
  FiBookOpen,
  FiBook,
  FiMessageSquare
} from "react-icons/fi";
import { 
  RxCross2,
  RxDashboard
} from "react-icons/rx";
import { 
  MdOutlineTask,
  MdOutlineFlashOn
} from "react-icons/md";
import { 
  RiQuestionAnswerLine
} from "react-icons/ri";
import { 
  TbListDetails,
  TbRobot,
  TbCards
} from "react-icons/tb";
import { 
  IoPersonOutline,
  IoLogOutOutline
} from "react-icons/io5";

export const LeftNavBar = ({ isOpen, setIsOpen }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const role = user?.role?.toLowerCase();
  const isStudent = role === "student";
  const isTeacher = role === "teacher";

  const toggleDropdown = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? "w-72" : "w-20"
      }`}
      style={{ zIndex: 40 }}
    >
      {/* Header with Brand */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200/50 dark:border-gray-700/50">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{ 
                background: "linear-gradient(to bottom right, var(--primary-color), var(--primary-dark, #3730a3))"
              }}
            >
              <span className="text-white font-bold text-lg">IC</span>
            </div>
            <div>
              <h1 
                className="text-xl font-bold text-[var(--primary-color)]"
              
              >
                IntelliConnect
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role} Portal</p>
            </div>
          </div>
        )}
        
     

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            isOpen ? "" : "ml-auto"
          }`}
        >
          {isOpen ? (
            <RxCross2 className="text-gray-600 dark:text-gray-400 text-lg" />
          ) : (
            <FiMenu className="text-gray-600 dark:text-gray-400 text-lg" />
          )}
        </button>
      </div>

      {/* User Info */}
      {isOpen && (
        <div 
          className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 mx-3 my-4 rounded-xl"
          style={{ 
            background: "linear-gradient(to right, color-mix(in srgb, var(--primary-color) 10%, transparent), color-mix(in srgb, var(--primary-dark, #3730a3) 10%, transparent))"
          }}
        >
          <div onClick={()=>{navigate(`/profile/${user.id}`)}} className="flex cursor-pointer items-center gap-3">
            <div className="relative">
              <img
                src={user.profilePic || "/default-avatar.png"}
                alt={user.firstName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
        {/* Student Menu */}
        {isStudent && (
          <>
            <NavItem
              to="/student/dashboard"
              text="Dashboard"
              isOpen={isOpen}
              icon={<RxDashboard />}
              activeIcon={<AiFillHome />}
              location={location}
              onClick={handleLinkClick}
            />

            <DropdownMenu
              title="Notes"
              menuKey="notes"
              isOpen={isOpen}
              openMenu={openMenu}
              toggleDropdown={toggleDropdown}
              icon={<FiBookOpen />}
              activeIcon={<FiBook />}
              location={location}
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
              icon={<TbCards />}
              activeIcon={<MdOutlineFlashOn />}
              location={location}
              links={[
                { to: "/student/flashcards", label: "All Flashcards" },
                { to: "/student/flashcards/create", label: "Create Flashcard" },
              ]}
            />

            <DropdownMenu
              title="Planner"
              menuKey="planner"
              isOpen={isOpen}
              openMenu={openMenu}
              toggleDropdown={toggleDropdown}
              icon={<MdOutlineTask />}
              activeIcon={<TbListDetails />}
              location={location}
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
              icon={<FiMessageSquare />}
              activeIcon={<RiQuestionAnswerLine />}
              location={location}
              links={[
                { to: "/student/questions", label: "All Questions" },
                { to: "/student/questions/ask", label: "Ask Question" },
              ]}
            />

            <NavItem
              to="/student/ai"
              text="AI Assistant"
              isOpen={isOpen}
              icon={<AiOutlineRobot />}
              activeIcon={<TbRobot />}
              location={location}
              onClick={handleLinkClick}
            />
          </>
        )}

        {/* Teacher Menu */}
        {isTeacher && (
          <>
            <NavItem
              to="/teacher/dashboard"
              text="Dashboard"
              isOpen={isOpen}
              icon={<RxDashboard />}
              activeIcon={<AiFillHome />}
              location={location}
              onClick={handleLinkClick}
            />

            <NavItem
              to="/teacher/questions"
              text="Forum Questions"
              isOpen={isOpen}
              icon={<FiMessageSquare />}
              activeIcon={<RiQuestionAnswerLine />}
              location={location}
              onClick={handleLinkClick}
            />
          </>
        )}

        {/* Common Menu Items */}
        <div className="pt-4 mt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <NavItem
            to={isStudent ? "/student/profile" : "/teacher/profile"}
            text="Edit Profile"
            isOpen={isOpen}
            icon={<IoPersonOutline />}
            activeIcon={<FaUserEdit />}
            location={location}
            onClick={handleLinkClick}
          />

          <NavItem
            to={isStudent ? "/student/settings" : "/teacher/settings"}
            text="Settings"
            isOpen={isOpen}
            icon={<FiSettings />}
            activeIcon={<FiSettings />}
            location={location}
            onClick={handleLinkClick}
          />
        </div>

        {/* Logout Button */}
        <div className={`pt-4 mt-4 border-t border-gray-200/50 dark:border-gray-700/50 ${
          isOpen ? "px-2" : "px-1"
        }`}>
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:shadow-sm ${
              isOpen ? "gap-3" : "justify-center"
            }`}
          >
            <IoLogOutOutline className="text-lg" />
            {isOpen && (
              <span className="font-medium whitespace-nowrap">Logout</span>
            )}
          </button>
        </div>
      </nav>

      {/* Collapsed Hover Indicator */}
      {!isOpen && (
        <div 
          className="absolute top-1/2 -right-3 w-2 h-16 rounded-full shadow-lg transform -translate-y-1/2"
          style={{ 
            background: "linear-gradient(to bottom, var(--primary-color), var(--primary-dark, #3730a3))"
          }}
        />
      )}
    </div>
  );
};

const NavItem = ({ 
  to, 
  text, 
  icon, 
  activeIcon, 
  isOpen, 
  location, 
  onClick 
}) => {
  const isActive = location.pathname === to;
  
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive: navIsActive }) =>
          `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 mb-1 ${
            navIsActive || isActive
              ? "text-[var(--primary-color)] border shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm"
          }`}
        style={({ isActive: navIsActive }) => ({
          backgroundColor: (navIsActive || isActive) 
            ? 'color-mix(in srgb, var(--primary-color) 10%, transparent)' 
            : undefined,
          borderColor: (navIsActive || isActive) 
            ? 'color-mix(in srgb, var(--primary-color) 30%, transparent)' 
            : undefined
        })}
      >
        <div 
          className="p-2 rounded-lg"
          style={{ 
            backgroundColor: isActive 
              ? 'color-mix(in srgb, var(--primary-color) 20%, transparent)' 
              : '#f3f4f6',
            color: isActive ? 'var(--primary-color)' : '#6b7280'
          }}
        >
          {isActive && activeIcon ? activeIcon : icon}
        </div>
        {isOpen && (
          <span className="font-medium whitespace-nowrap">
            {text}
          </span>
        )}
        {isActive && isOpen && (
          <div 
            className="w-2 h-2 rounded-full ml-auto"
            style={{ backgroundColor: 'var(--primary-color)' }}
          />
        )}
      </NavLink>
    </li>
  );
};

const DropdownMenu = ({
  title,
  icon,
  activeIcon,
  links,
  menuKey,
  isOpen,
  openMenu,
  toggleDropdown,
  location
}) => {
  const isActive = links.some(link => location.pathname === link.to);
  const isExpanded = openMenu === menuKey;

  return (
    <li className="mb-1">
      <button
        onClick={() => toggleDropdown(menuKey)}
        className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "text-[var(--primary-color)] border shadow-sm"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm"
        }`}
        style={isActive ? {
          backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)',
          borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent)'
        } : {}}
      >
        <div 
          className="p-2 rounded-lg"
          style={{ 
            backgroundColor: isActive 
              ? 'color-mix(in srgb, var(--primary-color) 20%, transparent)' 
              : '#f3f4f6',
            color: isActive ? 'var(--primary-color)' : '#6b7280'
          }}
        >
          {isActive && activeIcon ? activeIcon : icon}
        </div>
        
        {isOpen && (
          <>
            <span className="font-medium ml-3 flex-1 text-left whitespace-nowrap">
              {title}
            </span>
            <div className={`text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}>
              <FaChevronDown />
            </div>
          </>
        )}
      </button>

      {isExpanded && isOpen && (
        <ul className="ml-12 mt-1 space-y-1">
          {links.map((item, i) => {
            const isLinkActive = location.pathname === item.to;
            
            return (
              <li key={i}>
                <NavLink
                  to={item.to}
                  className={({ isActive: navIsActive }) =>
                    `flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                      navIsActive || isLinkActive
                        ? "text-[var(--primary-color)] font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                  }
                  style={({ isActive: navIsActive }) => ({
                    backgroundColor: (navIsActive || isLinkActive) 
                      ? 'color-mix(in srgb, var(--primary-color) 10%, transparent)' 
                      : undefined
                  })}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ 
                      backgroundColor: (location.pathname === item.to) 
                        ? 'var(--primary-color)' 
                        : '#d1d5db'
                    }}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

export const SidebarBackdrop = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
    />
  );
};