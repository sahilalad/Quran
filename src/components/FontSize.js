// src/components/FontSize.js
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus, FaMinus } from "react-icons/fa";

function FontSize() {
  const [isExpanded, setIsExpanded] = useState(false); // Default: Collapsed
  const defaultFontSizes = {
    arabic: 24,
    urdu: 18,
    english: 16,
    gujarati: 16,
    hindi: 16,
  };

  const [fontSizes, setFontSizes] = useState(() => {
    return Object.keys(defaultFontSizes).reduce((sizes, key) => {
      sizes[key] = parseInt(localStorage.getItem(`${key}FontSize`) || defaultFontSizes[key], 10);
      return sizes;
    }, {});
  });

  const updateFontSizeInDOM = (type, size) => {
    document.documentElement.style.setProperty(`--${type}-font-size`, `${size}px`);
  };

  const handleFontSizeChange = (type, operation) => {
    const newSize = Math.max(12, operation === 'increase' ? fontSizes[type] + 1 : fontSizes[type] - 1);
    setFontSizes((prevSizes) => ({
      ...prevSizes,
      [type]: newSize,
    }));
    localStorage.setItem(`${type}FontSize`, newSize);
    updateFontSizeInDOM(type, newSize);
  };

  const resetFontSizes = () => {
    setFontSizes(defaultFontSizes);
    Object.keys(defaultFontSizes).forEach((type) => {
      updateFontSizeInDOM(type, defaultFontSizes[type]);
      localStorage.setItem(`${type}FontSize`, defaultFontSizes[type]);
    });
  };

  useEffect(() => {
    Object.keys(fontSizes).forEach((type) => {
      updateFontSizeInDOM(type, fontSizes[type]);
    });
  }, [fontSizes]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-3xl mb-2 transition-all duration-100">
      {/* Expand/Collapse Banner */}
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-200 dark:bg-gray-700 rounded-3xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-l font-semibold text-gray-700 dark:text-white flex items-center">
          {isExpanded ? (
            <FaChevronUp className="mr-2 text-gray-900 dark:text-gray-300" />
          ) : (
            <FaChevronDown className="mr-2 text-gray-900 dark:text-gray-300" />
          )}
          Font Size
        </h3>
      </div>

      {/* Slide Content */}
      <div className={`overflow-hidden transition-all duration-100 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 space-y-2">
          {Object.keys(defaultFontSizes).map((key) => (
            <div className="grid grid-cols-2 gap-4 items-center" key={key}>
              <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => handleFontSizeChange(key, 'decrease')}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-blue-100 text-blue-600 dark:text-blue-400 transition-colors"
                >
                  <FaMinus className="w-4 h-4 text-gray-900 dark:text-gray-300" />
                </button>
                <span className="w-12 text-center text-gray-700 dark:text-gray-200 font-medium">
                  {fontSizes[key]}px
                </span>
                <button
                  onClick={() => handleFontSizeChange(key, 'increase')}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-blue-100 text-blue-600 dark:text-blue-400 transition-colors"
                >
                  <FaPlus className="w-4 h-4 text-gray-900 dark:text-gray-300" />
                </button>
              </div>
            </div>
          ))}

          {/* Reset Button */}
          <button
            onClick={resetFontSizes}
            className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-red-500 to-teal-400 hover:from-blue-600 hover:to-red-700 text-white rounded-3xl font-medium transition-all transform hover:scale-[1.02]"
          >
            Reset to Default Sizes
          </button>
        </div>
      </div>
    </div>
  );
}

export default FontSize;
