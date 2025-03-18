// src/components/StickyNav.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioContext } from '../contexts/AudioContext.js';
import { FaBookOpen, FaLanguage, FaBars } from "react-icons/fa"; // React Icons

const STICKY_SCROLL_THRESHOLD = 50; // Adjust threshold as needed

/**
 * StickyNav Component
 * 
 * Displays a fixed navigation bar under the header that replicates the functionality
 * of your main header (Translation, Arabic Only, Ruku Selector). This version includes
 * a dropdown popup for the Ruku Selector. When a user selects a ruku, the page scrolls
 * smoothly to that ruku's starting ayah.
 *
 * Props:
 * - activeTab: current active tab string
 * - handleTabChange: function to change tabs
 * - enabled: boolean flag to allow users to disable the sticky nav (default: true)
 * - rukus: array of ruku objects (each with properties such as ruku_number and start_ayah)
 */
const StickyNav = ({
  activeTab,
  handleTabChange,
  enabled = true,
  rukus = []
}) => {
  const { isAudioPlayerDisabled } = useAudioContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Determine bottom offset based on audio player state.
  // When audio is enabled (i.e. isAudioPlayerDisabled is false), move sticky nav up (bottom-20 ~80px).
  const bottomClass = !isAudioPlayerDisabled ? 'bottom-20' : 'bottom-4';

  // Monitor scroll position and update visibility.
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > STICKY_SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle the Ruku dropdown on button click.
  const handleRukuButtonClick = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // When a ruku is selected, scroll to its start ayah and close the dropdown.
  const handleRukuSelect = (ruku) => {
    // Assumes ruku.start_ayah is in the format "surah:ayah", e.g., "1:5".
    const targetId = `ayah-${ruku.start_ayah}`;
    const targetElem = document.getElementById(targetId);
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setIsDropdownOpen(false);
  };

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!enabled) return null;

  return (
    <div
      className={`
        fixed ${bottomClass} left-1/2 transform -translate-x-1/2 z-40 transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="bg-gray-100 dark:bg-gray-900 shadow-xl rounded-full p-2 flex space-x-6">
        {/* Translation Button with Open Book Icon */}
        <button
          onClick={() => handleTabChange('translation')}
          className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Switch to Translation"
        >
          <FaLanguage className="h-5 w-5 text-gray-800 dark:text-gray-100" />
        </button>

        {/* Arabic Only Button with "ع" Icon */}
        <button
          onClick={() => handleTabChange('arabic only')}
          className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full focus:outline-none"
          aria-label="Switch to Arabic Only"
        >
          <FaBookOpen className="h-5 w-5 text-gray-800 dark:text-gray-100" />
        </button>

        {/* Ruku Selector Button with Dropdown */}
        <div className="relative">
          <button
            onClick={handleRukuButtonClick}
            className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full focus:outline-none"
            aria-label="Select Ruku"
          >
            <FaBars className="h-5 w-5 text-gray-800 dark:text-gray-100" />
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 bottom-full mb-2 w-40 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg z-20"
            >
              <ul className="py-2">
                {rukus.map((ruku) => (
                  <li key={ruku.ruku_number}>
                    <button
                      onClick={() => handleRukuSelect(ruku)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {`Ruku ${ruku.ruku_number}`}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyNav;
