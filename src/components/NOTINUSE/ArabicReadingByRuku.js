// src/components/ArabicReadingByRuku.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosGet } from '../utils/api';
import surahRukuMapping from './ruku/eachsurahruku';

function ArabicReadingByRuku() {
  const navigate = useNavigate(); // Used for navigation between routes
  const [surahData, setSurahData] = useState({ surah: null, ayahs: [] }); // Stores the current Surah and its Ayahs
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state for API calls
  const [error, setError] = useState(null); // Tracks any error during API calls
  const [availableSurahs, setAvailableSurahs] = useState([]); // Stores the list of available Surahs
  const [selectedSurah, setSelectedSurah] = useState('1'); // Default to Surah 1
  const [selectedRuku, setSelectedRuku] = useState('1'); // Default to Ruku 1
  const [availableRukus, setAvailableRukus] = useState([]); // Stores the list of Rukus for the selected Surah

  // Fetch the list of available Surahs when the component mounts
  useEffect(() => {
    const fetchAvailableSurahs = async () => {
      try {
        const data = await axiosGet('/surahs');
        setAvailableSurahs(data);
      } catch (error) {
        console.error('Error fetching available Surahs:', error);
      }
    };

    fetchAvailableSurahs();
  }, []);

  // Update the list of available Rukus whenever the selected Surah changes
  useEffect(() => {
    if (selectedSurah) {
      const totalRukus = surahRukuMapping[selectedSurah] || 0; // Get the total Rukus for the selected Surah
      const rukus = Array.from({ length: totalRukus }, (_, index) => ({
        number: index + 1, // Create an array of Ruku numbers
      }));
      setAvailableRukus(rukus);

      // Auto-select Ruku 1 by default, regardless of the total Rukus
      setSelectedRuku('1');
    } else {
      setAvailableRukus([]); // Clear the Rukus if no Surah is selected
    }
  }, [selectedSurah]);

  // Automatically load the default Surah and Ruku when the component mounts
  useEffect(() => {
    const loadDefaultSurahAndRuku = async () => {
      await handleGoClick();
    };

    loadDefaultSurahAndRuku(); // Automatically load Surah 1 and Ruku 1
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Handle changes in the selected Surah
  const handleSurahChange = (event) => {
    const newSurah = event.target.value; // Get the newly selected Surah
    setSelectedSurah(newSurah);

    // Determine the total number of Rukus for the selected Surah
    const totalRukus = surahRukuMapping[newSurah] || 0;

    // Auto-select Ruku 1 by default
    setSelectedRuku('1');
  };

  // Handle changes in the selected Ruku
  const handleRukuChange = (event) => {
    setSelectedRuku(event.target.value); // Update the selected Ruku
  };

  // Fetch data for the selected Surah and Ruku
  const handleGoClick = async () => {
    if (!selectedSurah || !selectedRuku) return; // Exit if no Surah or Ruku is selected

    setIsLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const data = await axiosGet(`/ruku?surah=${selectedSurah}&ruku=${selectedRuku}`); // Fetch data from the API
      if (data.length === 0) throw new Error('No data received'); // Handle empty responses

      const firstAyah = data[0]; // Get the first Ayah to extract Surah information
      setSurahData({
        surah: {
          name_english: firstAyah.surah_name_english, // English name of the Surah
          surah_id: firstAyah.surah_number, // Surah number
        },
        ayahs: data.map((ayah) => ({
          arabic_text: ayah.arabic_text, // Arabic text of the Ayah
          ayah_id: ayah.ayah_id, // Ayah ID
          isLastInRuku: ayah.isLastInRuku, // Indicates if this is the last Ayah in the Ruku
        })),
      });
    } catch (err) {
      console.error('Error fetching Surah details:', err); // Log any errors
      setError(err.message || 'Failed to fetch data'); // Set error message
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Update the document title based on the selected Surah and Ruku
  useEffect(() => {
    document.title = selectedSurah && selectedRuku
      ? `Arabic Reading - Surah ${surahData.surah?.name_english || ''}`
      : 'Arabic Reading by Ruku';
  }, [surahData.surah, selectedSurah, selectedRuku]);

  return (
    <div className="container mx-auto p-4 sm:max-600px" style={{ maxWidth: '600px' }}>
      <h2 className="text-2xl font-bold text-black mb-4">Select Surah and Ruku</h2>
      <div className="mb-4">
        {/* Dropdown for selecting a Surah */}
        <select
          className="text-lg text-gray-600 rounded-3xl mr-2"
          value={selectedSurah}
          onChange={handleSurahChange}
        >
          <option value="" disabled>Select a Surah</option>
          {Object.keys(surahRukuMapping).map((surah) => (
            <option key={surah} value={surah}>
              {surah}. Surah {surahRukuMapping[surah]}
            </option>
          ))}
        </select>
        {/* Dropdown for selecting a Ruku */}
        <select
          className="text-lg text-gray-600 rounded-3xl mr-2"
          value={selectedRuku}
          onChange={handleRukuChange}
          disabled={!availableRukus.length} // Disable if no Rukus are available
        >
          <option value="" disabled>Select a Ruku</option>
          {availableRukus.map((ruku) => (
            <option key={ruku.number} value={ruku.number}>
              Ruku {ruku.number}
            </option>
          ))}
        </select>
        {/* Button to fetch and display data for the selected Surah and Ruku */}
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl"
          onClick={handleGoClick}
          disabled={!selectedSurah || !selectedRuku} // Disable if no Surah or Ruku is selected
        >
          Go
        </button>
      </div>

      {isLoading && <div>Loading...</div>} {/* Display loading message */}
      {error && <div>Error: {error}</div>} {/* Display error message */}

      {surahData.surah && surahData.ayahs.length > 0 && (
        <div>
          {/* Display the selected Surah and its details */}
          <h2 className="text-2xl font-bold text-black">
            {surahData.surah.surah_id}
          </h2>
          <p className="text-lg text-gray-600 rounded-3xl">Surah: {selectedSurah}, Ruku: {selectedRuku}</p>
          <div id="ayahContainer" className="mt-4 p-1 border border-black text-center" dir="rtl">
            {surahData.ayahs.map((ayah) => (
              <div
                key={ayah.ayah_id}
                className="arabic-text text-3xl font-arabic inline mr-0 pr-2 pt-1 leading-9 border-b border-black text-justify"
                style={{ lineHeight: '2em', borderBottom: '1px solid black' }}
              >
                {ayah.arabic_text}
                {ayah.isLastInRuku && <hr className="my-4 border-t-2 border-gray-300" />} {/* Add a horizontal line after the last Ayah in a Ruku */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArabicReadingByRuku;
