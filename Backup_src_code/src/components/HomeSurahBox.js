// src/components/HomeSurahBox.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomeSurahBox({ surah }) {
  return (
    <Link to={`/surah/${surah.surah_id}`} key={surah.surah_id}>
      <div className="surah-box bg-white text-black rounded-3xl flex items-center p-2 border border-gray-500 cursor-pointer
                        hover:bg-teal-400 hover:text-black"> {/* Tailwind classes for surah-box */}
        <div className="surah-details flex items-center w-full"> {/* Tailwind classes for surah-details */}
          <div className="surah-number bg-blue-500 text-white font-bold text-xl rounded-full flex items-center justify-center w-10 h-10 mr-3 shrink-0"> {/* Tailwind classes for surah-number */}
            {surah.surah_number}
          </div>
          <div className="surah-info flex-grow text-center flex flex-col"> {/* Tailwind classes for surah-info */}
            <div className="surah-title text-lg font-bold mb-1"> {/* Tailwind classes for surah-title */}
              {surah.name_english}
            </div>
            <div>
              <div className="surah-meaning text-sm"> {/* Tailwind classes for surah-meaning */}
                {surah.english_meaning}
              </div>
            </div>
            <div className="surah-info-inner grid grid-cols-2 gap-1"> {/* Tailwind classes for surah-info-inner */}
              <div className="surah-revelation text-xs"> {/* Tailwind classes for surah-revelation */}
                <strong>{surah.revelation_order}</strong>
              </div>
              <div className="surah-ayahs-count text-xs"> {/* Tailwind classes for surah-ayahs-count */}
                <strong>Ayah:</strong> {surah.total_ayahs}
              </div>
              <div className="surah-ruku text-xs"> {/* Tailwind classes for surah-ruku */}
                <strong>Ruku:</strong> {surah.surah_total_ruku}
              </div>
              <div className="surah-para text-xs"> {/* Tailwind classes for surah-para */}
                <strong>Parah:</strong> {surah.parah_info}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HomeSurahBox;