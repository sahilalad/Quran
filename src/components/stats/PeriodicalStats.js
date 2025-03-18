// src/components/stats/PeriodicalStats.js
import React, { useState } from 'react';
import { useReadingProgress } from '../../contexts/ReadingProgressContext';

function PeriodicalStats() {
  const { readingProgress } = useReadingProgress();
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  const calculatePeriodStats = () => {
    const now = new Date();
    const ayahDates = Object.values(readingProgress.completedAyahs);
    
    if (viewMode === 'week') {
      // Get start of current week (Sunday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      return ayahDates.filter(date => new Date(date) >= startOfWeek).length;
    } else {
      // Get start of current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return ayahDates.filter(date => new Date(date) >= startOfMonth).length;
    }
  };

  const periodTotal = calculatePeriodStats();

  return (
    <div className="stat-card bg-cyan-50 dark:bg-gray-700 p-4 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {viewMode === 'week' ? 'This Week' : 'This Month'}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setViewMode('week')}
            className={`px-2 py-1 text-xs rounded ${
              viewMode === 'week'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-2 py-1 text-xs rounded ${
              viewMode === 'month'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
            }`}
          >
            Month
          </button>
        </div>
      </div>
      <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
        {periodTotal} ayahs
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {viewMode === 'week' 
          ? `~${Math.round(periodTotal / 7)} per day`
          : `~${Math.round(periodTotal / 30)} per day`
        }
      </div>
    </div>
  );
}

export default PeriodicalStats; 