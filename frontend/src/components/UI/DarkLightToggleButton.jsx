import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export const DarkLightToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = !document.documentElement.classList.contains("dark");
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-14 h-7 rounded-full p-1 transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? "bg-gray-700" 
          : "bg-gradient-to-r from-amber-300 to-yellow-400"
        }`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out
          ${isDarkMode 
            ? "left-7 bg-gray-800" 
            : "left-0.5 bg-white"
          }`}
      >
        {isDarkMode ? (
          <FiMoon className="text-blue-300 w-4 h-4" />
        ) : (
          <FiSun className="text-yellow-500 w-4 h-4" />
        )}
      </div>
    </button>
  );
};