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
import { useAudioContext } from '../contexts/AudioContext';
import { useReadingProgress } from '../contexts/ReadingProgressContext';
import LoadingSpinner from './loading'; // Loading component
import { trackSurahVisit } from '../components/stats/Activity';

function SurahTrPage() {
  const { surahId } = useParams();
  const [data, setData] = useState({ surah: null, ayahs: [] });
  const [rukus, setRukus] = useState([]);
  const [selectedRuku, setSelectedRuku] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedAyah, setHighlightedAyah] = useState(null);
  const ayahRefs = useRef({});
  const { isAudioPlayerDisabled, setIsAudioPlayerDisabled } = useAudioContext();
  const { updateProgress } = useReadingProgress();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('activeTab') || 'translation'
  );
  const [tabTransition, setTabTransition] = useState('fade-in');
  const [isNavigateOpen, setIsNavigateOpen] = useState(false);

    // Track surah visit
    useEffect(() => {
      trackSurahVisit(surahId); // Track the visit
    }, [surahId]);

  const tabs = ['translation', 'arabic only'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch surah data
        const surahData = await axiosGet(`/surah/${surahId}`);
        console.log('Surah Data:', surahData);

        // Fetch ruku information
        const rukuData = await axiosGet(`/surah-rukus?surah=${surahId}`);
        console.log('Ruku Data:', rukuData);

        setData({ surah: surahData.surah, ayahs: surahData.ayahs });
        setRukus(rukuData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [surahId]);

  useEffect(() => {
    if (data.surah) {
      document.title = `${data.surah.name_english} - ${
        activeTab === 'translation' ? 'Translation' : 'Arabic'
      }`;
    }
  }, [data.surah, activeTab]);

  // Handle Ruku selection
  const handleRukuChange = (event) => {
    setSelectedRuku(event.target.value);
  };

// Handle Go button click
const handleGoButtonClick = () => {
  if (!selectedRuku) return;

  // Find the first Ayah of the selected Ruku
  const selectedRukuData = rukus.find(r => r.ruku_number == selectedRuku);
  if (selectedRukuData) {
    const firstAyahKey = selectedRukuData.start_ayah; // e.g., "1:1"
    const ayahElement = document.getElementById(`ayah-${firstAyahKey}`);
    if (ayahElement) {
      ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight the first Ayah of the selected Ruku
      setHighlightedAyah(firstAyahKey);

      // Remove the highlight after 1 second
      setTimeout(() => setHighlightedAyah(null), 1000);
    }
  }
};

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
  }, [data.ayahs, isLoading]);

  useEffect(() => {
    if (!data.ayahs.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ayahId = entry.target.id.replace('ayah-', '');
            updateProgress(surahId, ayahId, activeTab);
          }
        });
      },
      { 
        threshold: 0.5,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    // Observe each ayah element
    Object.values(ayahRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [data.ayahs, surahId, updateProgress]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('readingProgress');
    console.log('Current reading progress:', JSON.parse(savedProgress));
  }, []);

  const handleTabChange = (tab) => {
    setTabTransition('fade-out');
    setTimeout(() => {
      setActiveTab(tab);
      localStorage.setItem('activeTab', tab);
      setTabTransition('fade-in');
    }, 300);
  };

  if (isLoading) {
    return <div className="dark:bg-gray-900 bg-white min-h-1px"> <LoadingSpinner /> </div>
  }

  if (!data.surah || !data.ayahs) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-0 sm:max-w-full" style={{ maxWidth: '800px' }}>
      {/* Tabs and Navigate button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-3xl ${
                activeTab === tab 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsNavigateOpen(!isNavigateOpen)}
          className={`flex items-center gap-1 px-4 py-2 rounded-3xl ${
            isNavigateOpen 
              ? 'bg-teal-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${isNavigateOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span>{isNavigateOpen ? 'Go to Ayah' : 'Go to Ayah'}</span>
        </button>
      </div>

      {/* Navigation Panel */}
      {isNavigateOpen && (
        <div className="mb-6">
          <DirectJump />
        </div>
      )}

      {/* Ruku Dropdown and Go Button */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1">
          <label htmlFor="ruku-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Ruku:
          </label>
          <select
            id="ruku-select"
            onChange={handleRukuChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
          >
            <option value="">Choose a Ruku</option>
            {rukus.map(ruku => (
              <option key={ruku.ruku_number} value={ruku.ruku_number}>
                Ruku {ruku.ruku_number} (Ayah {ruku.start_ayah.split(':')[1]}-{ruku.end_ayah.split(':')[1]})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGoButtonClick}
          className="mt-6 px-4 py-2 bg-teal-500 text-white rounded-3xl hover:bg-teal-600"
        >
          Go
        </button>
      </div>

      {/* Tab Content */}
      <div className={`transition-opacity duration-300 ${tabTransition}`}>
        {activeTab === 'translation' ? (
          <>
            <NextPrev />
            <SurahTrPageHeader surah={data.surah} />
            <div className="mb-20">
              {data.ayahs.map((ayah) => {
                const rukuForAyah = rukus.find(r => 
                  ayah.ayah_id === r.start_ayah || ayah.ayah_id === r.end_ayah
                );

                return (
                  <React.Fragment key={ayah.ayah_id}>
                    <div
                      id={`ayah-${ayah.ayah_id}`}
                      ref={(el) => (ayahRefs.current[ayah.ayah_id] = el)}
                      className={`p-2 ${
                        highlightedAyah === ayah.ayah_id.toString() ? 'bg-yellow-300' : ''
                      }`}
                      data-read-status="unread"
                    >
                      <Ayah ayah={ayah} surahId={data.surah.surah_id} />
                    </div>

                    {/* Add Ruku separator after last ayah of the ruku */}
                    {rukuForAyah && ayah.ayah_id === rukuForAyah.end_ayah && (
                      <RukuSeparator 
                        number={rukuForAyah.ruku_number}
                        start={rukuForAyah.start_ayah.split(':')[1]} // Extract Ayah number
                        end={rukuForAyah.end_ayah.split(':')[1]} // Extract Ayah number
                      />
                    )}
                  </React.Fragment>
                );
              })}
              <NextPrev />
            </div>
          </>
        ) : (
          <ArabicReading 
            selectedRuku={selectedRuku}
            rukus={rukus}
          />
        )}
      </div>

      {/* Settings and Audio Player */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onToggleAudio={setIsAudioPlayerDisabled}
      />
      {!isAudioPlayerDisabled && (
        <AudioPlayer key={`audio-player-${data.surah.surah_id}`} surahId={data.surah.surah_id} />
      )}
    </div>
  );
}

export default SurahTrPage;