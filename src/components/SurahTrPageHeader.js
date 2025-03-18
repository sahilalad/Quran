// src/components/SurahTrPageHeader.js
import React from 'react';
// import DOMPurify from 'dompurify'; // Import DOMPurify


function SurahTrPageHeader({ surah }) { // Receive surah as a prop

  if (!surah) {
    return <div>Loading Surah details...</div>; // Fallback for undefined surah
  }

  // const sanitizedIntro = DOMPurify.sanitize(
  //   typeof surah.short_intro === 'string'
  //     ? surah.short_intro.replace(/<br\s*\/?>/gi, '') // Replace line breaks with spaces
  //     : surah.short_intro || '' // Use empty string if undefined
  // );

  return (
    <div className="surah-header mb-5 p-5 bg-white rounded-3xl gap-4 flex flex-wrap justify-center items-center shadow-md">
      <div className="flex justify-center items-center w-full">
        {/* Surah title and ID */}
        <div>
            <h2 className="text-2xl font-bold text-gray-800"> {/* Added Tailwind classes */}
              {surah.surah_id} - {surah.name_english}
            </h2>
        </div>
      </div>

      {/* Surah short intro */}
      {/* {sanitizedIntro && (
      <div className="mt-2 w-full">
      <p 
        className="text-gray-900" 
        dangerouslySetInnerHTML={{ __html: sanitizedIntro }}
      /> 
      </div>
      )} */}
      {/* Surah details */}
      <div className="surah-header-inner-info mt-2 w-full display: contents">
        {/* <p className="text-sm">
          <span className="font-medium text-gray-900">Meaning:</span> {surah.name_meaning}
      </p> */}
      <p className="text-sm">
        <span className="font-medium text-gray-900">Ayah:</span> {surah.total_ayahs}
      </p>
      <p className="text-sm">
      <span className="font-medium text-gray-900">Parah:</span> {surah.parah_info}
      </p>
      <p className="text-sm">
        <span className="font-medium text-gray-900">Ruku:</span> {surah.surah_total_ruku}
      </p>
      <p className="text-sm">
        <span className="font-medium text-gray-900">Revelation:</span> {surah.revelation_order}
      </p>
      </div>
    </div>
  );
}

// Reusable component for rendering detail items
function DetailItem({ label, value }) {
  return (
    <p className="text-sm">
      <span className="font-medium text-gray-900">{label}:</span> {value || 'N/A'}
    </p>
  );
}

export default SurahTrPageHeader;