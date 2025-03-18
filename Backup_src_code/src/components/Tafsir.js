// src/components/Tafsir.js
import React from 'react';
import DOMPurify from 'dompurify'; // Import DOMPurify


function Tafsir({ ayah }) { // Receive the ayah prop
  const { tafsir_gujarati, tafsir_english, tafsir_urdu } = ayah;

  const extractTextFromHtml = (html) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || '';
  };

  const sanitizedTafsirUrdu = DOMPurify.sanitize(tafsir_urdu); // Sanitize the HTML


  return (
    <div className="mt-2">
      {tafsir_gujarati && (
        <p className="gujarati-text text-gray-700 b-b-1 text-1xl mt-4 mb-2 border-b border-gray-400 pb-4">
          <b>તફસીર :</b> {tafsir_gujarati}
        </p>
      )}
      {tafsir_english && (
        <p className="english-text text-gray-700 text-1xl mt-4 mb-2 border-b border-gray-400 pb-4">
          <b>Interpretation:</b> {tafsir_english}
        </p>
      )}
      {tafsir_urdu && (
        <div className="flex flex-row-reverse space-x-4"> 
        <p className="urdu-text text-gray-700 font-urdu text-2xl mt-4 mb-2">
            <b>تفسیر:</b>
        </p>
        <p
            className="urdu-text text-gray-700 font-urdu text-2xl mt-4 mb-2 border-b border-gray-400 pb-4 whitespace-nowrap"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tafsir_urdu) }}
        />
        </div>
        )}
    </div>
  );
}

export default Tafsir;