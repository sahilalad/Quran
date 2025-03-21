// src/components/stats/ReadingProgress.js
import React, { useState, useEffect, useRef } from 'react';
import { useReadingProgress } from '../../contexts/ReadingProgressContext';
import LastReadPosition from '../LastReadPosition';
import CompletionProgress from './CompletionProgress';
import ReadingTimeStats from './ReadingTimeStats';
import PeriodicalStats from './PeriodicalStats';
import ReadingSettings from './ReadingProgressSettings';
import { useAudioContext } from '../../contexts/AudioContext';

function ReadingProgress() {
  const { readingProgress, resetProgress } = useReadingProgress();
  const { totalRead, streaks, dailyGoal } = readingProgress;
  const [showConfirm, setShowConfirm] = useState(false);
  const resetSectionRef = useRef(null);
  const { playedAyahs, totalPlaybackTime } = useAudioContext();

  const todayRead = Object.values(readingProgress.completedAyahs).filter(
    date => date === new Date().toDateString()
  ).length;

  // Calculate total loops completed
  const totalLoopsCompleted = Object.values(playedAyahs || {}).reduce(
    (total, ayah) => total + (ayah.count || 0), 0
  );

  // Total ayahs completed through audio playback
  const totalAyahsCompleted = Object.keys(playedAyahs || {}).length;

  const handleReset = () => {
    if (showConfirm) {
      resetProgress();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  useEffect(() => {
    if (showConfirm && resetSectionRef.current) {
      resetSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showConfirm]);

  // Format the total playback time in hours and minutes
  const formatPlaybackTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Reading Progress</h1>
      <LastReadPosition />
      
      {/* Main Stats Grid */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Reading Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Today's Progress */}
            <div className="stat-card bg-blue-50 dark:bg-gray-700 p-2 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300">Today's Progress</div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {todayRead}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  / {dailyGoal} ayahs
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((todayRead / dailyGoal) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Current Streak */}
            <div className="stat-card bg-green-50 dark:bg-gray-700 p-2 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300">Current Streak</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {streaks.current} days
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Longest: {streaks.longest} days
              </div>
            </div>

            {/* Total Read */}
            <div className="stat-card bg-purple-50 dark:bg-gray-700 p-2 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Read</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalRead} ayahs
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Progress
              </div>
            </div>

            {/* Audio Playback Stats - New Section */}
            <div className="stat-card bg-amber-50 dark:bg-gray-700 p-2 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300">Ayahs Listened</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {totalAyahsCompleted}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Audio engagement
              </div>
            </div>

            <div className="stat-card bg-cyan-50 dark:bg-gray-700 p-2 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300">Listening Time</div>
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {formatPlaybackTime(totalPlaybackTime || 0)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total audio played
              </div>
            </div>
            
            {/* New: Loops Completed */}
            <div className="stat-card bg-pink-50 dark:bg-gray-700 p-2 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Loops</div>
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {totalLoopsCompleted}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Repetitions completed
              </div>
            </div>

            {/* Additional Stats */}
            <CompletionProgress />
            <ReadingTimeStats />
            <PeriodicalStats />
          </div>
        </div>
      </div>

      <ReadingSettings />
      
      {/* Reset Section */}
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700" ref={resetSectionRef}>
        {showConfirm && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-center text-sm text-red-600 dark:text-red-400 font-medium mb-2">
              Are you sure you want to reset your progress?
            </p>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              This will reset all your reading progress and statistics. This action cannot be undone.
            </p>
          </div>
        )}
        
        <div className="flex justify-center items-center space-x-2">
          {showConfirm ? (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Yes, Reset Progress
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-colors"
            >
              Reset Progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReadingProgress;