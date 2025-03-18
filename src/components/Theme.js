// src/components/Theme.js
import React, { useCallback, useEffect, useMemo } from 'react';
import { IoSunny,IoMoonSharp } from "react-icons/io5";

// Constants moved outside component to avoid recreation
const THEME_KEY = 'theme';
const DARK_MODE = 'dark';
const LIGHT_MODE = 'light';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

// Custom hook for theme management
const useTheme = () => {
  // Get initial theme using lazy initialization
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    return storedTheme 
      ? storedTheme === DARK_MODE
      : window.matchMedia(MEDIA_QUERY).matches;
  });

  // Memoized theme values
  const theme = useMemo(() => ({
    current: isDarkMode ? DARK_MODE : LIGHT_MODE,
    isDark: isDarkMode,
    opposite: isDarkMode ? LIGHT_MODE : DARK_MODE
  }), [isDarkMode]);

  // Handle theme change
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle(DARK_MODE, isDarkMode);
    localStorage.setItem(THEME_KEY, theme.current);
  }, [isDarkMode, theme.current]);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    
    const handleChange = (e) => {
      // Only update if there's no stored preference
      if (!localStorage.getItem(THEME_KEY)) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Memoized toggle function
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return {
    isDarkMode,
    toggleTheme,
    theme
  };
};

// Memoized button component
const ThemeButton = React.memo(({ isDarkMode, onClick }) => (
  <button
    onClick={onClick}
    aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
               transform transition-all duration-300 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <div className="relative w-5 h-5">
      <IoSunny 
        className={`absolute w-5 h-5 text-gray-700 transition-all duration-300 
          ${isDarkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}
      />
      <IoMoonSharp 
        className={`absolute w-5 h-5 text-gray-200 transition-all duration-300 
          ${isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}
      />
    </div>
  </button>
));

// Main Theme component
const Theme = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return <ThemeButton isDarkMode={isDarkMode} onClick={toggleTheme} />;
};

// Use memo for the entire component
export default React.memo(Theme);