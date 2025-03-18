// src/components/NextPrev.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function NextPrev() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const pathParts = location.pathname.split('/'); // Split the path into parts
    const currentSurahId = parseInt(pathParts[pathParts.length - 1], 10); // Extract the surahId

    const [isVisible, setIsVisible] = useState(true); // Track visibility state
    const SCROLL_THRESHOLD = 50; // Threshold for hiding/showing buttons


    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
                // Scrolling down and beyond top 50px, hide NextPrev
                setIsVisible(false);
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

    const handlePrevious = () => {
        if (location.pathname.startsWith('/surah')) {
            navigate(`/surah/${currentSurahId - 1}`);
        } else if (location.pathname.startsWith('/arabicreading')) {
            navigate(`/arabicreading/${currentSurahId - 1}`);
        }
    };

    const handleNext = () => {
        if (location.pathname.startsWith('/surah')) {
            navigate(`/surah/${currentSurahId + 1}`);
        } else if (location.pathname.startsWith('/arabicreading')) {
            navigate(`/arabicreading/${currentSurahId + 1}`);
        }
    };

    return (
        <div
            className={`mb-2 flex justify-between items-center p-2 shadow-md rounded-3xl`}
        >
            <button
                onClick={handleNext}
                disabled={currentSurahId === 114} // Disable if on the first Surah
                className="ml-0 bg-blue-400 hover:bg-blue-700 text-neutral-900 font-bold py-2 px-4 rounded-3xl"
                aria-label="Go to the next Surah"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </button>
            <button
                onClick={handlePrevious}
                disabled={currentSurahId === 1} // Disable if on the first Surah
                className="mr-0 bg-blue-400 hover:bg-blue-700 text-neutral-900 font-bold py-2 px-4 rounded-3xl"
                aria-label="Go to the previous Surah"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            </button>
        </div>
    );
}

export default NextPrev;
