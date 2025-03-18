// src/components/Bookmark.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrashAlt } from "react-icons/fa"; // React Icons for delete
import 'react-toastify/dist/ReactToastify.css';

function Bookmark() {
  const [bookmarks, setBookmarks] = useState({ surahs: {}, ayahs: {} });
  const [confirmBeforeRemove, setConfirmBeforeRemove] = useState(true); // State to toggle confirmation
  const [sortOption, setSortOption] = useState('dateNewest'); // Default sorting option

  // Load bookmarks and preferences from localStorage
  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || { surahs: {}, ayahs: {} };
    setBookmarks(storedBookmarks);

    // Load the confirmation preference from localStorage (default to true)
    const storedConfirmPreference = JSON.parse(localStorage.getItem('confirmBeforeRemove'));
    setConfirmBeforeRemove(storedConfirmPreference ?? true);
  }, []);

  // Function to remove a bookmark (Surah or Ayah)
  const removeBookmark = (type, id) => {
    if (confirmBeforeRemove && !window.confirm('Are you sure you want to remove this bookmark?')) {
      return;
    }

    const updatedBookmarks = { ...bookmarks };

    if (type === 'ayah') {
      delete updatedBookmarks.ayahs[id];
      toast.info('Bookmark removed successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }

    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Function to clear all bookmarks
  const clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      localStorage.removeItem('bookmarks');
      setBookmarks({ surahs: {}, ayahs: {} });
      toast.warn('All bookmarks cleared!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  // Sort bookmarks based on the selected option
  const getSortedBookmarks = (bookmarks) => {
    const sortedAyahs = Object.entries(bookmarks.ayahs).sort((a, b) => {
      const [aSurahId] = a[0].split(':');
      const [bSurahId] = b[0].split(':');
      const aTimestamp = a[1].timestamp;
      const bTimestamp = b[1].timestamp;

      if (sortOption === 'dateNewest') {
        return bTimestamp - aTimestamp; // Newest first
      } else if (sortOption === 'dateOldest') {
        return aTimestamp - bTimestamp; // Oldest first
      } else if (sortOption === 'surahAsc') {
        return parseInt(aSurahId, 10) - parseInt(bSurahId, 10); // Surah number ascending
      } else if (sortOption === 'surahDesc') {
        return parseInt(bSurahId, 10) - parseInt(aSurahId, 10); // Surah number descending
      }

      return 0; // Default no sorting
    });

    return { ...bookmarks, ayahs: Object.fromEntries(sortedAyahs) };
  };

  const sortedBookmarks = getSortedBookmarks(bookmarks);

  // Function to toggle confirmation preference
  const toggleConfirmBeforeRemove = () => {
    const newPreference = !confirmBeforeRemove;
    setConfirmBeforeRemove(newPreference);
    localStorage.setItem('confirmBeforeRemove', JSON.stringify(newPreference)); // Save preference to localStorage
    toast.info(
      `Confirmation before removing is now ${newPreference ? 'enabled' : 'disabled'}.`,
      {
        position: 'top-right',
        autoClose: 2000,
      }
    );
  };

  return (
    <div className="container mx-auto p-4 sm:max-w-full" style={{ maxWidth: '800px' }}>
      <h1 className="text-2xl pb-2">Bookmarks</h1>
      <ToastContainer /> {/* ToastContainer for notifications */}

      {/* Toggle Confirmation */}
      <div className="flex items-center mb-4 pb-4">
        <label className="text-lg font-medium mr-4">
          Confirm Before Removing:
        </label>
        <button
          onClick={toggleConfirmBeforeRemove}
          className={`px-4 py-2 rounded-3xl ${
            confirmBeforeRemove ? 'bg-teal-400 text-black' : 'bg-red-500 text-black'
          }`}
        >
          {confirmBeforeRemove ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Sorting Options */}
      <div className="flex justify-between items-center mb-4">
        <label htmlFor="sort" className="font-medium">
          Sort By:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-400 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-3xl focus:outline-none"
        >
          <option value="dateNewest">Date Added (Newest)</option>
          <option value="dateOldest">Date Added (Oldest)</option>
          <option value="surahAsc">Surah (Ascending)</option>
          <option value="surahDesc">Surah (Descending)</option>
        </select>
      </div>

      {/* Ayahs Bookmarks Section */}
      <div className="ayahs-bookmarks">
        <h2 className="text-lg font-bold mb-4">Ayah Bookmarks</h2>
        <ul>
          {Object.entries(sortedBookmarks.ayahs).map(([ayahKey, ayahData]) => {
            const [surahId, ayahNumber, timestamp] = ayahKey.split(':');
            const formattedDate = new Date(ayahData.timestamp).toLocaleString();

            return (
              <li key={ayahKey} className="flex justify-between items-center mb-2">
                <div>
                  <Link
                    to={`/surah/${surahId}#ayah-${ayahKey}`}
                    className="text-blue-600 dark:text-teal-400 hover:underline"
                  >
                    Surah {surahId}, Ayah {ayahNumber}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Added: {formattedDate}</p>
                </div>
                <button
                  onClick={() => removeBookmark('ayah', ayahKey)}
                  className="text-red-500 hover:text-red-700"
                >
                   <FaTrashAlt className="w-6 h-6" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* No bookmarks message */}
      {Object.keys(bookmarks.surahs).length === 0 &&
        Object.keys(bookmarks.ayahs).length === 0 && (
          <p className="text-gray-500 text-center mt-8">No bookmarks found.</p>
        )}

      {/* Clear All Bookmarks Button */}
      {Object.keys(bookmarks.surahs).length > 0 || Object.keys(bookmarks.ayahs).length > 0 ? (
        <button
          onClick={clearAllBookmarks}
          className="bg-red-500 hover:bg-red-700 text-black font-bold w-full py-2 px-4 rounded-3xl mt-10"
        >
          Clear All Bookmarks
        </button>
      ) : null}
    </div>
  );
}

export default Bookmark;
