// src/components/stats/ReadingProgressSettings.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useReadingProgress } from '../../contexts/ReadingProgressContext';

function ReadingSettings() {
  const { readingProgress, setReadingProgress } = useReadingProgress();

  const updateDailyGoal = (newGoal) => {
    setReadingProgress(prev => ({
      ...prev,
      dailyGoal: parseInt(newGoal)
    }));
  };

  return (
    <div className="bg-white mt-4 dark:bg-gray-800 rounded-3xl shadow-md p-4 mb-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Reading Settings</h2>
    
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Daily Reading Goal (Ayahs)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={readingProgress.dailyGoal}
            onChange={(e) => updateDailyGoal(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <Link 
            to="/progress" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            View Reading Progress
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReadingSettings;