//src/component/SurahTrPage.js
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
import { trackSurahVisit } from '../components/stats/Activity';
import StickyNav from './StickyNav';
import SurahInfoBar from './SurahInfoBar';
import { FaChevronDown, FaSpinner } from "react-icons/fa"; // React Icons


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
  const [currentAyah, setCurrentAyah] = useState(data.ayahs.length ? data.ayahs[0].ayah_number : null);
const [showInfoBar, setShowInfoBar] = useState(false);
const [parahs, setParahs] = useState([]);


  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('activeTab') || 'translation'
  );
  const [tabTransition, setTabTransition] = useState('fade-in');
  const [isNavigateOpen, setIsNavigateOpen] = useState(false);

    // New state to allow users to disable the sticky nav if they choose
    const [isStickyNavEnabled, setIsStickyNavEnabled] = useState(true);
    
    // Track surah visit
    useEffect(() => {
      trackSurahVisit(surahId); // Track the visit
    }, [surahId]);

  const tabs = ['translation', 'arabic only'];

  useEffect(() => {
    const handleScroll = () => {
      // Show the bar only if scrolled more than 50px from the top
      if (window.scrollY > 50) {
        setShowInfoBar(true);
      } else {
        setShowInfoBar(false);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const fetchParahs = async () => {
      try {
        const response = await axiosGet('/api/parahs');
        setParahs(response.parahs);
      } catch (error) {
        console.error('Error fetching parahs:', error);
      }
    };
    fetchParahs();
  }, []);

  // Converts an ayah id string (e.g., "2:142") into an object with numeric values.
const parseAyahId = (ayahIdStr) => {
  const [surahStr, ayahStr] = ayahIdStr.split(':');
  return {
    surah: parseInt(surahStr, 10),
    ayah: parseInt(ayahStr, 10)
  };
};

// Checks if the current ayah is greater than or equal to a boundary ayah.
const isAyahIdGreaterOrEqual = (current, boundary) => {
  if (current.surah > boundary.surah) {
    return true;
  } else if (current.surah === boundary.surah) {
    return current.ayah >= boundary.ayah;
  }
  return false;
};


  useEffect(() => {
    if (!data.ayahs.length) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ayahId = entry.target.id.replace('ayah-', '');
            setCurrentAyah(ayahId);  // Update current ayah
            updateProgress(surahId, ayahId, activeTab);
          }
        });
      },
      { 
        threshold: 0.5,
        rootMargin: '0px 0px -10% 0px'
      }
    );
  
    Object.values(ayahRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
  
    return () => observer.disconnect();
  }, [data.ayahs, surahId, updateProgress]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data is already cached
        const cachedData = localStorage.getItem(`surahData-${surahId}`);
        const cachedRukus = localStorage.getItem(`rukusData-${surahId}`);

        if (cachedData && cachedRukus) {
          setData(JSON.parse(cachedData));
          setRukus(JSON.parse(cachedRukus));
        } else {
          // Fetch surah data
          const surahData = await axiosGet(`/surah/${surahId}`);
          console.log('Surah Data:', surahData);

          // Fetch ruku information
          const rukuData = await axiosGet(`/surah-rukus?surah=${surahId}`);
          console.log('Ruku Data:', rukuData);

          setData({ surah: surahData.surah, ayahs: surahData.ayahs });
          setRukus(rukuData);

          // Cache the data
          localStorage.setItem(`surahData-${surahId}`, JSON.stringify({ surah: surahData.surah, ayahs: surahData.ayahs }));
          localStorage.setItem(`rukusData-${surahId}`, JSON.stringify(rukuData));
        }
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
    return ( 
    <div className="flex justify-center items-center">  {/* Parent container */}
    <FaSpinner className="w-6 h-6 min-h-1px text-center animate-spin text-gray-500 dark:text-gray-400" />
    </div>
  )}

  if (!data.surah || !data.ayahs) {
    return <div>Error loading data</div>;
  }

  // Find the ayah object that matches the current ayah id.
const currentAyahObj = data.ayahs.find(a => a.ayah_id.toString() === currentAyah);
const currentAyahNumber = currentAyahObj ? currentAyahObj.ayah_number : '';

// Compute current Ruku number from your rukus array.
let currentRukuNumber = '';
if (currentAyahObj && rukus.length) {
  const ayahNum = Number(currentAyahObj.ayah_number);
  const currentRuku = rukus.find(r => {
    const start = Number(r.start_ayah.split(':')[1]);
    const end = Number(r.end_ayah.split(':')[1]);
    return ayahNum >= start && ayahNum <= end;
  });
  currentRukuNumber = currentRuku ? currentRuku.ruku_number : '';
}

const currentParahNumber = currentAyahObj ? currentAyahObj.parah_number : '';


  return (
    <div className="container mx-auto p-4 mt-0 sm:max-w-full" style={{ maxWidth: '800px' }}>
          {activeTab === 'translation' && showInfoBar && (
      <SurahInfoBar     surah={data.surah} 
    currentAyahNumber={currentAyahNumber} 
    currentRukuNumber={currentRukuNumber}
    parahNumber={currentParahNumber} />
    )}
      {/* Tabs and Navigate button */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex space-x-1">
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
        <FaChevronDown className={`h-5 w-5 transition-transform ${isNavigateOpen ? 'rotate-180' : ''}`} />
          <span>{isNavigateOpen ? 'Go to Ayah' : 'Go to Ayah'}</span>
        </button>
      </div>

      {/* Navigation Panel */}
      {isNavigateOpen && (
        <div className="mb-6">
          <DirectJump isCollapsed={!isNavigateOpen} setIsCollapsed={setIsNavigateOpen} />
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
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-3xl"
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
              {data.ayahs.map((ayah, index) => {
                const nextAyah = data.ayahs[index + 1] || null; // Get the next Ayah
                const rukuForAyah = rukus.find(r => 
                  ayah.ayah_id === r.start_ayah || ayah.ayah_id === r.end_ayah
                );

                return (
                  <React.Fragment key={ayah.ayah_id}>
                    <div
                      id={`ayah-${ayah.ayah_id}`}
                      ref={(el) => (ayahRefs.current[ayah.ayah_id] = el)}
                      className={`p-1 ${
                        highlightedAyah === ayah.ayah_id.toString() ? 'bg-yellow-300' : ''
                      }`}
                      data-read-status="unread"
                    >
                      <Ayah key={ayah.ayah_id} ayah={ayah} surahId={data.surah.surah_id} nextAyah={nextAyah}/>
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
          {/* Add StickyNav below everything else */}
    <StickyNav
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      isNavigateOpen={isNavigateOpen}
      setIsNavigateOpen={setIsNavigateOpen}
      enabled={isStickyNavEnabled} // or true if you don't want to offer disabling
      rukus={rukus}  // Pass your ruku array from state
    />
    </div>
  );
}

export default SurahTrPage;