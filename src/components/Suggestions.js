// src/components/Suggestions.js
import React, { useEffect, useState } from 'react';
import { getMostVisitedSurahs } from '../components/stats/Activity'; // Correct import path

const Suggestions = ({ onSurahClick }) => {
  const [mostVisitedSurahs, setMostVisitedSurahs] = useState([]);

  useEffect(() => {
    const surahs = getMostVisitedSurahs();
    setMostVisitedSurahs(surahs);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-0 rounded-3xl mb-4">
      <h2 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Most Visited Surahs</h2>
      <hr className="border-gray-200 dark:border-gray-600" />
      <div className="flex flex-wrap gap-2">
        {mostVisitedSurahs.map((surahId) => (
          <button
            key={surahId}
            className="bg-gray-100 dark:bg-gray-700 text-xs text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full mt-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => onSurahClick(surahId)}
          >
            Surah {surahId}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;