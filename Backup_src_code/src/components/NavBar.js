// src/components/NavBar.js

import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NavBar({ isOpen, onClose }) {
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        onClose(); // Close the NavBar if the click is outside
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <nav
      ref={navRef} // Attach the ref to the NavBar element
      className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4 flex justify-between items-center bg-gray-900">
        <h2 className="text-xl font-bold">Quran</h2>
        <button onClick={onClose} className="text-white focus:outline-none">
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <ul className="space-y-2 bg-gray-800 h-full overflow-y-auto">
        <li>
          <Link
            to="/"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/bookmarks"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
          >
            Bookmarks
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
