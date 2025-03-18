// src/components/Header.js

import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar';
import Settings from './Settings';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0); // Store the last scroll position
  const isScrollingDown = useRef(false); // Store scroll direction
  const ticking = useRef(false); // Throttle updates

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (ticking.current) return; // Skip if a frame is already in progress

    requestAnimationFrame(() => {
      // Detect scroll direction
      if (currentScrollY > lastScrollY.current) {
        if (!isScrollingDown.current) {
          isScrollingDown.current = true;
          setIsHeaderVisible(false); // Hide header
        }
      } else {
        if (isScrollingDown.current) {
          isScrollingDown.current = false;
          setIsHeaderVisible(true); // Show header
        }
      }

      lastScrollY.current = currentScrollY; // Update last scroll position
      ticking.current = false; // Allow next frame
    });

    ticking.current = true; // Block until next frame
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <>
      <header
        className={`bg-gray-800 text-white py-4 px-6 flex justify-between items-center fixed top-0 w-full z-50 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center">
          <button
            className="text-white focus:outline-none mr-4"
            onClick={toggleNav}
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <NavBar isOpen={isNavOpen} onClose={toggleNav} />
        </div>

        <button
          className="text-white focus:outline-none"
          onClick={toggleSettings}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
        <Settings isOpen={isSettingsOpen} onClose={toggleSettings} />
      </header>
      <div
        style={{
          height: isHeaderVisible ? '60px' : '0px',
          transition: 'height 0.3s ease',
        }}
      />
    </>
  );
}

export default Header;
