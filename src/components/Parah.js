// src/components/Parah.js
import React, { useState, useEffect } from 'react';
import { axiosGet } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa"; // React Icons for Play/Pause

function Parah() {
  const [parahs, setParahs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParahs = async () => {
      try {
        const hostname = window.location.hostname;
        const apiUrl = `http://${hostname}:3001/api/parahs`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error('Error fetching Parahs');
        }

        const data = await response.json();
        setParahs(data.parahs);
        setError(null);
      } catch (error) {
        console.error('Error fetching Parahs:', error);
        setError('Failed to load Parahs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParahs();
  }, []);

  const handleParahClick = (ayahId) => {
    const [surahId] = ayahId.split(':'); // Extract surahId from ayahId
    navigate(`/surah/${surahId}#ayah-${ayahId}`); // Navigate to the specific ayah
  };

  if (isLoading) {
    return (
    <div className="flex justify-center items-center"> {/* Parent container */}
      <FaSpinner className="w-6 h-6 min-h-1px text-center animate-spin text-gray-500 dark:text-gray-400" /> 
    </div>
  )}

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {parahs.map((parah) => {
        // Extract the first 4 words of the first ayah's Arabic text
        const firstAyahText = parah.arabic_text.split(' ').slice(0, 3).join(' ');

        return (
          <div
            key={parah.parah_number}
            className="surah-box bg-white text-black rounded-3xl flex items-center p-3 shadow-md border border-gray-300 
                      hover:shadow-lg hover:scale-102 hover:bg-teal-400 hover:text-white transition-all duration-200 ease-in-out cursor-pointer"
            onClick={() => handleParahClick(parah.ayah_id)}
          >
            <div className="surah-details flex items-center w-full">
              {/* Parah Number */}
              <div
                className="surah-number bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold text-base rounded-full 
                           flex items-center justify-center w-10 h-10 mr-3 shrink-0"
              >
                {parah.parah_number}
              </div>

              {/* Parah Info */}
              <div className="surah-info flex-grow text-left flex flex-col">
                {/* Parah Title */}
                {/* <h2 className="surah-title text-lg font-semibold truncate">
                  Parah {parah.parah_number}
                </h2> */}

                {/* Starts at and Arabic Text side by side */}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs">
                    <strong>Starts at:</strong> {parah.ayah_id}
                  </span>
                  <p className="font-arabic text-lg text-gray-700 truncate text-right" dir="rtl">
                    {firstAyahText}
                  </p>
                </div>

                {/* Additional Parah Details */}
                {/* <div className="surah-info-inner grid grid-cols-2 gap-x-1 text-xs mt-1">
                  <span className="surah-start">
                    <strong>Starts at:</strong> {parah.ayah_id}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Parah;
