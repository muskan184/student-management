import React, { useState } from "react";
import { FaThLarge, FaBars } from "react-icons/fa";

export const ViewToggle = ({ onToggle }) => {
  const [isGrid, setIsGrid] = useState(true);

  const handleToggle = () => {
    setIsGrid(!isGrid);
    onToggle(!isGrid); // Pass the state up if needed
  };

  return (
    <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg p-1 w-fit shadow-lg border border-white/20">
      <button
        onClick={handleToggle}
        className={`relative flex items-center justify-between w-24 h-10 rounded-md transition-colors duration-300 overflow-hidden ${
          isGrid ? "bg-[--primary-color]" : "bg-gray-300/50"
        }`}
      >
        <div
          className={`absolute w-1/2 h-full bg-white/90 rounded-md shadow-xl transition-transform duration-300 ${
            isGrid ? "translate-x-0" : "translate-x-full"
          }`}
        />
        <div className="flex justify-center items-center flex-1 z-10">
          <FaThLarge
            className={`text-xl transition-colors duration-200 ${
              isGrid ? "text-[--primary-color]" : "text-gray-500"
            }`}
          />
        </div>
        <div className="flex justify-center items-center flex-1 z-10">
          <FaBars
            className={`text-xl transition-colors duration-200 ${
              isGrid ? "text-white" : "text-[--primary-color]"
            }`}
          />
        </div>
      </button>
    </div>
  );
};
