//src/component/SurahTrPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();
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
        // Check if parahs data is cached
        const cachedParahs = localStorage.getItem('parahsData');
        if (cachedParahs) {
          setParahs(JSON.parse(cachedParahs));
        } else {
          const response = await axiosGet('/api/parahs');
          setParahs(response.parahs);

          // Cache the parahs data
          localStorage.setItem('parahsData', JSON.stringify(response.parahs));
        }
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

  // Handle Ruku selection - updated to jump immediately
  const handleRukuChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedRuku(selectedValue);
    
    if (!selectedValue) return;

    // Find the first Ayah of the selected Ruku
    const selectedRukuData = rukus.find(r => r.ruku_number == selectedValue);
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

  // Add state for tab switching loading
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  
  const handleTabChange = (tab) => {
    // Determine the direction based on which tab we're switching to
    const direction = activeTab === 'translation' ? 'slide-left' : 'slide-right';
    setTabTransition(direction);
    
    // Also animate the button
    setButtonAnimation(direction);
    
    // Set tab switching loading state to true
    setIsTabSwitching(true);
    
    setTimeout(() => {
      // Toggle between 'translation' and 'arabic'
      const newTab = activeTab === 'translation' ? 'arabic' : 'translation';
      setActiveTab(newTab);
      localStorage.setItem('activeTab', newTab);
      
      // Reset the transition after the content has changed
      setTimeout(() => {
        setTabTransition('');
        setButtonAnimation('');
        // Set tab switching loading state to false after content has loaded
        setIsTabSwitching(false);
      }, 50);
    }, 300); // Wait for the exit animation to complete
  };

  // Add state for button animation
  const [buttonAnimation, setButtonAnimation] = useState('');

  // Effect for handling scroll and initial state based on hash
  useEffect(() => {
    // Function to calculate and set the current info based on a target element or scroll position
    const calculateCurrentInfo = (targetElementId = null) => {
      if (!data?.ayahs || !rukus.length) {
        // Don't calculate if data isn't ready
        return; 
      }

      let currentAyahElem = null;
      
      // --- Prioritize Hash ---
      if (targetElementId) {
        currentAyahElem = document.getElementById(targetElementId);
      }
      
      // --- Fallback to Scroll Position ---
      if (!currentAyahElem) {
        // Find the topmost visible Ayah based on scroll position (existing logic)
        const ayahElements = document.querySelectorAll('[id^="ayah-"]');
        const viewportTop = 80; // Adjust offset as needed (consider sticky header height)

        for (let i = 0; i < ayahElements.length; i++) {
          const rect = ayahElements[i].getBoundingClientRect();
          // Check if the top of the element is at or above the viewportTop threshold
          if (rect.top >= viewportTop) {
            currentAyahElem = ayahElements[i];
            break; // Found the first visible Ayah from the top
          }
          // If it's the last element and still above the threshold, use it
          if (i === ayahElements.length - 1 && rect.top < viewportTop && rect.bottom > viewportTop) {
             currentAyahElem = ayahElements[i];
          }
        }
         // If no element is found below the threshold (scrolled past the last one), use the last one
         if (!currentAyahElem && ayahElements.length > 0) {
            currentAyahElem = ayahElements[ayahElements.length - 1];
         }
      }

      // --- Update State based on found element ---
      if (currentAyahElem) {
        const ayahId = currentAyahElem.id.split('-')[1];
        const ayahNumber = data.ayahs.find(a => a.ayah_id === parseInt(ayahId))?.ayah_number;
        
        if (ayahNumber) {
          setCurrentAyah(ayahNumber); // Update Ayah number state

          // Find corresponding Ruku and Parah (existing logic)
          const currentRuku = rukus.find(ruku => 
            ayahNumber >= parseInt(ruku.start_ayah.split(':')[1]) && 
            ayahNumber <= parseInt(ruku.end_ayah.split(':')[1])
          );
          setSelectedRuku(currentRuku?.ruku_number || selectedRuku); // Keep previous if not found

          const currentAyahData = data.ayahs.find(a => a.ayah_number === ayahNumber);
          setShowInfoBar(true); // Keep previous if not found
        }
      }
    };

    // --- Initial Calculation ---
    // Check if data is loaded before attempting initial calculation
    if (data?.ayahs && rukus.length > 0) {
        // Extract target Ayah ID from URL hash if present
        const targetAyahId = location.hash.startsWith('#ayah-') ? location.hash.substring(1) : null;
        
        // Use a small delay to allow the browser to scroll to the hash first
        const timer = setTimeout(() => {
            calculateCurrentInfo(targetAyahId); 
        }, 150); // Adjust delay if needed

        // Cleanup timer if component unmounts or dependencies change before timeout
        // return () => clearTimeout(timer); // See note below
    }


    // --- Scroll Event Listener ---
    const handleScroll = () => {
      // Use the same calculation logic, but without prioritizing hash (rely on scroll pos)
      calculateCurrentInfo(); 
    };

    // Debounce handleScroll for performance
    const debouncedScrollHandler = debounce(handleScroll, 50); // Adjust debounce delay (e.g., 50ms)

    window.addEventListener('scroll', debouncedScrollHandler);

    // Cleanup function
    return () => {
      // clearTimeout(timer); // Clear timeout if effect re-runs before it fires
      window.removeEventListener('scroll', debouncedScrollHandler);
    };

  // Dependencies: Recalculate when data, rukus, location hash, or surahId changes
  }, [data, rukus, location.hash, surahId, selectedRuku]); // Added current numbers to deps to avoid stale closures in calculation


  // Simple debounce function (or use lodash/underscore)
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

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
      {/* Add CSS for slide transitions */}
      <style jsx>{`
        .slide-left {
          animation: slideLeft 0.2s forwards;
        }
        .slide-right {
          animation: slideRight 0.2s forwards;
        }
        @keyframes slideLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-10%); opacity: 0; }
        }
        @keyframes slideRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(10%); opacity: 0; }
        }
        .tab-content {
          position: relative;
          overflow: hidden;
        }
        
        /* Button animations */
        .button-slide-left {
          animation: buttonSlideLeft 0.3s forwards;
        }
        .button-slide-right {
          animation: buttonSlideRight 0.3s forwards;
        }
        @keyframes buttonSlideLeft {
          0% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        @keyframes buttonSlideRight {
          0% { transform: translateX(0); }
          50% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      
      {activeTab === 'translation' && showInfoBar && (
        <SurahInfoBar     
          surah={data.surah} 
          currentAyahNumber={currentAyahNumber} 
          currentRukuNumber={currentRukuNumber}
          parahNumber={currentParahNumber} 
        />
      )}
      
      {/* Container for top controls - Updated for single row layout and DirectJump styling */}
      <div className="flex flex-row items-center justify-between mb-4 gap-2 text-sm">
        {/* Toggle Tab Button - Styled like DirectJump button */}
        <button
          onClick={handleTabChange}
          // Apply DirectJump button styles: rounded, padding, bg, text, hover, transition
          className={`flex-1 px-3 py-2 rounded-3xl bg-teal-600 text-white hover:bg-teal-700 transition-colors text-center ${
            buttonAnimation === 'slide-left' ? 'button-slide-left' : 
            buttonAnimation === 'slide-right' ? 'button-slide-right' : ''
          }`}
        >
          {activeTab === 'translation' ? 'Arabic' : 'Translate'} {/* Shortened text */}
        </button>

        {/* Go to Ayah Button - Styled like DirectJump button/select */}
        <button
          onClick={() => setIsNavigateOpen(!isNavigateOpen)}
          // Apply DirectJump styles: rounded, padding, border. Conditional bg/text for active state.
          className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-3xl border transition-colors ${
            isNavigateOpen 
              ? 'bg-teal-600 text-white border-teal-600' // Active state like Jump button
              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600' // Inactive state like selects
          }`}
        >
          <FaChevronDown className={`h-4 w-4 transition-transform ${isNavigateOpen ? 'rotate-180' : ''}`} />
          <span>Go To</span> {/* Shortened text */}
        </button>

        {/* Ruku Dropdown - Styled exactly like the "Go To Ayah" button (inactive state) */}
        <div className="relative flex-1"> {/* Wrapper remains for positioning */}
          {/* Apply button styles to the container div */}
          <div className={`flex items-center justify-center gap-1 px-3 py-2 rounded-3xl border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer`}>
            {/* Icon */}
            <FaChevronDown className="h-4 w-4" />
            {/* Select element - made transparent and overlaid */}
            <select
              id="ruku-select"
              onChange={handleRukuChange}
              value={selectedRuku || ""}
              // Make select transparent, cover the container, keep functionality
              className="absolute inset-0 w-full h-full opacity-0 dark:bg-gray-700 cursor-pointer"
            >
              <option value="" disabled>Select Ruku</option> {/* Hidden, but needed for value */}
              {rukus.map(ruku => (
                <option key={ruku.ruku_number} value={ruku.ruku_number}>
                  {/* Display text is now handled by the container, but options needed */}
                  Ruku {ruku.ruku_number} ({ruku.start_ayah.split(':')[1]}-{ruku.end_ayah.split(':')[1]})
                </option>
              ))}
            </select>
            {/* Display Text - shows "Ruku" or selected Ruku */}
            <span className="flex-1 text-center">
              {selectedRuku 
                ? `Ruku ${selectedRuku}` 
                : 'Ruku'}
            </span>
          </div>
        </div>
      </div>
          
      {/* Navigation Panel (Direct Jump) - Appears below the buttons */}
      {isNavigateOpen && (
        <div className="mb-4"> {/* Adjusted margin */}
          <DirectJump 
            isCollapsed={!isNavigateOpen}
            setIsCollapsed={setIsNavigateOpen}
          />
        </div>
      )}

      {/* Tab Content with slide transition and loading spinner */}
      <div className={`tab-content ${tabTransition}`}>
        {isTabSwitching ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : activeTab === 'translation' ? (
          <>
            {/* <NextPrev /> */}
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
              {/* <NextPrev /> */}
            </div>
          </>
        ) : (
          <ArabicReading 
            selectedRuku={selectedRuku}
            rukus={rukus}
            preloadedContent={data}
            isPreloading={isLoading}
            surahId={surahId}
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
        enabled={isStickyNavEnabled}
        rukus={rukus}
      />
    </div>
  );
}

export default SurahTrPage;