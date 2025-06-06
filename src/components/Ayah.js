import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tafsir from "./Tafsir";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "../contexts/TranslationContext";
import { useAudioContext } from "../contexts/AudioContext"; // ✅ Added for tracking currently playing Ayah
import Share from "./Share";
import AyahAudio from "./AyahAudio";
import { FaChevronCircleDown } from "react-icons/fa"; // React Icons
import { BsBookmarkCheckFill, BsBookmark } from "react-icons/bs";

// Wrap the original function component with React.memo
const Ayah = React.memo(({ ayah, surahId, nextAyah }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { ayah_id, ayah_number, arabic_text, ayah_key } = ayah; // Ensure ayah_key is destructured
    const webpageLink = window.location.href; // Current webpage URL
    const [isTafsirOpen, setIsTafsirOpen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { selectedTranslations } = useTranslation();
    const { currentlyPlayingAyah } = useAudioContext(); // ✅ Get the currently playing Ayah

    // ✅ Determine if this Ayah is currently playing
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
        setIsActive(currentlyPlayingAyah?.ayahKey === ayah_id);
    }, [currentlyPlayingAyah, ayah_id]);

    // Handle URL hash for auto-scrolling
    useEffect(() => {
        const hash = location.hash; // Get the hash from the URL (e.g., #ayah-1)
        if (hash && hash.startsWith("#ayah-")) {
            const ayahIdFromHash = hash.replace("#ayah-", "");

            // Scroll to the Ayah
            const ayahElement = document.getElementById(`ayah-${ayah_id}`);
            if (ayahElement && ayah_id === parseInt(ayahIdFromHash, 10)) {
                ayahElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                // Remove the hash from the URL after scrolling
                setTimeout(() => {
                    navigate(location.pathname, { replace: true }); // Remove the hash
                }, 1000); // Wait for the scroll to complete
            }
        }
    }, [location.hash, location.pathname, navigate, ayah_id]);

    // Handle bookmark state
    useEffect(() => {
        const storedBookmarks =
            JSON.parse(localStorage.getItem("bookmarks")) || {
                surahs: {},
                ayahs: {},
            };
        setIsBookmarked(storedBookmarks.ayahs[ayah_id] !== undefined);
    }, [ayah_id]);

    // Toggle Tafsir section
    const toggleTafsir = () => {
        setIsTafsirOpen(!isTafsirOpen);
    };

    // Handle bookmark toggle
    const handleBookmarkToggle = () => {
        const bookmarks =
            JSON.parse(localStorage.getItem("bookmarks")) || {
                surahs: {},
                ayahs: {},
            };
        const currentAyahKey = ayah_id;

        if (isBookmarked) {
            delete bookmarks.ayahs[currentAyahKey];
            toast.info(`Removed bookmark for Ayah ${ayah_id}`, {
                position: "top-right",
                autoClose: 2000,
            });
        } else {
            bookmarks.ayahs[currentAyahKey] = {
                surahId: surahId,
                ayahNumber: ayah_number,
                timestamp: Date.now(),
            };
            toast.success(`Bookmarked Ayah ${ayah_id} successfully!`, {
                position: "top-right",
                autoClose: 2000,
            });
        }

        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        setIsBookmarked(!isBookmarked);
    };

    const formatTranslationWithFootnotes = (text) => {
      return text.replace(/<sup foot_note=\"(\d+)\">(\d+)<\/sup>/g, (match, footnoteId, number) => {
          return `<sup style='color: teal; font-weight: bold;'>${number}</sup>`;
      });
    };

    return (
        <div
            className={`mb-4 p-4 rounded-3xl shadow-md transition-colors duration-0 ${
                isActive ? "bg-blue-100 dark:bg-blue-900" : "bg-white dark:bg-gray-800"
            }`}
            id={`ayah-${ayah_id}`}
        >
            <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-800 border rounded-3xl border-gray-200 dark:border-gray-800 py-2 px-4">
                <div className="text-black dark:text-white">
                    <span className="font-bold text-black dark:text-white">Ayah:</span> {ayah_number}
                </div>
                <div className="flex items-center space-x-4">
                <Share
                    ayahId={ayah_id}
                    arabicText={arabic_text}
                    translations={selectedTranslations.map((translation) => {
                        const rawTafsir = ayah[`tafsir_${translation}`] || "";
                        const formattedTafsir =
                            translation === "hindi" && typeof rawTafsir === "object"
                                ? Object.entries(rawTafsir)
                                      .map(([key, value], index) => `(${index + 1}) ${value}`)
                                      .join("\n")
                                : rawTafsir;
                        
                        return {
                            translation: ayah[`translation_${translation}`] || "",
                            tafsir: formattedTafsir,
                        };
                    })}
                    webpageLink={webpageLink}
                />

                    <AyahAudio ayahKey={ayah_id} nextAyahKey={nextAyah ? nextAyah.ayah_id : null} />
                    <button
                        className="ayah-bookmark-icon text-black dark:text-white transition-all duration-0"
                        onClick={handleBookmarkToggle}
                    >
                        {isBookmarked ? (
                            <BsBookmarkCheckFill className="w-5 h-5 text-black dark:text-gray-300" />
                        ) : (
                            <BsBookmark className="w-5 h-5 text-black dark:text-gray-300" />
                        )}
                    </button>
                </div>
            </div>

            <p
                className={`arabic-text font-arabic text-3xl text-right mt-4 mb-2 transition-all duration-0 ${
                    isActive ? "text-blue-500 dark:text-yellow-300 scale-105" : ""
                } ${ayah.sajda_word === "yes" ? "text-red-500 dark:text-red-400" : ""}`}
                dir="rtl"
                style={{ lineHeight: "1.5em" }}
            >
                {arabic_text}
            </p>

            <hr className="my-4" />

            {/* Translations with existence checks */}
            {selectedTranslations.includes("gujarati") &&
                ayah.translation_gujarati && (
                <div className="mt-4 mb-2 border-b border-gray-400 pb-4">
                    <p className="gujarati-text font-gujarati text-gray-900 text-1xl">
                        <b>ભાષાન્તર:</b> {ayah.translation_gujarati}
                    </p>
                </div> 
                )}

              {selectedTranslations.includes("as_kalam_roman") &&
                ayah.translation_as_kalam_roman && (
                  <div className="mt-4 mb-2 border-b border-gray-400 pb-4">
                  <p className="english-text text-gray-900 text-1xl">
                      <b>Tarjuma:</b> {ayah.translation_as_kalam_roman}
                  </p>
                  </div>
                )}

             {selectedTranslations.includes("english") &&
                ayah.translation_english && (
                  <div className="mt-4 mb-2 border-b border-gray-400 pb-4">
                  <p className="english-text text-gray-900 text-1xl">
                      <b>Translation:</b> {ayah.translation_english}
                  </p>
                  </div>
                )}

            {selectedTranslations.includes("urdu") && ayah.translation_urdu && (
              <div className="mt-4 mb-2 border-b border-gray-400 pb-4">
                <div className="flex flex-row-reverse space-x-4">
                    <p className="urdu-text text-gray-900 font-urdu text-2xl">
                        <b>ترجمہ:</b>
                    </p>
                    <p
                        className="urdu-text text-gray-900 font-urdu text-2xl"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(ayah.translation_urdu),
                        }}
                    />
                </div>
              </div>  
            )}

            {selectedTranslations.includes("hindi") && ayah.translation_hindi && (
              <div className="mt-4 mb-2 border-b border-gray-400 pb-4">
                <div className="flex space-x-4">
                    <p className="hindi-text font-hindi text-gray-900 text-2xl">
                        <b>अनुवाद:</b>
                    </p>
                    <p
                        className="hindi-text font-hindi text-gray-900 text-2xl"
                        dangerouslySetInnerHTML={{
                            __html:  formatTranslationWithFootnotes(DOMPurify.sanitize(ayah.translation_hindi)),
                        }}
                    />
                </div>
              </div>  
            )}

            {/* Tafsir section - only show if both translation and tafsir exist */}
            {selectedTranslations.some((translation) => {
                const translationKey = `translation_${translation}`;
                const tafsirKey = `tafsir_${translation}`;
                return!!ayah[translationKey] &&!!ayah[tafsirKey];
            }) && (
                <div>
                    <button
                        className="flex items-center justify-between w-full bg-gray-400 px-4 py-2 mt-4 rounded-3xl focus:outline-none"
                        onClick={toggleTafsir}
                    >
                        <span className="font-bold text-black">Tafsir</span>
                        <FaChevronCircleDown className={`h-6 w-6 transform transition-transform duration-0 text-black dark:text-gray-900 ${isTafsirOpen ? "rotate-180" : ""}`} />

                    </button>

                    <div className={`${isTafsirOpen? "": "hidden"} mt-2`}>
                        <Tafsir ayah={ayah} />
                    </div>
                </div>
            )}
        </div>
    );
});

// Add display name for better debugging
Ayah.displayName = 'Ayah';

export default Ayah;