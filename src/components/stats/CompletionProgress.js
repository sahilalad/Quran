// src/components/stats/CompletionProgress.js

import React from 'react';
import { useReadingProgress } from '../../contexts/ReadingProgressContext';

function CompletionProgress() {
  const { readingProgress } = useReadingProgress();
  const TOTAL_AYAHS = 6236; // Total number of ayahs in the Quran

  const calculateCompletion = () => {
    const completedAyahs = Object.keys(readingProgress.completedAyahs).length;
    const percentage = (completedAyahs / TOTAL_AYAHS) * 100;
    return percentage.toFixed(1);
  };

  return (
    <div className="stat-card bg-indigo-50 dark:bg-gray-700 p-2 rounded-xl">
      <div className="text-sm text-gray-600 dark:text-gray-300">Total Progress</div>
      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        {calculateCompletion()}%
      </div>
      <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${calculateCompletion()}%` }}
        />
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {Object.keys(readingProgress.completedAyahs).length} of {TOTAL_AYAHS} Ayahs
      </div>
    </div>
  );
}

export default CompletionProgress; 