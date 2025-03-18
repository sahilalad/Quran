// src/components/ScrollToTop.js
import React, { useState, useEffect } from 'react';
import { useAudioContext } from '../contexts/AudioContext'; // Import the useAudioContext hook
import { FaArrowUp } from "react-icons/fa"; // React Icon for Up Arrow

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false); // Track button visibility
  const [scrollProgress, setScrollProgress] = useState(0); // Track scroll progress
  const { isAudioPlayerDisabled } = useAudioContext(); // Get the audio player state

  // Determine bottom offset based on audio player state.
  // When audio is enabled (i.e. isAudioPlayerDisabled is false), move the button up (bottom-20 ~80px).
  const bottomOffset = !isAudioPlayerDisabled ? '80px' : '20px';

  // Show/hide button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Calculate scroll progress
  useEffect(() => {
    const calculateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', calculateScrollProgress);
    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  };

  return (
    <>
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: bottomOffset, // Use the dynamic bottom offset
            right: '10px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `conic-gradient(#2dd4bf ${scrollProgress}%, transparent ${scrollProgress}% 100%)`,
            cursor: 'pointer',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <FaArrowUp className="h-6 w-6 text-teal-500" />
          </div>
        </div>
      )}
    </>
  );
}

export default ScrollToTop;