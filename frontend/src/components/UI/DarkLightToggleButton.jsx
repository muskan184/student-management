import { FiSun, FiMoon } from "react-icons/fi";

export const DarkLightToggleButton = ({ toggleDarkMode, isDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-14 h-7 bg-gray-300  dark:bg-gray-600 rounded-full p-1 transition-colors duration-300`}
      aria-label="Toggle dark mode"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center 
                bg-white text-yellow-500 dark:text-white transition-transform duration-300 
                ${isDarkMode ? "translate-x-7" : "translate-x-0"}`}
      >
        {isDarkMode ? (
          <FiMoon className="invert" size={16} />
        ) : (
          <FiSun size={16} />
        )}
      </div>
    </button>
  );
};
