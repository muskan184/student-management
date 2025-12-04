import React, { useEffect, useState } from "react";
import { FaPalette } from "react-icons/fa";

export const ColorPiker = () => {
  const [color, setColor] = useState(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-color")
      ?.trim() || "#4338ca"
  );

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", color);
  }, [color]);

  return (
    <div className="relative flex items-center group">
      {/* Label acts as the visible clickable icon */}
      <label
        htmlFor="theme-color"
        className="p-2 rounded-full bg-white dark:bg-neutral-800 border dark:border-neutral-700 border-gray-300 shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
        title="Choose Theme Color"
      >
        {/* Icon color changes based on selected color */}
        <FaPalette className="text-xl" style={{ color: color }} />
      </label>

      {/* Hidden color input */}
      <input
        type="color"
        id="theme-color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="absolute opacity-0 w-8 h-8 cursor-pointer"
      />

      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
        Choose Theme Color
      </div>
    </div>
  );
};
