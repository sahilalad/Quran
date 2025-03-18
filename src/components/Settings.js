// src/components/Settings.js
import React, { useEffect, useRef } from "react";
import Theme from "./Theme";
import FontSize from "./FontSize";
import AudioPlayerDisable from "./AudioPlayerDisable";
import RecitationList from "./RecitationList";
import { useAudioContext } from "../contexts/AudioContext";
import { useTranslation } from "../contexts/TranslationContext";
import TranslationSelector from "./TranslationSelector";
import { FaTimes } from "react-icons/fa"; // React Icon for Close Button

function Settings({ isOpen, onClose }) {
  const settingsRef = useRef(null);
  const { recitationId, changeRecitationId } = useAudioContext();

  // Existing click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Existing escape key handler
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  const { selectedTranslation, setSelectedTranslation } = useTranslation();

  return (
    <nav
      ref={settingsRef}
      className={`fixed top-0 right-0 h-screen w-80 bg-gray-900 text-white transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
      aria-hidden={!isOpen}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold">Settings</h2>
        <button
          onClick={onClose}
          className="text-white focus:outline-none hover:text-teal-400 transition-colors duration-200"
          aria-label="Close settings panel"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      <div className="h-full overflow-y-auto bg-gray-900">
        <div className="p-4 space-y-6">
          {/* Display Settings Section */}
          <section>
          <div className="flex justify-between items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold mb-4">Display</h3>
            <Theme />
          </div>  
            <div className="space-y-4">
              <FontSize />
            </div>
          </section>

          {/* Language & Translation Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Translation</h3>
            <div className="space-y-4">
              <TranslationSelector />
            </div>
          </section>

          {/* Audio Settings Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Audio</h3>
            <div className="space-y-4">
              <AudioPlayerDisable />
              <RecitationList
                selectedRecitation={recitationId}
                onRecitationChange={changeRecitationId}
              />
            </div>
          </section>
        </div>
      </div>
    </nav>
  );
}

export default Settings;