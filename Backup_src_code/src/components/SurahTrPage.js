// src/components/SurahTrPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { axiosGet } from '../utils/api';
import Ayah from './Ayah';
import AudioPlayer from './AudioPlayer';
import SurahTrPageHeader from './SurahTrPageHeader';
import NextPrev from './NextPrev';
import DirectJump from './DirectJump';
import Settings from './Settings';
import ArabicReading from './ArabicReading';
import { useAudioContext } from '../context/AudioContext';

function SurahTrPage() {
  const { surahId } = useParams();
  const [surah, setSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedAyah, setHighlightedAyah] = useState(null);
  const ayahRefs = useRef({});
  const { isAudioPlayerDisabled, setIsAudioPlayerDisabled } = useAudioContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('activeTab') || 'translation'
  );
  const [tabTransition, setTabTransition] = useState('fade-in'); // For smooth transitions


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
      document.title = `${surah.name_english} - ${
        activeTab === 'translation' ? 'Translation' : 'Arabic'
      }`;
    }
  }, [surah, activeTab]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      const ayahId = hash.startsWith('ayah-') ? hash.substring(5) : hash;

      if (ayahId && !isLoading) {
        const ayahElement = ayahRefs.current[ayahId];
        if (ayahElement) {
          setHighlightedAyah(ayahId);
          ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

          setTimeout(() => setHighlightedAyah(null), 1000);
        }
      }
    };

    if (!isLoading) {
      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [ayahs, isLoading]);

  const handleTabChange = (tab) => {
    setTabTransition('fade-out'); // Add fade-out transition
    setTimeout(() => {
      setActiveTab(tab);
      localStorage.setItem('activeTab', tab);
      setTabTransition('fade-in'); // Add fade-in transition
    }, 300); // Duration matches the transition time in CSS
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!surah || !ayahs) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:max-w-full" style={{ maxWidth: '800px' }}>
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-1">
        <button
          className={`px-4 py-2 rounded-3xl ${
            activeTab === 'translation' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={() => handleTabChange('translation')}
        >
          Translation
        </button>
        <button
          className={`px-4 py-2 rounded-3xl ${
            activeTab === 'arabic' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={() => handleTabChange('arabic')}
        >
          Arabic Only
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'translation' ? (
        <>
          <DirectJump />
          <NextPrev />
          <SurahTrPageHeader surah={surah} />
          <div className="mb-20">
            {ayahs.map((ayah) => (
              <div
                key={ayah.ayah_id}
                id={`ayah-${ayah.ayah_id}`}
                ref={(el) => (ayahRefs.current[ayah.ayah_id] = el)}
                className={`p-2 ${
                  highlightedAyah === ayah.ayah_id.toString() ? 'bg-yellow-300' : ''
                }`}
              >
                <Ayah ayah={ayah} surahId={surah.surah_id} />
              </div>
            ))}
            <NextPrev />
          </div>
          <Settings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onToggleAudio={setIsAudioPlayerDisabled}
          />
          {!isAudioPlayerDisabled && (
            <AudioPlayer key={`audio-player-${surah.surah_id}`} surahId={surah.surah_id} />
          )}
        </>
      ) : (
        <ArabicReading />
      )}
    </div>
  );
}

export default SurahTrPage;
