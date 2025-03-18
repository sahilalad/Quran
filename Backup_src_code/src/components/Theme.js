// src/components/Theme.js
import React, { useState, useEffect } from 'react';

function Theme() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
      // Get initial theme preference from localStorage
      const storedTheme = localStorage.getItem('theme');
      return storedTheme === 'dark' ? true : false; // Default to light mode if not found
    });
  
    useEffect(() => {
      // Apply/remove the dark class and store the theme in localStorage
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme} 
      className="w-full bg-gray-200 text-white dark:text-white dark:bg-gray-700 rounded-3xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
    >
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

export default Theme;