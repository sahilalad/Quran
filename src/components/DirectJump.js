import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosGet } from '../utils/api';
import { FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

// Custom hook to fetch Surahs (Leverages localStorage caching)
const useFetchSurahs = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      // --- Check localStorage first ---
      const cachedSurahs = localStorage.getItem('surahs'); 
      if (cachedSurahs) {
        try {
          setSurahs(JSON.parse(cachedSurahs)); // Use cached data
          setLoading(false);
          return; // <--- Exit early, no API call needed
        } catch (e) {
          console.error("Failed to parse cached surahs:", e);
          localStorage.removeItem('surahs'); // Clear invalid cache
        }
      }
      // --- End of cache check ---

      // --- Fetch from API only if cache is missing or invalid ---
      setLoading(true); 
      try {
        const { surahs } = await axiosGet('/surahs');
        setSurahs(surahs);
        // --- Store fetched data in localStorage ---
        localStorage.setItem('surahs', JSON.stringify(surahs)); 
        setError(null);
      } catch (error) {
        console.error('Error fetching Surahs:', error);
        setError('Failed to load Surahs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  return { surahs, loading, error };
};

// Custom hook to fetch Ayahs (Leverages localStorage caching and AbortController)
const useFetchAyahs = (selectedSurah) => {
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Clear previous ayahs and any lingering error immediately on effect run
    setAyahs([]); 
    setError(null); // Clear internal error state

    // Don't fetch if no surah is selected
    if (!selectedSurah) {
      setLoading(false); 
      return;
    }

    // Create an AbortController for this specific fetch
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchAyahs = async () => {
      // Error is already cleared above

      const cacheKey = `ayahs_${selectedSurah.surah_id}`;
      const cachedAyahs = localStorage.getItem(cacheKey);

      if (cachedAyahs) {
         try {
           setAyahs(JSON.parse(cachedAyahs));
           setLoading(false);
           return; // Use cached data
         } catch (e) {
           console.error(`Failed to parse cached ayahs for surah ${selectedSurah.surah_id}:`, e);
           localStorage.removeItem(cacheKey); 
         }
      }

      // Fetch from API if cache is missing or invalid
      setLoading(true);
      try {
        const { ayahs } = await axiosGet(`/surah/${selectedSurah.surah_id}`, {}, signal);
        setAyahs(ayahs);
        localStorage.setItem(cacheKey, JSON.stringify(ayahs));
        // setError(null); // Already null from the start of useEffect
      } catch (error) {
        if (error.name === 'AbortError' || axios.isCancel(error)) {
          console.log('Fetch aborted');
        } else {
          // Log the error for developers, but don't set user-facing error state
          console.error('Error fetching Ayahs:', error); 
          console.error('Detailed Fetch Error:', error.response || error.message || error);
          // --- REMOVED: setError('Failed to load Ayahs. Please try again.'); ---
          setError(error); // Optionally store the error object internally if needed elsewhere
        }
      } finally {
         if (!signal.aborted) {
             setLoading(false);
         }
      }
    };

    fetchAyahs();

    // Cleanup function: Abort the fetch if component unmounts or selectedSurah changes
    return () => {
      abortController.abort();
    };
  }, [selectedSurah]); 

  // We no longer return the user-facing error message state
  return { ayahs, loading /*, error */ }; // Remove error from return if not used by component UI
};

function DirectJump({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { surahs, loading: surahsLoading, error: surahsError } = useFetchSurahs();
  const [selected, setSelected] = useState({ surah: null, ayah: null });
  const { ayahs, loading: ayahsLoading /*, error: ayahsError */ } = useFetchAyahs(selected.surah);
  const containerRef = useRef(null);

  const handleSurahChange = (event) => {
    const surahId = event.target.value;
    const newSelectedSurah = surahs.find((s) => s.surah_id === parseInt(surahId, 10));
    setSelected({ surah: newSelectedSurah, ayah: null });
  };

  const handleAyahChange = (event) => {
    setSelected((prev) => ({ ...prev, ayah: event.target.value }));
  };

  const handleGo = () => {
    if (!selected.surah || !selected.ayah) return;

    const path = location.pathname.startsWith('/surah') ? 'surah' : 'arabicreading';
    navigate(`/${path}/${selected.surah.surah_id}#ayah-${selected.ayah}`);

    if (setIsCollapsed) {
      setIsCollapsed(false);
    }
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      if (setIsCollapsed) {
        setIsCollapsed(false);
      }
    }
  };

  useEffect(() => {
    if (!isCollapsed) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollapsed, setIsCollapsed, handleClickOutside]);

  return (
    <div
      ref={containerRef}
      className={`mb-4 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out`}
    >
      <div className="space-y-4">
        {/* Surah Selection */}
        <div className="space-y-1">
          <label htmlFor="direct-jump-surah" className="block text-sm pl-2 font-medium text-gray-700 dark:text-gray-300">
            Select Surah
          </label>
          <select
            id="direct-jump-surah"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-3xl focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
            value={selected.surah?.surah_id || ''}
            onChange={handleSurahChange}
            disabled={surahsLoading}
          >
            <option value="" disabled>
              {surahsLoading ? 'Loading surahs...' : 'Select Surah'}
            </option>
            {!surahsLoading && surahs.map((surah) => (
              <option key={surah.surah_id} value={surah.surah_id}>
                {surah.surah_number}. {surah.name_english} ({surah.total_ayahs} Ayahs)
              </option>
            ))}
          </select>
          {surahsError && <p className="text-xs text-red-500 pl-2">{surahsError}</p>}
        </div>

        {/* Ayah Selection */}
        <div className="space-y-1">
          <label htmlFor="direct-jump-ayah" className="block text-sm pl-2 font-medium text-gray-700 dark:text-gray-300">
            Select Ayah
          </label>
          <select
            id="direct-jump-ayah"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-3xl focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
            value={selected.ayah || ''}
            onChange={handleAyahChange}
            disabled={ayahsLoading || !selected.surah}
          >
            <option value="" disabled>
              {!selected.surah ? 'Select Surah first' : ayahsLoading ? 'Loading ayahs...' : 'Select Ayah'}
            </option>
            {!ayahsLoading && ayahs && ayahs.length > 0 && ayahs.map((ayah) => (
              <option key={ayah.ayah_id} value={ayah.ayah_id}>
                Ayah {ayah.ayah_number}
              </option>
            ))}
            {!ayahsLoading && (!ayahs || ayahs.length === 0) && selected.surah && (
              <option value="" disabled>No Ayahs loaded</option> 
            )}
          </select>
        </div>

        {/* Jump Button */}
        <button
          onClick={handleGo}
          disabled={!selected.surah || !selected.ayah || surahsLoading || ayahsLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-3xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Jump to Ayah</span>
          <FaArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

DirectJump.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default DirectJump;