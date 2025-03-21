// src/components/NavBar.js
import React, { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import NavbarSurahDropdown from "./NavbarSurahDropdown";
import { FaTimes, FaHome, FaBookmark, FaChartBar, FaHands } from "react-icons/fa"; // React Icons
import { LiaHandsSolid } from "react-icons/lia";
function NavBar({ isOpen, onClose }) {
  const navRef = useRef(null);

  // Handle clicks outside the NavBar
  const handleClickOutside = useCallback(
    (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        onClose(); // Close the NavBar if the click is outside
      }
    },
    [onClose]
  );

  // Handle 'Escape' key press
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose(); // Close the NavBar on 'Escape' key press
      }
    },
    [onClose]
  );

  // Handle back button press
  const handleBackButton = useCallback(() => {
    if (isOpen) {
      onClose(); // Close the NavBar on Back button press
    }
  }, [isOpen, onClose]);

  // Add/remove event listeners based on `isOpen`
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("popstate", handleBackButton); // Listen for back button
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handleBackButton); // Cleanup on unmount
    };
  }, [isOpen, handleClickOutside, handleKeyDown, handleBackButton]);

  // Nav links data with icons
  const navLinks = [
    { to: "/", label: "Home", icon: <FaHome className="w-5 h-5 inline-block mr-2" /> },
    { to: "/bookmarks", label: "Bookmarks", icon: <FaBookmark className="w-5 h-5 inline-block mr-2" /> },
    { to: "/progress", label: "Reading Progress", icon: <FaChartBar className="w-5 h-5 inline-block mr-2" /> },
    { to: "/duas", label: "All Duas", icon: <FaHands className="w-5 h-5 inline-block mr-2" /> }, // Add the Arabic Reading link
    { to: "/duacategories", label: "Dua Categories", icon:  <LiaHandsSolid className="w-5 h-5 inline-block mr-2"/> },
  ];

  return (
    <nav
      ref={navRef}
      aria-label="Main Navigation"
      className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      {/* Nav Header */}
      <div className="p-4 flex justify-between items-center bg-gray-800">
        <h2 className="text-xl font-bold">Quran</h2>
        <button
          onClick={onClose}
          aria-label="Close Navigation"
          className="text-white focus:outline-none hover:text-teal-400 transition-colors duration-200"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      {/* Nav Links */}
      <ul className="space-y-2 bg-gray-800 h-full overflow-y-auto">
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              onClick={onClose} // Close NavBar on link click
              className="flex items-center px-4 py-2 hover:bg-gray-700 hover:text-teal-400 transition-colors duration-200"
            >
              {link.icon}
              {link.label}
            </Link>
          </li>
        ))}
        {/* Surah and Ayah Dropdowns */}
        <li className="px-4 py-2">
          <NavbarSurahDropdown />
        </li>
      </ul>
    </nav>
  );
}

NavBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NavBar;
