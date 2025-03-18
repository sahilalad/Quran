// src/components/dua/DuaCard.jsx
import React from 'react';

const DuaCard = ({ dua }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-md">
      <h3 className="text-xl font-bold mb-2 dark:text-white">{dua.title}</h3>
      <p
        className="font-IndoPak font-urdu text-3xl text-right mb-2 dark:text-white"
        dir="rtl"
      >
        {dua.arabic}
      </p>
      {dua.transliteration && (
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Transliteration: </strong>
          {dua.transliteration}
        </p>
      )}
      {dua.translation && (
        <p className="text-gray-800 dark:text-gray-200 mb-2">
          <strong>Translation: </strong>
          {dua.translation}
        </p>
      )}
      {dua.hadith && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Hadith: </strong>
          {dua.hadith}
        </p>
      )}
    </div>
  );
};

export default DuaCard;
