// src/components/Bookmark.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TrashIcon from '../icon/TrashIcon.svg'; // Import the SVG icon

function Bookmark() {
  const [bookmarks, setBookmarks] = useState({ surahs: {}, ayahs: {} });

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || { surahs: {}, ayahs: {} };
    setBookmarks(storedBookmarks);
  }, []);

  // Function to remove a bookmark
  const removeBookmark = (type, id) => {
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      const updatedBookmarks = { ...bookmarks };
      if (type === 'surah') {
        delete updatedBookmarks.surahs[id];
      } else if (type === 'ayah') {
        delete updatedBookmarks.ayahs[id];
      }
      setBookmarks(updatedBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  // Function to clear all bookmarks
  const clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      localStorage.removeItem('bookmarks');
      setBookmarks({ surahs: {}, ayahs: {} });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:max-w-full" style={{ maxWidth: '800px' }}>
      <h1 className='text-2xl pb-8'>Bookmarks</h1>
      
{/*//     {/* Surahs Bookmarks Section */}
{/*//      <div className="surahs-bookmarks">
//        <h2>Surahs</h2>
//        <ul>
//          {Object.entries(bookmarks.surahs).map(([surahId, surahData]) => (
//            <li key={surahId} className="flex justify-between items-center">
//              <Link to={`/surah/${surahId}`}>
//                Surah {surahId}
//              </Link>
//              <button onClick={() => removeBookmark('surah', surahId)} className="text-red-500 hover:text-red-700">
//                Remove
//              </button>
//            </li>
//          ))}
//        </ul>
//      </div>

      {/* Ayahs Bookmarks Section */}
      <div className="ayahs-bookmarks">
        <h2></h2>
        <ul>
          {Object.entries(bookmarks.ayahs).map(([ayahKey, ayahData]) => {
            const [surahId, ayahNumber] = ayahKey.split(':');
            return (
              <li key={ayahKey} className="flex justify-between items-center mb-2">
                <Link to={`/surah/${surahId}#ayah-${ayahKey}`}>
                  Surah : {surahId}, Ayah : {ayahNumber}
                </Link>
                <button onClick={() => removeBookmark('ayah', ayahKey)} className="text-red-500 hover:text-red-700">
                  <img src={TrashIcon} alt="Remove" className="h-6 w-6 inline-block" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* No bookmarks message */}
      {Object.keys(bookmarks.surahs).length === 0 && Object.keys(bookmarks.ayahs).length === 0 && (
        <p>No bookmarks found.</p>
      )}

      {/* Clear All Bookmarks Button */}
      <button
        onClick={clearAllBookmarks}
        className="bg-red-500 hover:bg-red-700 text-black font-bold w-full py-2 px-4 rounded-3xl mt-10"
      >
        Clear All Bookmarks
      </button>
    </div>
  );
}

export default Bookmark;
