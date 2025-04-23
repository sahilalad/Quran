// src/components/NavbarSurahDropdown.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosGet } from "../utils/api";
import { FaSpinner, FaChevronDown, FaArrowRight, FaChevronUp } from "react-icons/fa";

function NavbarSurahDropdown() {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [loading, setLoading] = useState({ surahs: true, ayahs: false });
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch Surahs on mount
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const { surahs } = await axiosGet("/surahs");
        setSurahs(surahs);
        setSelectedSurah(surahs[0]);
      } catch (error) {
        console.error("Error fetching Surahs:", error);
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
      } catch (error) {
        console.error("Error fetching Ayahs:", error);
      } finally {
        setLoading((prev) => ({ ...prev, ayahs: false }));
      }
    };
    fetchAyahs();
  }, [selectedSurah]);

  const handleGo = () => {
    if (!selectedSurah || !selectedAyah) return;
    navigate(`/surah/${selectedSurah.surah_id}#ayah-${selectedAyah}`);
    setIsExpanded(false);
  };

  return (
    <div className="space-y-2">
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-3xl transition-colors flex items-center justify-between"
      >
        <span>Go to Ayah</span>
        {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
      </button>

      {/* Dropdown Content */}
      {isExpanded && (
        <div className="mt-2 space-y-2 bg-gray-800 p-2 rounded-3xl shadow border border-gray-700 text-sm">
          {/* Surah & Ayah Selections - Changed to column layout */}
          <div className="space-y-1"> {/* Add space-y-1 for vertical spacing */}
            {/* Remove w-1/2 from the inner div */}
            <div>
              <select
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-3xl text-white text-xs"
                value={selectedSurah?.surah_id || ""}
                onChange={(e) => {
                  const surahId = e.target.value;
                  setSelectedSurah(surahs.find(s => s.surah_id === parseInt(surahId, 10)));
                }}
                disabled={loading.surahs}
              >
                {loading.surahs ? (
                  <option>Loading...</option>
                ) : (
                  surahs.map((surah) => (
                    <option key={surah.surah_id} value={surah.surah_id}>
                      {surah.surah_number}. {surah.name_english}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* Remove w-1/2 from the inner div */}
            <div>
              <select
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-3xl text-white text-xs"
                value={selectedAyah || ""}
                onChange={(e) => setSelectedAyah(e.target.value)}
                disabled={loading.ayahs || !selectedSurah}
              >
                {loading.ayahs ? (
                  <option>Loading...</option>
                ) : (
                  ayahs.map((ayah) => (
                    <option key={ayah.ayah_id} value={ayah.ayah_id}>
                      Ayah {ayah.ayah_number}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Go Button */}
          <button
            onClick={handleGo}
            disabled={!selectedSurah || !selectedAyah}
            className="w-full py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded-3xl transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            Go <FaArrowRight size={10} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}

export default NavbarSurahDropdown;
