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
      <div className="flex justify-center items-center">
        <FaSpinner className="w-6 h-6 min-h-1px text-center animate-spin text-gray-500 dark:text-gray-400" /> 
      </div>
    );
  }

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
            className="surah-box bg-white text-black rounded-3xl flex items-center p-3 shadow-md border border-gray-300 
                      hover:shadow-lg hover:scale-102 hover:bg-teal-400 hover:text-white transition-all duration-200 ease-in-out cursor-pointer"
            onClick={() => handleSajdaClick(sajda.id)}
          >
            <div className="surah-details flex items-center w-full">
              {/* Sajda Number */}
              <div
                className="surah-number bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold text-base rounded-full 
                           flex items-center justify-center w-10 h-10 mr-3 shrink-0"
              >
                {index + 1}
              </div>

              {/* Sajda Info */}
              <div className="surah-info flex-grow text-left flex flex-col">
                {/* Sajda Title
                <h2 className="surah-title text-lg font-semibold truncate">
                  Sajda {index + 1}
                </h2> */}

                {/* Ayah ID and Arabic Text side by side */}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs">
                    <strong>Ayah:</strong> {sajda.id}
                  </span>
                  <p className="font-arabic text-base text-gray-700 truncate text-right" dir="rtl">
                    {firstFourWords}
                  </p>
                </div>

                {/* Additional Sajda Details */}
                {/* <div className="surah-info-inner grid grid-cols-2 gap-x-1 text-xs mt-1">
                  <span className="surah-start">
                    <strong>Ayah:</strong> {sajda.id}
                  </span>
                  <span className="surah-number">
                    <strong>Surah:</strong> {sajda.id.split(':')[0]}
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

export default Sajda;