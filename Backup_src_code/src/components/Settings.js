// src/components/Settings.js

import React, { useEffect, useRef } from 'react';
import Theme from './Theme';
import FontSize from './FontSize';
import AudioPlayerDisable from './AudioPlayerDisable';
import RecitationList from './RecitationList';
import { useAudioContext } from '../context/AudioContext';

function Settings({ isOpen, onClose }) {
  const settingsRef = useRef(null);
  const { recitationId, changeRecitationId } = useAudioContext();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        onClose();
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
      ref={settingsRef}
      className={`fixed top-0 right-0 h-screen w-64 bg-gray-900 text-white transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4 flex justify-between items-center bg-gray-900 border-b border-gray-700">
        <h2 className="text-xl font-bold">Settings</h2>
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
      <ul className="space-y-2 bg-gray-900 h-full overflow-y-auto p-4">
        <li className="mb-4">
          <FontSize />
        </li>
        <li className="mb-4">
          <Theme />
        </li>
        <li>
          <AudioPlayerDisable />
          <RecitationList
          selectedRecitation={recitationId}
          onRecitationChange={changeRecitationId}
        />
        </li>
      </ul>
    </nav>
  );
}

export default Settings;
