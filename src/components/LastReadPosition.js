// src/components/LastReadPosition.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useReadingProgress } from '../contexts/ReadingProgressContext';

function LastReadPosition({ variant = 'default' }) {
  const { readingProgress } = useReadingProgress();
  const { lastRead } = readingProgress;
  
  // Get the last read 13-line page from localStorage
  const lastReadPage = localStorage.getItem('currentPage');
  
  // Return null if there's no last read position (for either mode)
  if (!lastRead && !lastReadPage) return null;

  // Define styles based on the variant
  const containerStyles = variant === 'compact'
    ? "bg-white dark:bg-gray-800 rounded-3xl shadow-md p-2"
    : "bg-white dark:bg-gray-800 rounded-3xl shadow-md p-3";

  const titleStyles = variant === 'compact'
    ? "text-xs font-bold mb-1 text-gray-800 dark:text-white"
    : "text-sm font-bold mb-1 text-gray-800 dark:text-white";

  const linkStyles = variant === 'compact'
    ? "flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
    : "flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded-lg transition-colors";

  const surahNumberStyles = variant === 'compact'
    ? "bg-gradient-to-l from-blue-500 to-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
    : "bg-gradient-to-l from-blue-500 to-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm";
    
  const pageNumberStyles = variant === 'compact'
    ? "bg-gradient-to-l from-purple-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
    : "bg-gradient-to-l from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm";

  const textStyles = variant === 'compact'
    ? "text-xs text-gray-600 dark:text-gray-300"
    : "text-xs text-gray-600 dark:text-gray-300";

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {/* Surah Last Position */}
      {lastRead && (
        <div className={containerStyles}>
          <h2 className={titleStyles}>Continue Translation</h2>
          <Link
            to={`/surah/${lastRead.surahId}#ayah-${lastRead.ayahId}`}
            className={linkStyles}
          >
            <div className="flex items-center space-x-1">
              <div className={surahNumberStyles}>
                <span>{lastRead.surahId}</span>
              </div>
              <div className={textStyles}>
                <div className="text-2xs sm:text-xs">Surah {lastRead.surahId}</div>
                <div className="text-2xs sm:text-xs">Ayah {lastRead.ayahId}</div>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
      
      {/* 13-Line Last Position */}
      {lastReadPage && (
        <div className={containerStyles}>
          <h2 className={titleStyles}>Continue Page</h2>
          <Link
            to={{
              pathname: '/13linepage',
              state: { pageNumber: parseInt(lastReadPage) }
            }}
            className={linkStyles}
          >
            <div className="flex items-center space-x-1">
              <div className={pageNumberStyles}>
                <span>{lastReadPage}</span>
              </div>
              <div className={textStyles}>
                <div className="text-2xs sm:text-xs">Quran 13 Line</div>
                <div className="text-2xs sm:text-xs">Page {lastReadPage}</div>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

export default LastReadPosition;