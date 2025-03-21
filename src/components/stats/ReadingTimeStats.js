// src/components/stats/ReadingTimeStats.js
import React from 'react';
import { useReadingProgress } from '../../contexts/ReadingProgressContext';

function ReadingTimeStats() {
  const { readingProgress } = useReadingProgress();
  const AVERAGE_AYAH_READ_TIME = 30; // seconds

  const calculateReadingTime = () => {
    const completedAyahs = Object.keys(readingProgress.completedAyahs).length;
    const totalSeconds = completedAyahs * AVERAGE_AYAH_READ_TIME;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return {
      hours,
      minutes,
      totalTime: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    };
  };

  const estimateRemainingTime = () => {
    const remainingAyahs = 6236 - Object.keys(readingProgress.completedAyahs).length;
    const totalSeconds = remainingAyahs * AVERAGE_AYAH_READ_TIME;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const readingTime = calculateReadingTime();

  return (
    <div className="stat-card bg-rose-50 dark:bg-gray-700 p-2 rounded-xl">
      <div className="text-sm text-gray-600 dark:text-gray-300">Reading Time</div>
      <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
        {readingTime.totalTime}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Estimated Remaining: {estimateRemainingTime()}
      </div>
    </div>
  );
}

export default ReadingTimeStats; 