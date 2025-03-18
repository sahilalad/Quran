// src/components/Header.js
import React, { useState } from "react";
import NavBar from "./NavBar";
import Settings from "./Settings";
import useScrollVisibility from "../hooks/useScrollVisibility";
import SearchBar from "./SearchBar";
import { FaBars, FaSlidersH } from "react-icons/fa"; // React Icons
import { IoSettingsSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isHeaderVisible = useScrollVisibility();

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  return (
    <>
      <header
        className={`bg-gray-800 text-white py-2 px-6 flex justify-between items-center fixed top-0 w-full z-50 transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center">
          <button
            className="text-white focus:outline-none mr-4 hover:text-teal-400 transition-colors duration-200"
            onClick={toggleNav}
            aria-label="Toggle navigation menu"
          >
            <GiHamburgerMenu            className="h-6 w-6" />
          </button>
          <NavBar isOpen={isNavOpen} onClose={toggleNav} />
        </div>

        <div className="flex items-center space-x-4">
          <SearchBar />
          <button
            className="text-white focus:outline-none hover:text-teal-400 transition-colors duration-200"
            onClick={toggleSettings}
            aria-label="Open settings"
          >
            <IoSettingsSharp className="h-6 w-6" />
          </button>
          <Settings isOpen={isSettingsOpen} onClose={toggleSettings} />
        </div>
      </header>
      <div style={{ height: "60px", transition: "height 0.3s ease" }} />
    </>
  );
}

export default Header;
