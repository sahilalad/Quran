// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { axiosGet } from '../utils/api';
import HomeSurahBox from './HomeSurahBox';
import Parah from './Parah';
import Sajda from './Sajda'; // Import the Sajda component
import { FaSpinner } from "react-icons/fa"; // React Icons for Play/Pause
import LastReadPosition from './LastReadPosition'; // Import the LastReadPosition component
import Suggestions from './Suggestions'; // Import the Suggestions component
import { useNavigate } from 'react-router-dom'; // For navigation

function Home() {
  console.log('Home component rendered');
  const [surahs, setSurahs] = useState([]);
  const [surahBookmarks, setSurahBookmarks] = useState(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || { surahs: {}, ayahs: {} };
    return storedBookmarks.surahs;
  });
  const [activeTab, setActiveTab] = useState('surah'); // Default to 'surah' tab
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await axiosGet('/surahs');
        setSurahs(data.surahs);
        console.log('Fetched Surahs:', data.surahs);
        setError(null); // Clear error state if successful
      } catch (error) {
        console.error('Error fetching Surahs:', error);
        setError('Failed to load Surahs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSurahClick = (surahId) => {
    navigate(`/surah/${surahId}`);
  };

  return (
    <div className="container mx-auto p-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Quran</h1>

      {/* Suggestions */}
      <Suggestions onSurahClick={handleSurahClick} />

      {/* Last Read Position */}
      <LastReadPosition variant="compact" />

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`py-2 px-4 rounded-3xl font-bold ${
            activeTab === 'surah' ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' : 'bg-teal-500 text-white hover:bg-teal-700'
          }`}
          onClick={() => handleTabClick('surah')}
        >
          Surah
        </button>
        <button
          className={`py-2 px-4 rounded-3xl font-bold ${
            activeTab === 'parah' ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' : 'bg-teal-500 text-white hover:bg-teal-700'
          }`}
          onClick={() => handleTabClick('parah')}
        >
          Parah
        </button>
        <button
          className={`py-2 px-4 rounded-3xl font-bold ${
            activeTab === 'sajda' ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' : 'bg-teal-500 text-white hover:bg-teal-700'
          }`}
          onClick={() => handleTabClick('sajda')}
        >
          Sajda
        </button>
      </div>

      {/* Content Based on Active Tab */}
      {isLoading ? (
        <div className="flex justify-center items-center">  {/* Parent container */}
          <FaSpinner className="w-6 h-6 min-h-1px text-center animate-spin text-gray-500 dark:text-gray-400" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          {activeTab === 'surah' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {surahs.map((surah) => (
                <HomeSurahBox key={surah.surah_id} surah={surah} />
              ))}
            </div>
          )}

          {activeTab === 'parah' && <Parah />}

          {activeTab === 'sajda' && <Sajda />}
        </>
      )}
    </div>
  );
}

export default Home;