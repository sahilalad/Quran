// src/components/Header.js
import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Settings from "./Settings";
import SearchBar from "./SearchBar";
import { IoSettingsSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Improved scroll handler with debounce and immediate top visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show header when at the top (0-10px)
      if (currentScrollY < 10) {
        setIsHeaderVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }
      
      // Show on scroll up, hide on scroll down
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling down and not at the very top
        setIsHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add throttling to prevent excessive updates
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, [lastScrollY]);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  return (
    <>
      <header
        className={`bg-gray-800 text-white py-2 px-6 flex justify-between items-center fixed top-0 w-full z-50 transition-transform duration-200 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center">
          <button
            className="text-white focus:outline-none mr-4 hover:text-teal-400 transition-colors duration-200"
            onClick={toggleNav}
            aria-label="Toggle navigation menu"
          >
            <GiHamburgerMenu className="h-6 w-6" />
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
      <div style={{ height: "60px" }} />
    </>
  );
}

export default Header;
