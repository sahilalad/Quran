// src/components/NextPrev.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"; // React Icons

function NextPrev() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const pathParts = location.pathname.split('/'); // Split the path into parts
    const currentSurahId = parseInt(pathParts[pathParts.length - 1], 10); // Extract the surahId

    const [isVisible, setIsVisible] = useState(true); // Track visibility state
    const SCROLL_THRESHOLD = 50; // Threshold for hiding/showing buttons

    // Check if "Previous" and "Next" buttons should be disabled
    const isFirstSurah = currentSurahId === 1;
    const isLastSurah = currentSurahId === 114;

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
                // Scrolling down and beyond top 50px, hide NextPrev
                setIsVisible(true);
            } else {
                // Scrolling up or near the top, show NextPrev
                setIsVisible(true);
            }

            lastScrollY = currentScrollY;
        };

        // Debounce to improve performance
        const debounceScroll = () => {
            clearTimeout(window.scrollTimeout);
            window.scrollTimeout = setTimeout(handleScroll, 100); // Debounce time: 100ms
        };

        window.addEventListener('scroll', debounceScroll);

        return () => {
            window.removeEventListener('scroll', debounceScroll);
        };
    }, []);

    const handleNavigation = (direction) => {
        const newSurahId = direction === 'prev' ? currentSurahId - 1 : currentSurahId + 1;
        const path = location.pathname.startsWith('/surah') ? 'surah' : 'arabicreading';
        navigate(`/${path}/${newSurahId}`);
        
        // Scroll to the top of the page after navigation
        window.scrollTo(0, 0);
    };

    // Handle keyboard navigation
    const handleKeyDown = (event, direction) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleNavigation(direction);
        }
    };

    return (
        <div
            className={`mb-2 flex justify-between items-center my-6 transition-opacity duration-300 text-sm ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
                {/* Next Button */}
                <button
                onClick={() => handleNavigation('next')}
                onKeyDown={(e) => handleKeyDown(e, 'next')}
                disabled={isLastSurah}
                aria-label="Go to next Surah"
                className={`flex items-center px-4 py-2 rounded-3xl transition-colors ${
                    isLastSurah
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
            >
            <FaArrowLeft className="h-5 w-5 mr-1" />
                Next
            </button>

            {/* Previous Button */}
            <button
                onClick={() => handleNavigation('prev')}
                onKeyDown={(e) => handleKeyDown(e, 'prev')}
                disabled={isFirstSurah}
                aria-label="Go to previous Surah"
                className={`flex items-center px-4 py-2 rounded-3xl transition-colors ${
                    isFirstSurah
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
            >
                Previous
                <FaArrowRight className="h-5 w-5 ml-2" />
            </button>

        </div>
    );
}

export default NextPrev;