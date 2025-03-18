import React from 'react';

const SurahInfoBar = ({ surah, currentAyahNumber, currentRukuNumber, parahNumber }) => {
  return (
    <div className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-900 p-4 pr-4 pl-4 shadow-md rounded-b-3xl">
      <div className="flex flex-col md:flex-row md:justify-between items-center">
        <div className="text-xs">
          <strong>{surah?.surah_id} - {surah?.name_english} </strong>
        </div>
        <div className="text-xs">
          <strong>Parah:</strong> {parahNumber} &nbsp;|&nbsp;
          <strong>Ruku:</strong> {currentRukuNumber} &nbsp;|&nbsp;
          <strong>Ayah:</strong> {currentAyahNumber}
        </div>
      </div>
    </div>
  );
};

export default SurahInfoBar;
