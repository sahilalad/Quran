// src/components/DirectJump.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosGet } from '../utils/api';

function DirectJump() {
  const navigate = useNavigate();
  const location = useLocation();
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [selectedAyah, setSelectedAyah] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await axiosGet('/surahs');
        setSurahs(data.surahs);
        setSelectedSurah(data.surahs[0]); // Set the first Surah as default
      } catch (error) {
        console.error('Error fetching Surahs:', error);
      }
    };

    fetchSurahs();
  }, []);

  useEffect(() => {
    const fetchAyahs = async () => {
      if (selectedSurah) {
        try {
          const data = await axiosGet(`/surah/${selectedSurah.surah_id}`);
          setAyahs(data.ayahs);
          setSelectedAyah(data.ayahs[0].ayah_id); // Set the first Ayah as default
        } catch (error) {
          console.error('Error fetching Ayahs:', error);
        }
      }
    };

    fetchAyahs();
  }, [selectedSurah]);

  const handleSurahChange = (event) => {
    const surahId = event.target.value;
    const selected = surahs.find((surah) => surah.surah_id === parseInt(surahId, 10));
    setSelectedSurah(selected);
  };

  const handleAyahChange = (event) => {
    setSelectedAyah(event.target.value);
  };

  const handleGo = () => {
    if (selectedSurah && selectedAyah) {
      const path = location.pathname.startsWith('/surah') ? 'surah' : 'arabicreading';
      const ayahKey = `${selectedAyah}`; // Consistent key format
      navigate(`/${path}/${selectedSurah.surah_id}#ayah-${ayahKey}`);
  
      // Function to scroll and highlight the target Ayah
      const scrollAndHighlight = () => {
        const element = document.getElementById(`ayah-${ayahKey}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-yellow-300'); // Highlight the Ayah
  
          // Remove highlight after 1 second
          setTimeout(() => {
            element.classList.remove('bg-yellow-300');
          }, 1000);
        } else {
          console.error(`Ayah element not found: ayah-${ayahKey}`);
        }
      };
  
      // Function to wait for full page load
      const waitForPageLoad = () => {
        if (document.readyState === 'complete') {
          scrollAndHighlight();
        } else {
          window.addEventListener('load', scrollAndHighlight, { once: true });
        }
      };
  
      // Retry mechanism to ensure the element exists before scrolling
      const waitForElement = () => {
        const element = document.getElementById(`ayah-${ayahKey}`);
        if (element) {
          scrollAndHighlight();
        } else {
          setTimeout(waitForElement, 100); // Retry every 100ms
        }
      };
  
      // Trigger both page load and retry mechanisms
      waitForPageLoad();
      waitForElement();
    }
  };
  

  return (
    <div     
    className={`direct-jump p-4 mb-4 rounded-3xl transition-colors duration-300
        ${isDropdownOpen ? 'border-2 border-gray-300 dark:border-gray-600' : ''} 
        text-gray-900 dark:text-gray-700 relative`} > {/* Conditional border */}
    <div className="flex items-center justify-between">
    {/* Navigation button with SVG */}
    <button
        className={`bg-blue-500 hover:bg-blue-700 mb-2 text-white font-bold py-2 px-4 rounded-3xl 
                   ${isDropdownOpen ? 'border-2 border-white ' : ''}
                   dark:border-gray-100`} // Add border when active
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 inline-block mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* Conditionally render SVG based on isDropdownOpen */}
          {isDropdownOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> // Downward arrow
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /> // Forward arrow
          )}
        </svg>
        Navigate
        </button>

        {/* Conditionally render the close button */}
        {isDropdownOpen && (
          <button
            className="p-3 text-blue-550 hover:text-gray-400 ml-2" // Add margin-left for spacing
            onClick={() => setIsDropdownOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
        
      {/* Conditionally render the dropdown */}
      {isDropdownOpen && (
      <div className="flex flex-col space-y-2"> {/* Use flexbox for layout */}
        {/* Surah Dropdown */}
        <select
          className="border border-gray-400 rounded px-3 py-2 dark:text-gray-900 rounded-3xl"
          value={selectedSurah ? selectedSurah.surah_id : ''}
          onChange={handleSurahChange}
        >
          {surahs.map((surah) => (
            <option key={surah.surah_id} value={surah.surah_id}>
              {surah.surah_number}. {surah.name_english}
            </option>
          ))}
        </select>

        {/* Ayah Dropdown */}
        <select
          className="border border-gray-400 rounded px-3 py-2 dark:text-gray-900 rounded-3xl"
          value={selectedAyah || ''}
          onChange={handleAyahChange}
        >
          {ayahs.map((ayah) => (
            <option key={ayah.ayah_id} value={ayah.ayah_id}>
              Ayah: {ayah.ayah_number}
            </option>
          ))}
        </select>

        {/* Go Button */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl"
          onClick={handleGo}
            >
              Go
            </button>
          </div>
      )}
    </div>
  );
}

export default DirectJump;