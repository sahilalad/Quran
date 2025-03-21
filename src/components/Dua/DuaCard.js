// src/components/dua/DuaCard.jsx
import React from 'react';

const DuaCard = ({ dua }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-md">
<h3 
  className="text-xl text-center font-bold p-2 mb-2 dark:text-white 
             border-0 rounded-3xl 
             bg-gradient-to-r from-teal-400 to-blue-500 
             border-transparent 
             shadow-lg shadow-teal-500/50 dark:shadow-teal-700/50"
>
  {dua.title}
</h3>      <p
        className="font-IndoPak text-3xl text-right mb-2 dark:text-teal-400"
        dir="rtl"
      >
        {dua.arabic}
      </p>
      {/* {dua.transliteration && (
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Transliteration: </strong>
          {dua.transliteration}
        </p>
      )} */}
      {dua.translation && (
        <p className="text-gray-800 dark:text-gray-200 mb-2">
          <strong>Translation: </strong>
          {dua.translation}
        </p>
      )}
      {dua.hadith && (
        <p className="p-2 text-sm text-gray-600 dark:text-gray-400 border rounded-3xl">
          <strong>Hadith: </strong>
          {dua.hadith}
        </p>
      )}
    </div>
  );
};

export default DuaCard;
