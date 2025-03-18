// src/components/stats/Activity.js

// Track surah visits
export const trackSurahVisit = (surahId) => {
    const visitedSurahs = JSON.parse(localStorage.getItem('visitedSurahs')) || {};
  
    // Increment the visit count for the surah
    if (visitedSurahs[surahId]) {
      visitedSurahs[surahId] += 1;
    } else {
      visitedSurahs[surahId] = 1;
    }
  
    // Save back to localStorage
    localStorage.setItem('visitedSurahs', JSON.stringify(visitedSurahs));
  };
  
  // Get most visited surahs
  export const getMostVisitedSurahs = () => {
    const visitedSurahs = JSON.parse(localStorage.getItem('visitedSurahs')) || {};
  
    // Convert to an array and sort by visit count
    const sortedSurahs = Object.entries(visitedSurahs)
      .sort((a, b) => b[1] - a[1]) // Sort by visit count (descending)
      .map(([surahId]) => surahId); // Extract surah IDs
  
    return sortedSurahs.slice(0, 4); // Return top 5 most visited surahs
  };