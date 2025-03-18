// src/components/Share.js
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { FaShareAlt, FaTimes } from "react-icons/fa"; // React Icons

function Share({ ayahId, arabicText, translations, webpageLink }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({
        ayahId: true,
        arabicText: true,
        translation: true,
        tafsir: false,
        webpageLink: true,
    });

    // Check if Web Share API is supported
    const isWebShareSupported = () => {
        return navigator.share && navigator.canShare && typeof navigator.canShare === 'function';
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedOptions((prev) => ({ ...prev, [name]: checked }));
    };

    const formatTafsirHindi = (tafsir_hindi) => {
      if (typeof tafsir_hindi === "string") {
          try {
              tafsir_hindi = JSON.parse(tafsir_hindi);
          } catch (e) {
              return tafsir_hindi;
          }
      }
      
      if (typeof tafsir_hindi === "object" && tafsir_hindi !== null) {
          return Object.entries(tafsir_hindi)
              .map(([key, value], index) => `(${index + 1}) ${value}`)
              .join("\n");
      }
      return tafsir_hindi || "";
  };

    const handleShare = async () => {
      const content = [];
      if (selectedOptions.ayahId) content.push(`Ayah ID: ${ayahId}\n`);
      if (selectedOptions.arabicText) content.push(`Arabic:\n${arabicText}\n`);

      if (selectedOptions.translation) {
          translations.forEach(({ translation, tafsir, tafsir_hindi, tafsir_urdu }, index) => {
              const sanitizedTranslation = DOMPurify.sanitize(translation, { ALLOWED_TAGS: [] });
              content.push(`Translation ${index + 1}:\n${sanitizedTranslation}\n`);

                if (selectedOptions.tafsir) {
                    let sanitizedTafsir;
                    if (tafsir) {
                      sanitizedTafsir = DOMPurify.sanitize(tafsir, { ALLOWED_TAGS: [] });
                    }  else if (tafsir_urdu) {
                        sanitizedTafsir = DOMPurify.sanitize(tafsir_urdu, { USE_PROFILES: { html: true } });
                    } else {
                        sanitizedTafsir = DOMPurify.sanitize(tafsir, { ALLOWED_TAGS: [] });
                    }
                    content.push(`Tafsir ${index + 1}:\n${sanitizedTafsir}\n`);
                }
            });
        }

        if (selectedOptions.webpageLink) content.push(`Link:\n${webpageLink}#${ayahId}`);

        const shareData = {
            title: `Ayah ${ayahId}`,
            text: content.join('\n'),
            url: webpageLink,
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = content.join('\n');
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Content copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            {/* Share Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="p-1 text-black dark:text-gray-300 hover:text-teal-600 focus:outline-none"
                aria-label="Share Ayah"
            >
        <FaShareAlt className="h-5 w-5" />
            </button>

            {/* Share Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl w-11/12 max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Share Ayah</h2>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="ayahId"
                                    checked={selectedOptions.ayahId}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                Ayah ID
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="arabicText"
                                    checked={selectedOptions.arabicText}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                Arabic Text
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="translation"
                                    checked={selectedOptions.translation}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                Translation
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="tafsir"
                                    checked={selectedOptions.tafsir}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                Tafsir
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="webpageLink"
                                    checked={selectedOptions.webpageLink}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                Webpage Link
                            </label>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-3xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleShare}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-3xl"
                            >
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Share;