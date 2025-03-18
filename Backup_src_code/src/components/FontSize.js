// src/components/FontSize.js

import React, { useState, useEffect } from 'react';

function FontSize() {
  const [arabicFontSize, setArabicFontSize] = useState(() => {
    return parseInt(localStorage.getItem('arabicFontSize') || '26', 10);
  });
  const [urduFontSize, setUrduFontSize] = useState(() => {
    return parseInt(localStorage.getItem('urduFontSize') || '18', 10);
  });
  const [englishFontSize, setEnglishFontSize] = useState(() => {
    return parseInt(localStorage.getItem('englishFontSize') || '16', 10);
  });
  const [gujaratiFontSize, setGujaratiFontSize] = useState(() => {
    return parseInt(localStorage.getItem('gujaratiFontSize') || '16', 10);
  });

  const resetFontSizes = () => {
    const defaultSizes = {
      arabic: 26,
      urdu: 18,
      english: 16,
      gujarati: 16,
    };

    setArabicFontSize(defaultSizes.arabic);
    setUrduFontSize(defaultSizes.urdu);
    setEnglishFontSize(defaultSizes.english);
    setGujaratiFontSize(defaultSizes.gujarati);

    document.documentElement.style.setProperty('--arabic-font-size', `${defaultSizes.arabic}px`);
    document.documentElement.style.setProperty('--urdu-font-size', `${defaultSizes.urdu}px`);
    document.documentElement.style.setProperty('--english-font-size', `${defaultSizes.english}px`);
    document.documentElement.style.setProperty('--gujarati-font-size', `${defaultSizes.gujarati}px`);

    localStorage.setItem('arabicFontSize', defaultSizes.arabic);
    localStorage.setItem('urduFontSize', defaultSizes.urdu);
    localStorage.setItem('englishFontSize', defaultSizes.english);
    localStorage.setItem('gujaratiFontSize', defaultSizes.gujarati);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--arabic-font-size', `${arabicFontSize}px`);
    document.documentElement.style.setProperty('--urdu-font-size', `${urduFontSize}px`);
    document.documentElement.style.setProperty('--english-font-size', `${englishFontSize}px`);
    document.documentElement.style.setProperty('--gujarati-font-size', `${gujaratiFontSize}px`);
  }, [arabicFontSize, urduFontSize, englishFontSize, gujaratiFontSize]);

  const handleFontSizeChange = (type, operation) => {
    let newSize;
    if (type === 'arabic') {
      newSize = Math.max(12, operation === 'increase' ? arabicFontSize + 1 : arabicFontSize - 1);
      setArabicFontSize(newSize);
      localStorage.setItem('arabicFontSize', newSize);
    } else if (type === 'urdu') {
      newSize = Math.max(12, operation === 'increase' ? urduFontSize + 1 : urduFontSize - 1);
      setUrduFontSize(newSize);
      localStorage.setItem('urduFontSize', newSize);
    } else if (type === 'english') {
      newSize = Math.max(12, operation === 'increase' ? englishFontSize + 1 : englishFontSize - 1);
      setEnglishFontSize(newSize);
      localStorage.setItem('englishFontSize', newSize);
    } else if (type === 'gujarati') {
      newSize = Math.max(12, operation === 'increase' ? gujaratiFontSize + 1 : gujaratiFontSize - 1);
      setGujaratiFontSize(newSize);
      localStorage.setItem('gujaratiFontSize', newSize);
    }
  };

  return (
    <div>
      {/* Arabic Font Size Controls */}
      <div className="mb-4 flex items-center justify-between">
        <label className='text-sm'>Arabic Font Size:</label>
        <div className="flex items-center">
          <button
            onClick={() => handleFontSizeChange('arabic', 'decrease')}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-3xl px-3 py-2 focus:outline-none"
          >
            -
          </button>
          <span className="mx-2">{arabicFontSize}px</span>
          <button
            onClick={() => handleFontSizeChange('arabic', 'increase')}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-3xl px-3 py-2 focus:outline-none"
          >
            +
          </button>
        </div>
      </div>

      {/* Urdu Font Size Controls */}
      <div className="mb-4 flex items-center justify-between">
        <label className='text-sm'>Urdu Font Size:</label>
        <div className="flex items-center">
          <button
            onClick={() => handleFontSizeChange('urdu', 'decrease')}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-3xl px-3 py-2 focus:outline-none"
          >
            -
          </button>
          <span className="mx-2">{urduFontSize}px</span>
          <button
            onClick={() => handleFontSizeChange('urdu', 'increase')}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-3xl px-3 py-2 focus:outline-none"
          >
            +
          </button>
        </div>
      </div>

      {/* English Font Size Controls */}
      <div className="mb-4 flex items-center justify-between">
        <label className='text-sm'>English Font Size:</label>
        <div className="flex items-center">
          <button
            onClick={() => handleFontSizeChange('english', 'decrease')}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-3xl px-3 py-2 focus:outline-none"
          >
            -
          </button>
          <span className="mx-2">{englishFontSize}px</span>
          <button
            onClick={() => handleFontSizeChange('english', 'increase')}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-3xl px-3 py-2 focus:outline-none"
          >
            +
          </button>
        </div>
      </div>

      {/* Gujarati Font Size Controls */}
      <div className="mb-4 flex items-center justify-between">
        <label className='text-sm'>Gujarati Font Size:</label>
        <div className="flex items-center">
          <button
            onClick={() => handleFontSizeChange('gujarati', 'decrease')}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-3xl px-3 py-2 focus:outline-none"
          >
            -
          </button>
          <span className="mx-2">{gujaratiFontSize}px</span>
          <button
            onClick={() => handleFontSizeChange('gujarati', 'increase')}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-3xl px-3 py-2 focus:outline-none"
          >
            +
          </button>
        </div>
      </div>

      {/* Reset Font Sizes Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={resetFontSizes}
          className=" w-full bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded-3xl"
        >
          Reset Font Sizes
        </button>
      </div>
    </div>
  );
}

export default FontSize;
