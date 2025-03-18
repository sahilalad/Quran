// src/components/SearchBar.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { axiosGet } from "../utils/api";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa"; // React Icons

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const normalizeText = (text) => text?.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  const fetchResults = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosGet(`/search?query=${encodeURIComponent(query)}`);
      if (response && Array.isArray(response)) {
        setResults(response);
        setIsOpen(true);
      } else {
        console.error("Unexpected API response:", response);
        setResults([]); // Ensure it doesn't break
      }
    } catch (err) {
      console.error("Search API Error:", err);
      setError("Error fetching results");
    } finally {
      setLoading(false);
    }
}, [query]);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        fetchResults();
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, fetchResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        event.target.getAttribute('data-search-toggle') !== 'true'
      ) {
        setIsSearchVisible(false);
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchResults();
    } else if (e.key === "Escape") {
      setIsSearchVisible(false);
      setIsOpen(false);
      setQuery("");
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <div className="flex items-center">
        <button
          onClick={toggleSearch}
          className="text-white hover:text-teal-400 transition-colors duration-200 p-2"
          aria-label="Toggle search"
          data-search-toggle="true"
        >
          <FaSearch className="w-6 h-6" />
        </button>
        
        <div
          className={`absolute right-0 flex items-center transition-all duration-300 ease-in-out ${
            isSearchVisible
              ? "w-72 opacity-100 translate-x-0"
              : "w-0 opacity-0 translate-x-8"
          }`}
        >
          <div className="w-full flex items-center bg-white rounded-full shadow-lg overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-2 text-black focus:outline-none"
              placeholder="Search Ayah, Translation, or Tafsir..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={clearSearch} className="p-2 text-gray-500">
            <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-72 top-full">
          <p className="text-sm text-gray-500 flex items-center">
            <FaSpinner className="animate-spin mr-2" /> Loading...
          </p>
        </div>
      )}

      {error && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-72 top-full">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {isOpen && results.length > 0 && isSearchVisible && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-72 top-full">
          <p className="px-4 py-2 text-xs text-gray-500 border-b">
            {results.length} results found
          </p>
          <ul className="max-h-96 overflow-y-auto">
            {results.map((item, index) => (
              <SearchResultItem 
                key={index} 
                item={item} 
                query={query} 
                normalizeText={normalizeText} 
              />
            ))}
          </ul>
        </div>
      )}

      {isOpen && results.length === 0 && query.length > 2 && !loading && isSearchVisible && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-72 top-full">
          <p className="text-sm text-gray-500">No results found.</p>
        </div>
      )}
    </div>
  );
};

const SearchResultItem = ({ item, query, normalizeText }) => {
  const normalizedQuery = normalizeText(query);
  const normalizedArabic = normalizeText(item.arabic_text);
  const normalizedTranslation = normalizeText(item.translation_gujarati || item.translation_english || item.translation_urdu);
  const normalizedTafsir = normalizeText(item.tafsir_gujarati || item.tafsir_english || item.tafsir_urdu);
  const isTafsir = normalizedTafsir.includes(normalizedQuery);
  const showArabic = normalizedArabic.includes(normalizedQuery);

  const highlightedTranslation = useMemo(
    () => highlightText(
      item.translation_gujarati || item.translation_english || item.translation_urdu,
      query,
      normalizeText,
      true
    ),
    [item.translation_gujarati, item.translation_english, item.translation_urdu, query, normalizeText]
  );

  const highlightedTafsir = useMemo(
    () => highlightText(
      item.tafsir_gujarati || item.tafsir_english || item.tafsir_urdu,
      query,
      normalizeText,
      true
    ),
    [item.tafsir_gujarati, item.tafsir_english, item.tafsir_urdu, query, normalizeText]
  );

  return (
    <li className="px-4 py-2 hover:bg-gray-100 transition">
      <Link to={`/surah/${item.surah_id}#ayah-${item.ayah_id}`}>
        <p className="text-xs text-gray-400">
          {item.ayah_id} {item.surah_name}
        </p>
        {showArabic && (
          <div className="font-arabic text-blue-600 text-2xl">
            {item.arabic_text}
          </div>
        )}
        <p className="text-sm text-gray-600">{highlightedTranslation}</p>
        {isTafsir && (
          <>
            <p className="text-xs text-gray-400">
              In Tafsir of {item.ayah_id} (Tafsir)
            </p>
            <p className="text-sm text-gray-500 italic">{highlightedTafsir}</p>
          </>
        )}
      </Link>
    </li>
  );
};

const highlightText = (text, highlight, normalizeText, limitText = false) => {
  if (!text) return "";
  const normalizedHighlight = normalizeText(highlight);
  const normalizedText = normalizeText(text);
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  if (limitText) {
    const index = parts.findIndex(part => normalizeText(part) === normalizedHighlight);
    if (index === -1) return text;
    const before = index > 0 ? parts[index - 1] : "";
    const after = index < parts.length - 1 ? parts[index + 1] : "";
    if (!before && !after) return text;
    return (
      <>
        {before && "... "}
        <b className="text-blue-500">{parts[index]}</b>
        {after && " ..."}
      </>
    );
  }

  return parts.map((part, index) =>
    normalizeText(part) === normalizedHighlight ? (
      <b key={index} className="text-blue-500">{part}</b>
    ) : part
  );
};

export default SearchBar;