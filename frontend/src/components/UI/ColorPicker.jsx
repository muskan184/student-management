import { useEffect, useState, useRef } from "react";
import { FaPalette, FaCheck, FaBrush } from "react-icons/fa";

export const ColorPicker = () => {
  const [color, setColor] = useState("#4338ca");
  const [showPalette, setShowPalette] = useState(false);
  const colorPickerRef = useRef(null);

  // Predefined color palette
  const colorPalette = [
    { name: "Indigo", value: "#4338ca" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Emerald", value: "#10b981" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Teal", value: "#0d9488" },
    { name: "Pink", value: "#ec4899" },
  ];

  // Load saved color on mount
  useEffect(() => {
    const root = document.documentElement;
    const savedColor = localStorage.getItem("theme-color");
    
    if (savedColor) {
      setColor(savedColor);
      // Apply the saved color to CSS variable
      root.style.setProperty("--primary-color", savedColor);
    } else {
      // Set default
      root.style.setProperty("--primary-color", "#4338ca");
    }
  }, []);

  // Apply color to CSS variables ONLY
  const applyThemeColor = (newColor) => {
    const root = document.documentElement;
    
    // ONLY set the primary color variable
    root.style.setProperty("--primary-color", newColor);
    
    // Optionally, you can also set these if you use them:
    // root.style.setProperty("--primary-light", lightenColor(newColor, 20));
    // root.style.setProperty("--primary-dark", darkenColor(newColor, 20));
    
    localStorage.setItem("theme-color", newColor);
  };

  // Helper to lighten color (optional)
  const lightenColor = (hex, percent) => {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse r, g, b
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Helper to darken color (optional)
  const darkenColor = (hex, percent) => {
    hex = hex.replace(/^#/, '');
    
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Handle color change
  const handleColorChange = (newColor) => {
    setColor(newColor);
    applyThemeColor(newColor);
  };

  // Handle custom color pick
  const handleCustomColor = (e) => {
    const newColor = e.target.value;
    handleColorChange(newColor);
  };

  // Close palette when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowPalette(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={colorPickerRef}>
      {/* Main Button */}
      <button
        onClick={() => setShowPalette(!showPalette)}
        className={`relative p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 ${
          showPalette ? "ring-2 ring-[var(--primary-color)]/20" : ""
        }`}
        aria-label="Choose theme color"
        style={{ color: "var(--primary-color)" }}
      >
        <FaPalette className="text-lg" />
        
        {/* Current color indicator */}
        <div 
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
          style={{ backgroundColor: "var(--primary-color)" }}
        />
      </button>

      {/* Color Palette Dropdown */}
      {showPalette && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {/* Header */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FaBrush className="text-[var(--primary-color)]" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">Theme Color</span>
            </div>
          </div>

          {/* Current Color Preview */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-inner"
                style={{ backgroundColor: "var(--primary-color)" }}
              />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Current</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{color}</p>
              </div>
            </div>
          </div>

          {/* Color Grid */}
          <div className="p-3">
            <div className="grid grid-cols-4 gap-2">
              {colorPalette.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => handleColorChange(colorOption.value)}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    color === colorOption.value
                      ? "border-[var(--primary-color)] scale-110 shadow-md"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.name}
                >
                  {color === colorOption.value && (
                    <FaCheck className="text-white mx-auto text-xs absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={handleCustomColor}
                className="w-full h-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => {
                handleColorChange("#4338ca");
                setShowPalette(false);
              }}
              className="w-full py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};