// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosGet } from '../utils/api'; // Import the axiosGet function
import HomeSurahBox from './HomeSurahBox'; // Import the component
{/*import HomeReading from './HomeReading'; // Import the Reading component */}

function Home() {
    console.log('Home component rendered');
  const [surahs, setSurahs] = useState([]);
  const [surahBookmarks, setSurahBookmarks] = useState({}); // State to track Surah bookmarks
  const [activeTab, setActiveTab] = useState('surah'); // State to track the active tab


  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await axiosGet('/surahs');
        setSurahs(data.surahs);
        console.log('Fetched Surahs:', data.surahs);
      } catch (error) {
        console.error('Error fetching Surahs:', error);
      }
    };

    // Fetch Surah bookmarks from localStorage
  const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || { surahs: {}, ayahs: {} };
  setSurahBookmarks(storedBookmarks.surahs);


    fetchSurahs();
  }, []);

  console.log(surahs); // Log the fetched surahs data

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto p-10 p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Quran</h1>
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl ${
            activeTab === 'surah' ? 'active' : '' // Add active class if active
          }`}
          onClick={() => handleTabClick('surah')}
        >
          Surah
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl ${
            activeTab === 'parah' ? 'active' : ''
          }`}
          onClick={() => handleTabClick('parah')}
        >
          Parah
        </button>
{/*        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl ${
            activeTab === 'reading' ? 'active' : ''
          }`}
          onClick={() => handleTabClick('reading')}
        >
          Reading
        </button>
*/}      </div>

      {/* Content based on active tab */}
      {activeTab === 'surah' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {surahs.map((surah) => (
            <HomeSurahBox key={surah.surah_id} surah={surah} />
          ))}
        </div>
      )}

{/*      {activeTab === 'reading' && <HomeReading />} {/* Render Reading component */}

      {/* You can add content for the Parah tab later */}
    </div>
  );
}


export default Home;