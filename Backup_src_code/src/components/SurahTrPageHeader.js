// src/components/SurahTrPageHeader.js
import React from 'react';
import DOMPurify from 'dompurify'; // Import DOMPurify


function SurahTrPageHeader({ surah }) { // Receive surah as a prop
  return (
    <div className="surah-header mb-5 p-5 bg-white rounded-3xl gap-4 flex flex-wrap justify-center items-center shadow-md">
      <div className="flex justify-between items-center w-full">
        {/* Surah title and ID */}
        <div>
            <h2 className="text-2xl font-bold text-gray-800"> {/* Added Tailwind classes */}
              {surah.surah_id} : {surah.name_english}
            </h2>
        </div>
      </div>

      {/* Surah short intro */}
      <div className="mt-2 w-full">
      <p 
        className="text-gray-900" 
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(
            typeof surah.short_intro === 'string' 
              ? surah.short_intro.replace(/<br\s*\/?>/gi, '') 
              : surah.short_intro // If not a string, render as is
          ) 
        }} 
      /> 
      </div>

      {/* Surah details */}
      <div className="surah-header-inner-info mt-2 w-full display: contents">
  <p className="text-sm">
    <span className="font-medium text-gray-900">Meaning:</span> {surah.name_meaning}
  </p>
  <p className="text-sm">
    <span className="font-medium text-gray-900">Revelation:</span> {surah.revelation_order}
  </p>
  <p className="text-sm">
    <span className="font-medium text-gray-900">Ayah:</span> {surah.total_ayahs}
  </p>
  <p className="text-sm">
    <span className="font-medium text-gray-900">Parah:</span> {surah.parah_info}
  </p>
</div>
    </div>
  );
}

export default SurahTrPageHeader;