// src/components/ArabicReading.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axiosGet } from '../utils/api';
import NextPrev from './NextPrev'; // Import the NextPrev component
import DirectJump from './DirectJump'; // Import the DirectJump component
import AudioPlayer from './AudioPlayer';
import { useAudioContext } from '../context/AudioContext'; // Import AudioContext
import Bismillah from '../icon/Bismillah.svg';

function ArabicReading() {
  const { surahId } = useParams();
  const [surah, setSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedAyah, setHighlightedAyah] = useState(null); // State to track highlighted Ayah
  const { isAudioPlayerDisabled } = useAudioContext(); // Use AudioContext for global state

  useEffect(() => {
    const fetchSurahDetails = async () => {
      try {
        const data = await axiosGet(`/surah/${surahId}`);
        setSurah(data.surah);
        setAyahs(data.ayahs);
      } catch (error) {
        console.error('Error fetching Surah details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahDetails();
  }, [surahId]);

  useEffect(() => {
    if (surah) {
      document.title = `${surah.name_english} - Arabic`;
    }
  }, [surah]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      const ayahId = hash.startsWith('ayah-') ? hash.substring(5) : hash;

      if (ayahId && !isLoading) {
        const ayahElement = document.getElementById(`ayah-${ayahId}`);
        if (ayahElement) {
          setHighlightedAyah(ayahId); // Highlight the Ayah
          ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Remove highlight after 1 second
          setTimeout(() => setHighlightedAyah(null), 1000);
        }
      }
    };

    // Trigger on hash change and after content is loaded
    if (!isLoading) {
      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [ayahs, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!surah || !ayahs) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:max-w-full" style={{ maxWidth: '800px' }}>
     <NextPrev />
      <div className="surah-header mb-5 p-5 bg-white rounded-3xl gap-4 flex flex-wrap justify-center items-center shadow-md">
        <h2 className="text-2xl font-bold text-black">
          {surah.surah_number} - {surah.name_english}
        </h2>
      </div>

      {parseInt(surahId) !== 1 && parseInt(surahId) !== 9 && (
        <div
          className="bismillah dark:bg-white rounded-3xl text-center font-arabic text-3xl mx-auto my-10 w-4/5"
          dir="rtl"
        >
              <img
                src={Bismillah}
                alt="Bismillah"
                className="mx-auto w-auto"
                style={{ fill: 'currentcolor'}}
                />
        </div>
      )}

      <div id="ayahContainer" dir="rtl" style={{ lineHeight: '3' }}>
        {ayahs.map((ayah) => (
          <div
            key={ayah.ayah_id}
            id={`ayah-${ayah.ayah_id}`} // Add ID for scrolling
            className={`arabic-text reading-arabic-text text-3xl font-arabic inline mr-1 p-1 leading-tight ${
              highlightedAyah === ayah.ayah_id.toString() ? 'bg-yellow-300' : ''
            }`}
            dir="rtl"
          >
            {ayah.arabic_text.split(' ').map((arabicWord, index) => (
              <span key={index} className="inline-block mr-2">
                {arabicWord}
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* Conditionally render the AudioPlayer */}
      {!isAudioPlayerDisabled && <AudioPlayer key={`audio-player-${surah.surah_id}`} surahId={surah.surah_id} />}
    </div>
  );
}

export default ArabicReading;
