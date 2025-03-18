// src/components/LastReadPosition.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useReadingProgress } from '../contexts/ReadingProgressContext';

function LastReadPosition({ variant = 'default' }) {
  const { readingProgress } = useReadingProgress();
  const { lastRead } = readingProgress;

  if (!lastRead) return null;

  // Define styles based on the variant
  const containerStyles = variant === 'compact'
    ? "bg-white dark:bg-gray-800 rounded-3xl shadow-md p-2 mb-4"
    : "bg-white dark:bg-gray-800 rounded-3xl shadow-md p-4 mb-4";

  const titleStyles = variant === 'compact'
    ? "text-sm font-bold mb-1 text-gray-800 dark:text-white"
    : "text-lg font-bold mb-2 text-gray-800 dark:text-white";

  const linkStyles = variant === 'compact'
    ? "flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded-lg transition-colors"
    : "flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors";

  const surahNumberStyles = variant === 'compact'
    ? "bg-gradient-to-l from-blue-500 to-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
    : "bg-gradient-to-l from-blue-500 to-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm";

  const textStyles = variant === 'compact'
    ? "text-sm text-gray-600 dark:text-gray-300"
    : "text-gray-600 dark:text-gray-300";

  return (
    <div className={containerStyles}>
      <h2 className={titleStyles}>Continue Reading</h2>
      <Link
        to={`/surah/${lastRead.surahId}#ayah-${lastRead.ayahId}`}
        className={linkStyles}
      >
        <div className="flex items-center space-x-2">
          <div className={surahNumberStyles}>
            <span>{lastRead.surahId}</span>
          </div>
          <div className={textStyles}>
            <div>Surah {lastRead.surahId}</div>
            <div className="text-xs">Ayah {lastRead.ayahId}</div>
          </div>
        </div>
        <svg
          className="w-6 h-6 text-gray-400"
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
  );
}

export default LastReadPosition;