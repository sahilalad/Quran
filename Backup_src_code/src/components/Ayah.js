import React, { useState, useEffect } from 'react';
import Tafsir from './Tafsir';
import DOMPurify from 'dompurify';
import ExpandIcon from '../icon/ExpandIcon.svg';
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function Ayah({ ayah, ayahRef }) {
  const [state, setState] = useState({
    isTafsirOpen: false,
    isBookmarked: false,
  });

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || { surahs: {}, ayahs: {} };
    setState((prevState) => ({
      ...prevState,
      isBookmarked: storedBookmarks.ayahs[ayah.ayah_id] !== undefined,
    }));
  }, [ayah]);

  const toggleTafsir = () => {
    setState((prevState) => ({
      ...prevState,
      isTafsirOpen: !prevState.isTafsirOpen,
    }));
  };

  const handleBookmarkToggle = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || { surahs: {}, ayahs: {} };
    const ayahKey = ayah.ayah_id;

    if (state.isBookmarked) {
      delete bookmarks.ayahs[ayahKey];
      toast.info(`Removed bookmark for Ayah ${ayah.ayah_number}`);
    } else {
      bookmarks.ayahs[ayahKey] = {
        surahId: ayah.surah_id,
        ayahNumber: ayah.ayah_number,
        timestamp: Date.now(),
      };
      toast.success(`Bookmarked Ayah ${ayah.ayah_number} successfully!`);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    setState((prevState) => ({
      ...prevState,
      isBookmarked: !prevState.isBookmarked,
    }));
  };

  return (
    <div className="mb-4 p-4 rounded-3xl shadow-md" id={ayah.ayah_id}>
      <ToastContainer /> {/* Toast container for rendering notifications */}
      <div className="flex justify-between items-center">
        <div>
          <span className="font-bold">Ayah:</span> {ayah.ayah_number}
        </div>
        <button
          className="ayah-bookmark-icon text-3xl"
          onClick={handleBookmarkToggle}
          aria-label="Bookmark Ayah"
        >
          {state.isBookmarked ? '★' : '☆'}
        </button>
      </div>
      <p
        className={`arabic-text font-arabic text-3xl text-right mt-4 mb-2 ${
          ayah.sajda_word === 'yes' ? 'text-red-500 dark:text-red-500' : ''
        }`}
        dir="rtl"
      >
        {ayah.arabic_text}
      </p>
      <hr className="my-4" />
      <p className="gujarati-text text-gray-900 text-1xl mt-4 mb-2 border-b border-gray-400 pb-4">
        <b>ભાષાન્તર :</b> {ayah.translation_gujarati}
      </p>
      <p className="english-text text-gray-900 text-1xl mt-4 mb-2 border-b border-gray-400 pb-4">
        <b>Translation :</b> {ayah.translation_english}
      </p>
      {ayah.translation_urdu && (
        <div className="flex flex-row-reverse space-x-4">
          <p className="urdu-text text-gray-900 font-urdu text-2xl mt-4 mb-2">
            <b>ترجمہ:</b>
          </p>
          <p
            className="urdu-text text-gray-900 font-urdu text-2xl mt-4 mb-2"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ayah.translation_urdu) }}
          />
        </div>
      )}

      {/* Tafsir Section */}
      {!(ayah.tafsir_gujarati === null && ayah.tafsir_urdu === null && ayah.tafsir_english === null) && (
        <div>
          <button
            className="flex items-center justify-between w-full bg-gray-400 px-4 py-2 mt-4 rounded-3xl focus:outline-none"
            onClick={toggleTafsir}
            aria-expanded={state.isTafsirOpen}
          >
            <span className="font-bold">Tafsir</span>
            <img
              src={ExpandIcon}
              alt="Expand Icon"
              className={`h-6 w-6 transform transition-transform duration-200 ${
                state.isTafsirOpen ? 'rotate-90' : ''
              }`}
            />
          </button>
          <div className={`${state.isTafsirOpen ? 'block' : 'hidden'} mt-2`}>
            <Tafsir ayah={ayah} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Ayah;
