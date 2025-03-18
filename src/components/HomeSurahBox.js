// src/components/HomeSurahBox.js
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function HomeSurahBox({ surah }) {
  return (
    <Link
      to={`/surah/${surah.surah_id}`}
      aria-label={`View details for Surah ${surah.name_english}, containing ${surah.total_ayahs} Ayahs.`}
      className="surah-box bg-white text-black rounded-3xl flex items-center p-4 shadow-lg border border-gray-400 
                hover:shadow-xl hover:scale-105 hover:bg-teal-400 hover:text-white transition-all duration-300 ease-in-out"
    >
      <div className="surah-details flex items-center w-full">
        {/* Surah Number */}
        <div
          className="surah-number bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold text-lg rounded-full 
                     flex items-center justify-center w-12 h-12 mr-4 shrink-0"
        >
          {surah.surah_number}
        </div>

        {/* Surah Info */}
        <div className="surah-info flex-grow text-left flex flex-col">
          {/* Surah Name */}
          <h2 className="surah-title text-xl font-semibold truncate">
            {surah.name_english}
          </h2>

          {/* Surah Meaning */}
          <p className="surah-meaning text-sm  text-gray-700 dark:text-gray-300">
            {surah.english_meaning || 'No meaning available'}
          </p>

          {/* Additional Surah Details */}
          <div className="surah-info-inner grid grid-cols-2 gap-x-2 gap-y-1 text-sm mt-3">
            <span className="surah-revelation">
              <strong> {surah.revelation_order || 'N/A'} </strong>
            </span>
            <span className="surah-ayahs-count">
              <strong>Ayahs:</strong> {surah.total_ayahs}
            </span>
            <span className="surah-ruku">
              <strong>Ruku:</strong> {surah.surah_total_ruku || '0'}
            </span>
            <span className="surah-para">
              <strong>Parah:</strong> {surah.parah_info || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

HomeSurahBox.propTypes = {
  surah: PropTypes.shape({
    surah_id: PropTypes.number.isRequired,
    surah_number: PropTypes.number.isRequired,
    name_english: PropTypes.string.isRequired,
    english_meaning: PropTypes.string,
    revelation_order: PropTypes.string,
    total_ayahs: PropTypes.number.isRequired,
    surah_total_ruku: PropTypes.number,
    parah_info: PropTypes.string,
  }).isRequired,
};

HomeSurahBox.defaultProps = {
  surah: {
    english_meaning: 'N/A',
    revelation_order: 'N/A',
    surah_total_ruku: 0,
    parah_info: 'N/A',
  },
};

export default React.memo(HomeSurahBox);
