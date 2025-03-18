// src/components/NavbarSurahDropdown.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosGet } from "../utils/api";
import { FaSpinner, FaChevronDown, FaArrowRight } from "react-icons/fa"; // React Icons

function NavbarSurahDropdown() {
  const navigate = useNavigate();
  const location = useLocation();
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [loading, setLoading] = useState({ surahs: true, ayahs: false });
  const [error, setError] = useState({ surahs: null, ayahs: null });

  // Fetch Surahs on mount
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const { surahs } = await axiosGet("/surahs");
        setSurahs(surahs);
        setSelectedSurah(surahs[0]);
        setError((prev) => ({ ...prev, surahs: null }));
      } catch (error) {
        console.error("Error fetching Surahs:", error);
        setError((prev) => ({ ...prev, surahs: "Failed to load Surahs. Please try again." }));
      } finally {
        setLoading((prev) => ({ ...prev, surahs: false }));
      }
    };
    fetchSurahs();
  }, []);

  // Fetch Ayahs when a Surah is selected
  useEffect(() => {
    const fetchAyahs = async () => {
      if (!selectedSurah) return;

      setLoading((prev) => ({ ...prev, ayahs: true }));
      try {
        const { ayahs } = await axiosGet(`/surah/${selectedSurah.surah_id}`);
        setAyahs(ayahs);
        setSelectedAyah(ayahs[0]?.ayah_id);
        setError((prev) => ({ ...prev, ayahs: null }));
      } catch (error) {
        console.error("Error fetching Ayahs:", error);
        setError((prev) => ({ ...prev, ayahs: "Failed to load Ayahs. Please try again." }));
      } finally {
        setLoading((prev) => ({ ...prev, ayahs: false }));
      }
    };

    fetchAyahs();
  }, [selectedSurah]);

  const handleSurahChange = (event) => {
    const surahId = event.target.value;
    const selected = surahs.find((s) => s.surah_id === parseInt(surahId, 10));
    setSelectedSurah(selected);
    setSelectedAyah(null); // Reset selected Ayah when Surah changes
  };

  const handleAyahChange = (event) => {
    setSelectedAyah(event.target.value);
  };

  const handleGo = () => {
    if (!selectedSurah || !selectedAyah) return;

    const path = location.pathname.startsWith("/surah") ? "surah" : "arabicreading";
    navigate(`/${path}/${selectedSurah.surah_id}#ayah-${selectedAyah}`);

    const highlight = () => {
      const element = document.getElementById(`ayah-${selectedAyah}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("animate-highlight");
        setTimeout(() => element.classList.remove("animate-highlight"), 2000);
      }
    };

    const waitForElement = () => {
      const element = document.getElementById(`ayah-${selectedAyah}`);
      element ? highlight() : setTimeout(waitForElement, 100);
    };

    waitForElement();
  };

  return (
    <div className="space-y-4">
      {/* Surah Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 flex items-center">
          Select Surah
          {loading.surahs && <FaSpinner className="ml-2 animate-spin text-gray-400" />}
        </label>
        <div className="relative">
          <select
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 text-white appearance-none"
            value={selectedSurah?.surah_id || ""}
            onChange={handleSurahChange}
            disabled={loading.surahs}
          >
            <option value="" disabled>
              {loading.surahs ? "Loading surahs..." : "Select Surah"}
            </option>
            {surahs.map((surah) => (
              <option key={surah.surah_id} value={surah.surah_id}>
                {surah.surah_number}. {surah.name_english}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
        {error.surahs && <p className="text-sm text-red-500">{error.surahs}</p>}
      </div>

      {/* Ayah Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 flex items-center">
          Select Ayah
          {loading.ayahs && <FaSpinner className="ml-2 animate-spin text-gray-400" />}
        </label>
        <div className="relative">
          <select
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 text-white appearance-none"
            value={selectedAyah || ""}
            onChange={handleAyahChange}
            disabled={loading.ayahs || !selectedSurah}
          >
            <option value="" disabled>
              {loading.ayahs ? "Loading ayahs..." : "Select Ayah"}
            </option>
            {ayahs.map((ayah) => (
              <option key={ayah.ayah_id} value={ayah.ayah_id}>
                Ayah {ayah.ayah_number}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
        {error.ayahs && <p className="text-sm text-red-500">{error.ayahs}</p>}
      </div>

      {/* Go Button */}
      <button
        onClick={handleGo}
        disabled={!selectedSurah || !selectedAyah}
        className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-3xl transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        Go to Selected Ayah <FaArrowRight className="ml-2" />
      </button>
    </div>
  );
}

export default NavbarSurahDropdown;
