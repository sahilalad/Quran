import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosGet } from '../utils/api';

// Custom hook to fetch Surahs
const useFetchSurahs = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      const cachedSurahs = localStorage.getItem('surahs');
      if (cachedSurahs) {
        setSurahs(JSON.parse(cachedSurahs));
        setLoading(false);
        return;
      }

      try {
        const { surahs } = await axiosGet('/surahs');
        setSurahs(surahs);
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

// Custom hook to fetch Ayahs
const useFetchAyahs = (selectedSurah) => {
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAyahs = async () => {
      if (!selectedSurah) return;

      const cachedAyahs = localStorage.getItem(`ayahs_${selectedSurah.surah_id}`);
      if (cachedAyahs) {
        setAyahs(JSON.parse(cachedAyahs));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { ayahs } = await axiosGet(`/surah/${selectedSurah.surah_id}`);
        setAyahs(ayahs);
        localStorage.setItem(`ayahs_${selectedSurah.surah_id}`, JSON.stringify(ayahs));
        setError(null);
      } catch (error) {
        console.error('Error fetching Ayahs:', error);
        setError('Failed to load Ayahs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAyahs();
  }, [selectedSurah]);

  return { ayahs, loading, error };
};

function DirectJump({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { surahs, loading: surahsLoading, error: surahsError } = useFetchSurahs();
  const [selected, setSelected] = useState({ surah: null, ayah: null });
  const { ayahs, loading: ayahsLoading, error: ayahsError } = useFetchAyahs(selected.surah);
  const containerRef = useRef(null);

  const handleSurahChange = (event) => {
    const surahId = event.target.value;
    const selectedSurah = surahs.find((s) => s.surah_id === parseInt(surahId, 10));
    setSelected({ surah: selectedSurah, ayah: null });
  };

  const handleAyahChange = (event) => {
    setSelected((prev) => ({ ...prev, ayah: event.target.value }));
  };

  const handleGo = () => {
    if (!selected.surah || !selected.ayah) return;

    const path = location.pathname.startsWith('/surah') ? 'surah' : 'arabicreading';
    navigate(`/${path}/${selected.surah.surah_id}#ayah-${selected.ayah}`);

    const highlight = () => {
      const element = document.getElementById(`ayah-${selected.ayah}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('animate-highlight');
        setTimeout(() => element.classList.remove('animate-highlight'), 2000);
      }
    };

    const waitForElement = () => {
      const element = document.getElementById(`ayah-${selected.ayah}`);
      element ? highlight() : setTimeout(waitForElement, 100);
    };

    waitForElement();
    setIsCollapsed(true);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsCollapsed(true);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mb-4 bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 `}
    >
      <div className="space-y-4">
        {/* Surah Selection */}
        <div className="space-y-2">
          <label className="block text-sm pl-2 font-medium text-gray-700 dark:text-gray-300">
            Select Surah
          </label>
          <select
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-3xl focus:ring-2 focus:ring-teal-500"
            value={selected.surah?.surah_id || ''}
            onChange={handleSurahChange}
            disabled={surahsLoading}
          >
            <option value="" disabled>
              {surahsLoading ? 'Loading surahs...' : 'Select Surah'}
            </option>
            {surahs.map((surah) => (
              <option key={surah.surah_id} value={surah.surah_id}>
                {surah.surah_number}. {surah.name_english}
              </option>
            ))}
          </select>
          {surahsError && <p className="text-sm text-red-500">{surahsError}</p>}
        </div>

        {/* Ayah Selection */}
        <div className="space-y-2">
          <label className="block text-sm pl-2 font-medium text-gray-700 dark:text-gray-300">
            Select Ayah
          </label>
          <select
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-3xl focus:ring-2 focus:ring-teal-500"
            value={selected.ayah || ''}
            onChange={handleAyahChange}
            disabled={ayahsLoading || !selected.surah}
          >
            <option value="" disabled>
              {ayahsLoading ? 'Loading ayahs...' : 'Select Ayah'}
            </option>
            {ayahs.map((ayah) => (
              <option key={ayah.ayah_id} value={ayah.ayah_id}>
                Ayah {ayah.ayah_number}
              </option>
            ))}
          </select>
          {ayahsError && <p className="text-sm text-red-500">{ayahsError}</p>}
        </div>

        {/* Jump Button */}
        <button
          onClick={handleGo}
          disabled={!selected.surah || !selected.ayah}
          className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-3xl transition-colors disabled:opacity-50"
        >
          Jump to Selected Ayah
        </button>
      </div>
    </div>
  );
}

DirectJump.propTypes = {
  surahs: PropTypes.array,
  ayahs: PropTypes.array,
  loading: PropTypes.object,
  error: PropTypes.object,
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  containerRef: PropTypes.object,
  handleSurahChange: PropTypes.func,
  handleAyahChange: PropTypes.func,
  handleGo: PropTypes.func,
  handleClickOutside: PropTypes.func,
};

export default DirectJump;