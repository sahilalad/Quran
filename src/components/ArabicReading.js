// src/components/ArabicReading.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { axiosGet } from '../utils/api';
import NextPrev from './NextPrev';
import AudioPlayer from './AudioPlayer';
import { useAudioContext } from '../contexts/AudioContext';
import Bismillah from '../icon/Bismillahnew';
import LoadingSpinner from './loading';

// Inline BismillahComponent definition
const BismillahComponent = () => (
  <div className="bismillah text-3xl mx-auto my-10 w-4/5" dir="rtl">
    <img 
      src={Bismillah} 
      alt="Bismillah" 
      className="mx-auto w-auto text-black dark:text-gray-700 fill-current" 
    />
  </div>
);

function ArabicReading({ selectedRuku, rukus }) {
  const { surahId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [surahData, setSurahData] = useState({ surah: null, ayahs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedAyah, setHighlightedAyah] = useState(null);
  const { isAudioPlayerDisabled } = useAudioContext();

  // Fetch surah data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const surahResponse = await axiosGet(`/surah/${surahId}`);
        setSurahData({ surah: surahResponse.surah, ayahs: surahResponse.ayahs });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [surahId]);

  // Handle Ruku selection
  useEffect(() => {
    if (selectedRuku && rukus?.length) {
      const selectedRukuData = rukus.find(r => r.ruku_number == selectedRuku);
      if (selectedRukuData) {
        const firstAyahKey = selectedRukuData.start_ayah;
        const ayahElement = document.getElementById(`ayah-${firstAyahKey}`);
        
        if (ayahElement) {
          ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedAyah(firstAyahKey);
          setTimeout(() => {
            setHighlightedAyah(null);
            navigate(location.pathname, { replace: true });
          }, 1000);
        }
      }
    }
  }, [selectedRuku, rukus, navigate, location.pathname]);

  // Handle URL hash navigation
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = location.hash;
      if (hash?.startsWith('#ayah-')) {
        const ayahId = hash.replace('#ayah-', '');
        const ayahElement = document.getElementById(`ayah-${ayahId}`);

        if (ayahElement) {
          ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedAyah(ayahId);
          setTimeout(() => {
            navigate(location.pathname, { replace: true });
            setHighlightedAyah(null);
          }, 1000);
        }
      }
    };

    if (!isLoading) {
      handleHashNavigation();
      window.addEventListener('hashchange', handleHashNavigation);
    }

    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [location, navigate, isLoading]);

  // Ruku separator component
  const RukuSeparator = ({ number, start, end }) => (
    <div className="relative py-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400">
          Ruku {number} (Ayah {start}-{end})
        </span>
      </div>
    </div>
  );

  // Group ayahs by Ruku
  const getGroupedRukus = () => {
    if (!surahData.ayahs.length || !rukus.length) return [];

    // Create a map of ayah_id to ayah for quick lookup
    const ayahMap = new Map();
    surahData.ayahs.forEach(ayah => {
      ayahMap.set(ayah.ayah_id, ayah);
    });

    return rukus.map(ruku => {
      // Parse start and end ayah numbers
      const startAyah = parseInt(ruku.start_ayah.split(':')[1]);
      const endAyah = parseInt(ruku.end_ayah.split(':')[1]);

      // Generate all ayah IDs in this ruku
      const ayahsInRuku = [];
      for (let i = startAyah; i <= endAyah; i++) {
        const ayahId = `${surahId}:${i}`;
        if (ayahMap.has(ayahId)) {
          ayahsInRuku.push(ayahMap.get(ayahId));
        }
      }

      return {
        ...ruku,
        ayahs: ayahsInRuku
      };
    });
  };

  if (isLoading) return <div className="dark:bg-gray-900 bg-white min-h-1px"> <LoadingSpinner /></div>;
  if (!surahData.surah || !surahData.ayahs) return <div>Error loading data</div>;

  const groupedRukus = getGroupedRukus();

  return (
    <div className="container mx-auto p-4 sm:max-w-full max-w-[800px]">
      <NextPrev />
      <div className="surah-header mb-5 p-2 bg-white rounded-3xl gap-4 flex flex-wrap justify-center items-center shadow-md">
        <h2 className="text-2xl font-bold text-black">
          {surahData.surah.surah_number} - {surahData.surah.name_english}
        </h2>
      </div>

      {parseInt(surahId) !== 1 && parseInt(surahId) !== 9 && (
        <div className="text-black dark:text-teal-400">
          <Bismillah className="mx-auto" />
        </div>)}

      <div id="ayahContainer" dir="rtl" className="leading-9 mt-4">
        {groupedRukus.map((ruku, index) => (
          <div 
            key={ruku.ruku_number} 
            className="ruku-container text-center border border-gray-200 dark:border-gray-700 rounded-lg p-2 mb-6"
          >
            {ruku.ayahs.map((ayah) => (
         <div
         key={ayah.ayah_id}
         id={`ayah-${ayah.ayah_id}`}
         className={`arabic-text reading-arabic-text text-3xl font-arabic inline pt-1 leading-9 text-center justify-center
           border-b border-black dark:border-gray-200
           ${highlightedAyah === ayah.ayah_id.toString() ? 'bg-yellow-300 transition-all duration-300' : ''}`}
         style={{
           lineHeight: '2em',
           paddingRight: '6px',
         }}
       >
         {ayah.arabic_text}
         <span className="ayah-end-mark"></span>
       </div>       
            ))}

            {/* Show Ruku separator at the end of every Ruku */}
            <RukuSeparator 
              number={ruku.ruku_number}
              start={ruku.start_ayah.split(':')[1]}
              end={ruku.end_ayah.split(':')[1]}
            />
          </div>
        ))}
      </div>
      
      <NextPrev />
      {!isAudioPlayerDisabled && (
        <AudioPlayer 
          key={`audio-player-${surahData.surah.surah_id}`} 
          surahId={surahData.surah.surah_id} 
        />
      )}
    </div>
  );
}

export default ArabicReading;