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
        const apiUrl = `http://${hostname}:3000/api/parahs`;
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
        const firstAyahText = parah.arabic_text.split(' ').slice(0, 4).join(' ');

        return (
          <div
            key={parah.parah_number}
            className="surah-box bg-white text-black rounded-3xl flex items-center p-4 shadow-lg border border-gray-400 
                      hover:shadow-xl hover:scale-105 hover:bg-teal-400 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleParahClick(parah.ayah_id)}
          >
            <div className="surah-details flex items-center w-full">
              {/* Parah Number */}
              <div
                className="surah-number bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold text-lg rounded-full 
                           flex items-center justify-center w-12 h-12 mr-4 shrink-0"
              >
                {parah.parah_number}
              </div>

              {/* Parah Info */}
              <div className="surah-info flex-grow text-left flex flex-col">
                {/* Parah Title */}
                <h2 className="surah-title text-l font-semibold truncate">
                  Parah {parah.parah_number}
                </h2>

                {/* First 4 Words of Arabic Text */}
                <p className="font-arabic text-2xl text-gray-700 mt-2">
                  {firstAyahText}
                </p>

                {/* Additional Parah Details */}
                <div className="surah-info-inner grid grid-cols-2 gap-x-2 gap-y-1 text-sm mt-3">
                  <span className="surah-start">
                    <strong>Starts at:</strong> {parah.ayah_id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Parah;