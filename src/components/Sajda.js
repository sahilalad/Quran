// src/components/Sajda.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosGet } from '../utils/api';
import { FaSpinner } from "react-icons/fa"; // React Icons for LoadingSpinner

function Sajda() {
  const [sajdas, setSajdas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSajdas = async () => {
      try {
        const response = await axiosGet('/sajdas');
        setSajdas(response.sajdas);
        setError(null);
      } catch (err) {
        console.error('Error fetching Sajdas:', err);
        setError('Failed to load Sajdas. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSajdas();
  }, []);

  const handleSajdaClick = (ayahId) => {
    const [surahId, ayahNumber] = ayahId.split(':');
    navigate(`/surah/${surahId}#ayah-${ayahId}`);
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
      {sajdas.map((sajda, index) => {
        // Extract the first 4 words of the Sajda verse
        const firstFourWords = sajda.verse.split(' ').slice(0, 4).join(' ');

        return (
          <div
            key={sajda.id}
            className="surah-box bg-white text-black rounded-3xl flex items-center p-4 shadow-lg border border-gray-400 
                      hover:shadow-xl hover:scale-105 hover:bg-teal-400 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleSajdaClick(sajda.id)}
          >
            <div className="surah-details flex items-center w-full">
              {/* Sajda Number */}
              <div
                className="surah-number bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold text-lg rounded-full 
                           flex items-center justify-center w-12 h-12 mr-4 shrink-0"
              >
                {index + 1}
              </div>

              {/* Sajda Info */}
              <div className="surah-info flex-grow text-left flex flex-col">
                {/* Sajda Title */}
                <h2 className="surah-title text-l font-semibold truncate">
                  Sajda {index + 1}
                </h2>

                {/* First 4 Words of Arabic Text */}
                <p className="font-arabic text-2xl text-gray-700 mt-2" dir="rtl">
                  {firstFourWords}
                </p>

                {/* Additional Sajda Details */}
                <div className="surah-info-inner grid grid-cols-2 gap-x-2 gap-y-1 text-sm mt-3">
                  <span className="surah-start">
                    <strong>Ayah :</strong> {sajda.id}
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

export default Sajda;