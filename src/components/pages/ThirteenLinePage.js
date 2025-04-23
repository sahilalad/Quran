import React, { useState, useEffect } from 'react';
import pageData13Line from './13line.json';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import frame13Line from '../../icon/13lineframe2.png'; // Import the frame image
import { BsBookmarkCheckFill, BsBookmark } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from 'react-router-dom';

// Function to find the surah number for a given page
const findSurahNumber = (pageNumber) => {
  if (!pageData13Line || !pageData13Line.surah_p_info) return null;
  
  // Find the surah that contains this page
  for (let i = 0; i < pageData13Line.surah_p_info.length; i++) {
    const currentSurah = pageData13Line.surah_p_info[i];
    if (!currentSurah) continue;
    
    const nextSurah = pageData13Line.surah_p_info[i + 1];
    
    // If this is the last surah or the page is before the next surah's first page
    if (!nextSurah || pageNumber < nextSurah.first_page) {
      if (pageNumber >= currentSurah.first_page) {
        return currentSurah.surah_number;
      }
    }
  }
  return null;
};

// Function to find the parah number for a given page
const findParahNumber = (pageNumber) => {
  if (!pageData13Line || !pageData13Line.parah_p_info) return null;
  
  // Find the parah that contains this page
  for (const parah of pageData13Line.parah_p_info) {
    if (!parah) continue;
    if (pageNumber >= parah.start_page && pageNumber <= parah.end_page) {
      return parah.parah_number;
    }
  }
  return null;
};

// Simple mapping of surah numbers to names
const surahNames = {
  1: "الفاتحة",
  2: "البقرة",
  3: "علي عمران",
  4: "النساء",
  5: "المائدة",
  6: "الأنعام",
  7: "الأعراف",
  8: "الأنفال",
  9: "التوبة",
  10: "يونس",
  11: "هود",
  12: "يوسف",
  13: "الرعد",
  14: "إبراهيم",
  15: "الحجر",
  16: "النحل",
  17: "الإسراء",
  18: "الكهف",
  19: "مريم",
  20: "طه",
  21: "الأنبياء",
  22: "الحج",
  23: "المؤمنون",
  24: "النور",
  25: "الفرقان",
  26: "الشعراء",
  27: "النمل",
  28: "القصص",
  29: "العنكبوت",
  30: "الروم",
  31: "لقمان",
  32: "السجدة",
  33: "الأحزاب",
  34: "سبأ",
  35: "فاطر",
  36: "يس",
  37: "الصافات",
  38: "ص",
  39: "الزمر",
  40: "غافر",
  41: "فصلت",
  42: "الشورى",
  43: "الزخرف",
  44: "الدخان",
  45: "الجاثية",
  46: "الأحقاف",
  47: "محمد",
  48: "الفتح",
  49: "الحجرات",
  50: "ق",
  51: "الذاريات",
  52: "الطور",
  53: "النجم",
  54: "القمر",
  55: "الرحمن",
  56: "الواقعة",
  57: "الحديد",
  58: "المجادلة",
  59: "الحشر",
  60: "الممتحنة",
  61: "الصف",
  62: "الجمعة",
  63: "المنافقون",
  64: "التغابن",
  65: "الطلاق",
  66: "التحريم",
  67: "الملك",
  68: "القلم",
  69: "الحاقة",
  70: "المعارج",
  71: "نوح",
  72: "الجن",
  73: "المزمل",
  74: "المدثر",
  75: "القيامة",
  76: "الإنسان",
  77: "المرسلات",
  78: "النبأ",
  79: "النازعات",
  80: "عبس",
  81: "التكوير",
  82: "النفطار",
  83: "المطففين",
  84: "النشقاق",
  85: "البروج",
  86: "الطارق",
  87: "الأعلى",
  88: "الغاشية",
  89: "الفجر",
  90: "البلد",
  91: "الشمس",
  92: "الليل",
  93: "الضحى",
  94: "الشرح",
  95: "التين",
  96: "العلق",
  97: "القدر",
  98: "البينة",
  99: "الزلزلة",
  100: "العاديات",
  101: "القارعة",
  102: "التكاثر",
  103: "العصر",
  104: "الهمزة",
  105: "الفيل",
  106: "قريش",
  107: "الماعون",
  108: "الكوثر",
  109: "الكافرون",
  110: "النصر",
  111: "المسد",
  112: "الإخلاص",
  113: "الفلق",
  114: "سُوۡرَۃُ ٱلنَّاس"
};

const parahNumbers = pageData13Line.parah_p_info.map(parah => parah.parah_number);

const ThirteenLinePage = () => {
  const location = useLocation();
  const [pageData, setPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    // Check if we have a page number in the location state
    if (location.state && location.state.pageNumber) {
      return location.state.pageNumber;
    }
    
    // Otherwise get from localStorage or default to 1
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage) : 1;
  });
  const [darkMode, setDarkMode] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [isPageBookmarked, setIsPageBookmarked] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  // Add state for frame fade-in effect
  const [frameVisible, setFrameVisible] = useState(false);
  
  useEffect(() => {
    // Load the data for the current page
    if (pageData13Line && pageData13Line["13line"]) {
      // Filter data for the current page
      const filteredData = pageData13Line["13line"].filter(
        item => item.page_number === currentPage
      );
      setPageData(filteredData);
    }
  }, [currentPage]);

  useEffect(() => {
    try {
      const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {
        surahs: {},
        ayahs: {},
        pages: {}
      };
      setIsPageBookmarked(storedBookmarks.pages && storedBookmarks.pages[currentPage] !== undefined);
      
      // If page is bookmarked, load the note
      if (storedBookmarks.pages && storedBookmarks.pages[currentPage]) {
        setBookmarkNote(storedBookmarks.pages[currentPage].note || "");
      } else {
        setBookmarkNote("");
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      setIsPageBookmarked(false);
      setBookmarkNote("");
    }
  }, [currentPage]);

  // Add effect for frame fade-in
  useEffect(() => {
    if (currentPage >= 3) {
      // Start with frame hidden, then fade it in
      setFrameVisible(false);
      const timer = setTimeout(() => {
        setFrameVisible(true);
      }, 100); // Small delay before starting fade-in
      
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    const clampedPage = Math.min(Math.max(newPage, 1), 847);
    localStorage.setItem('currentPage', clampedPage);
    setCurrentPage(clampedPage);
  };

  // Updated handler with number parsing
  const handleSurahChange = (surahNumber) => {
    const num = parseInt(surahNumber, 10);
    const surahInfo = pageData13Line.surah_p_info.find(surah => surah.surah_number === num);
    if (surahInfo) {
      handlePageChange(surahInfo.first_page);
    }
  };

  // Updated handler with number parsing
  const handleParahChange = (parahNumber) => {
    const num = parseInt(parahNumber, 10);
    const parahInfo = pageData13Line.parah_p_info.find(parah => parah.parah_number === num);
    if (parahInfo) {
      handlePageChange(parahInfo.start_page);
    }
  };

  const handlePageBookmarkToggle = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {
        surahs: {},
        ayahs: {},
        pages: {}
      };
      
      if (isPageBookmarked) {
        if (bookmarks.pages) {
          delete bookmarks.pages[currentPage];
        }
        toast.info(`Removed bookmark for Page ${currentPage}`, {
          position: "top-right",
          autoClose: 2000,
        });
        setShowNoteInput(false);
      } else {
        setShowNoteInput(true);
        if (!bookmarks.pages) bookmarks.pages = {};
        
        const surahNumber = findSurahNumber(currentPage) || null;
        const parahNumber = findParahNumber(currentPage) || null;
        
        bookmarks.pages[currentPage] = {
          pageNumber: currentPage,
          surahNumber: surahNumber,
          parahNumber: parahNumber,
          timestamp: Date.now(),
          note: bookmarkNote
        };
        toast.success(`Bookmarked Page ${currentPage} successfully!`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      setIsPageBookmarked(!isPageBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to bookmark page. Please try again.");
    }
  };
  
  const saveBookmarkNote = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {
      surahs: {},
      ayahs: {},
      pages: {}
    };
    
    if (bookmarks.pages[currentPage]) {
      bookmarks.pages[currentPage].note = bookmarkNote;
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      toast.success(`Note saved for Page ${currentPage}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
    
    setShowNoteInput(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-xl min-h-[800px]">
      <div className="flex justify-between items-center mb-4">
        {/* Dropdown for Surah numbers */}
        <select 
            onChange={(e) => handleSurahChange(e.target.value)}
            className="mr-4 flex-1 bg-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">Select Surah</option>
            {pageData13Line.surah_p_info.map((surah) => (
              <option 
                key={surah.surah_number} 
                value={surah.surah_number}
                className="text-xs"
              >
                {`${surah.surah_number}: ${surahNames[surah.surah_number]} P: (${surah.first_page})`}
              </option>
            ))}
        </select>

        {/* Dropdown for Parah numbers */}
        <select 
          onChange={(e) => handleParahChange(e.target.value)}
          className="flex-1 bg-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Select Parah</option>
          {pageData13Line.parah_p_info.map((parah) => (
            <option 
              key={parah.parah_number} 
              value={parah.parah_number}
              className="text-xs"
            >
              {`Parah: ${parah.parah_number} (P: ${parah.start_page}-${parah.end_page})`}
            </option>
          ))}
        </select>
      </div>

      {/* Display current surah, page, and parah numbers */}
      <div className="flex text-sm justify-between items-center mb-4">
        <div className="font-13line direction-ltr text-right">
          {findSurahNumber(currentPage) ? 
            `${findSurahNumber(currentPage)} - ${surahNames[findSurahNumber(currentPage)]}` : 
            'N/A'}
        </div>
        <div className="flex items-center">
          <span>{currentPage}</span>
          
        </div>
        <div>Parah: {findParahNumber(currentPage)}</div>
      </div>
      
    
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md px-4 py-4 sm:p-6 mb-4 sm:mb-6 overflow-hidden relative">
        {/* Frame overlay for pages 3 and above with fade-in effect */}
        {currentPage >= 3 && (
          <img 
            src={frame13Line} 
            alt="13 Line Frame" 
            className={`absolute inset-0 w-full h-full object-contain z-0 scale-110 transform-gpu dark:brightness-0 dark:invert transition-opacity duration-500 ease-in-out ${frameVisible ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setFrameVisible(true)} // Also trigger fade-in when image loads
          />
        )}
        
        {/* Content container with higher z-index */}
        <div className={`relative z-10 ${currentPage >= 3 ? 'min-w-fit min-h-[400px] sm:min-h-[500px] md:min-h-[650px] flex flex-col' : ''}`}>
          {pageData.length > 0 ? (
            pageData.map((line) => {
              // Handle different line types
              if (line.line_type === "surah_name") {
                return (
                  <div key={line["Line Number"]} className={`mt-2 sm:mb-0 ${currentPage >= 3 ? 'sm:mt-6 mt-2' : ''}`}>
                    <h3 className="font-13line border-dashed border-4 border-teal-700 dark:border-gray-100 text-xl sm:text-1xl font-bold text-center mb-0 dark:text-teal-400">
                      {surahNames[line.surah_number] ? 
                        `${line.surah_number} : ${surahNames[line.surah_number]}` : 
                        `Surah ${line.surah_number}`}
                    </h3>
                  </div>
                );
              } else if (line.line_type === "basmallah") {
                return (
                  <div key={line["Line Number"]} className={`${currentPage >= 3 ? 'sm:mt-4 mt-3' : ''}`}>
                    <p className="font-13line border-dotted border-b-2 border-gray-900 dark:border-gray-100 text-xl sm:text-2xl text-center dark:text-teal-400">
                    ﷽
                    </p>
                  </div>
                );
              } else {
                // Regular ayah - when using frame, we position lines according to frame structure
                if (line.page_number === 819 && line["Line Number"] === 5) {
                  return (
                    <div 
                      key={line["Line Number"]} 
                      className={`flex justify-center pb-6 border-b-2 border-gray-900 dark:border-gray-100 items-center ${currentPage >= 3 ? 'h-[32px] mt-[5px] sm:h-5 md:h-6 sm:mt-4 md:mt-6' : 'border-2 border-gray-500'}`}
                    >
                      <div 
                        className={`font-13line pt-4 text-l sm:text-base md:text-2xl ${line.is_centered ? 'text-center' : 'text-right'} dark:text-teal-400`}
                        dir="rtl"
                      >
                        {line.Text}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div 
                      key={line["Line Number"]} 
                      className={`flex justify-center pb-6 border-b-2 border-gray-900 dark:border-gray-100 items-center ${currentPage >= 3 ? 'h-[32px] mt-[5px] sm:h-5 md:h-6 sm:mt-4 md:mt-6' : 'border-2 border-gray-500'}`}
                    >
                      <div 
                        className={`font-13line pt-4 text-lg sm:text-base md:text-2xl ${line.is_centered ? 'text-center' : 'text-right'} dark:text-teal-400`}
                        dir="rtl"
                      >
                        {line.Text}
                      </div>
                    </div>
                  );
                }
              }
            })
          ) : (
            <p className="text-center text-gray-500">No data available for page {currentPage}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 sm:p-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center px-2 py-1 bg-teal-500 text-white rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <FaChevronLeft className="mr-1" /> Previous
        </button>

        <div className="flex items-center">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) {
                if (value >= 1 && value <= 847) {
                  handlePageChange(value);
                } else {
                  // Just update the input field without changing the page
                  setCurrentPage(value);
                }
              }
            }}
            onBlur={(e) => {
              // When input loses focus, ensure the value is valid
              const value = parseInt(e.target.value);
              if (isNaN(value) || value < 1 || value > 847) {
                // Reset to last valid page
                setCurrentPage(parseInt(localStorage.getItem('currentPage')) || 1);
              } else {
                // Ensure the page is within valid range
                const clampedValue = Math.min(Math.max(value, 1), 847);
                handlePageChange(clampedValue);
              }
            }}
            onKeyDown={(e) => {
              // Handle Enter key
              if (e.key === 'Enter') {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  const clampedValue = Math.min(Math.max(value, 1), 847);
                  handlePageChange(clampedValue);
                  e.target.blur(); // Remove focus after Enter
                }
              }
            }}
            onWheel={(e) => {
              e.preventDefault();
              const newPage = currentPage + (e.deltaY > 0 ? 1 : -1);
              const clampedPage = Math.min(Math.max(newPage, 1), 847);
              handlePageChange(clampedPage);
            }}
            onTouchStart={(e) => {
              setTouchStart(e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              const touchEnd = e.touches[0].clientY;
              const direction = touchEnd < touchStart ? 1 : -1;
              const newPage = currentPage + direction;
              const clampedPage = Math.min(Math.max(newPage, 1), 847);
              handlePageChange(clampedPage);
            }}
            className="border border-gray-300 rounded-3xl px-2 py-1 w-20 text-center dark:bg-gray-700 dark:text-white dark:border-gray-600"
            min="1"
            max="847"
            step="1"
            inputMode="numeric"
            aria-label="Page number"
          />
        </div>

        <button
            className="ml-2 text-black dark:text-white transition-all duration-0"
            onClick={handlePageBookmarkToggle}
          >
            {isPageBookmarked ? (
              <BsBookmarkCheckFill className="w-5 h-5 text-teal-500 dark:text-teal-400" />
            ) : (
              <BsBookmark className="w-5 h-5 text-black dark:text-gray-300" />
            )}
          </button>

        {/* Note input popup for bookmarks
        {showNoteInput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium dark:text-white">Add Bookmark Note</h3>
                <button 
                  onClick={() => setShowNoteInput(false)} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>
              
              <input
                type="text"
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                placeholder="Add a Ayah Number or Page Notes (optional)"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                autoFocus
              />
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNoteInput(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBookmarkNote}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )} */}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="flex items-center px-2 py-1 bg-teal-500 text-white rounded-3xl text-sm"
        >
          Next <FaChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ThirteenLinePage;