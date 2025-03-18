// src/contexts/ReadingProgressContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ReadingProgressContext = createContext();

const initialState = {
  lastRead: null,
  completedAyahs: {},
  totalRead: 0,
  dailyGoal: 10,
  streaks: {
    current: 0,
    longest: 0,
    lastReadDate: null
  }
};

export function ReadingProgressProvider({ children }) {
  const [readingProgress, setReadingProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('readingProgress');
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
    } catch (error) {
      console.error('Error loading reading progress:', error);
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('readingProgress', JSON.stringify(readingProgress));
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  }, [readingProgress]);

  const updateProgress = (surahId, ayahId) => {
    const today = new Date().toDateString();
    
    setReadingProgress(prev => {
      const newProgress = {
        ...prev,
        lastRead: { surahId, ayahId, timestamp: new Date().toISOString() },
        completedAyahs: {
          ...prev.completedAyahs,
          [`${surahId}:${ayahId}`]: today
        },
        totalRead: Object.keys(prev.completedAyahs).length + 1
      };

      if (prev.streaks.lastReadDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = prev.streaks.lastReadDate === yesterday.toDateString();

        newProgress.streaks = {
          current: isConsecutive ? prev.streaks.current + 1 : 1,
          longest: Math.max(prev.streaks.longest, isConsecutive ? prev.streaks.current + 1 : 1),
          lastReadDate: today
        };
      }

      return newProgress;
    });
  };

  return (
    <ReadingProgressContext.Provider value={{ readingProgress, updateProgress, setReadingProgress }}>
      {children}
    </ReadingProgressContext.Provider>
  );
}

export const useReadingProgress = () => {
  const context = useContext(ReadingProgressContext);
  if (!context) {
    throw new Error('useReadingProgress must be used within a ReadingProgressProvider');
  }
  return context;
}; 