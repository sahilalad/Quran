// src/component/TranslationSelector.js
import React, { useState } from "react";
import { useTranslation } from "../contexts/TranslationContext";
import { FaChevronDown } from "react-icons/fa"; // Import React Icons

const TranslationSelector = () => {
    const { selectedTranslations, setSelectedTranslations } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleTranslationChange = (event) => {
        const { value, checked } = event.target;

        setSelectedTranslations((prevTranslations) => {
            let newSelections = checked
                ? [...prevTranslations, value] // Add new translation
                : prevTranslations.filter((t) => t !== value); // Remove unchecked translation

            // Ensure at least one translation is selected
            return newSelections.length > 0 ? newSelections : ["gujarati"];
        });
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="mb-4">
            <button
                onClick={toggleExpand}
                className="flex items-center w-full bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-3xl focus:outline-none"
            >
                <FaChevronDown
    className={`h-4 w-4 mr-2 dark:text-gray-300 transform text-black transition-transform duration-0 ${isExpanded ? "rotate-180" : ""}`}
/>
                <span className="font-bold text-gray-700 dark:text-white">Select Translations</span>
            </button>
            <div className={`${isExpanded ? "" : "hidden"} p-4 bg-gray-200 dark:bg-gray-700 rounded-3xl space-y-2 mt-2`}>
                {/* Translation options */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="gujarati"
                        value="gujarati"
                        checked={selectedTranslations.includes("gujarati")}
                        onChange={handleTranslationChange}
                        className="form-checkbox h-4 w-4 text-teal-500 transition duration-150 ease-in-out"
                    />
                    <label htmlFor="gujarati" className="ml-2 block text-sm leading-5 text-gray-900 dark:text-gray-300">
                        Gujarati - Ahsan-ul-Bayan | Abdul Qadir Nadisarwala
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="as_kalam_roman"
                        value="as_kalam_roman"
                        checked={selectedTranslations.includes("as_kalam_roman")}
                        onChange={handleTranslationChange}
                        className="form-checkbox h-4 w-4 text-teal-500 transition duration-150 ease-in-out"
                    />
                    <label htmlFor="as_kalam_roman" className="ml-2 block text-sm leading-5 text-gray-900 dark:text-gray-300">
                        Roman Urdu - Ahsanul Kalaam | Mohsin Khan & H.Salahuddin Yusuf - M.M Abdul Jabbar
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="urdu"
                        value="urdu"
                        checked={selectedTranslations.includes("urdu")}
                        onChange={handleTranslationChange}
                        className="form-checkbox h-4 w-4 text-teal-500 transition duration-150 ease-in-out"
                    />
                    <label htmlFor="urdu" className="ml-2 block text-sm leading-5 text-gray-900 dark:text-gray-300">
                        Urdu - Ahsan-ul-Bayan | Muhammad Junagarhi
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="english"
                        value="english"
                        checked={selectedTranslations.includes("english")}
                        onChange={handleTranslationChange}
                        className="form-checkbox h-4 w-4 text-teal-500 transition duration-150 ease-in-out"
                    />
                    <label htmlFor="english" className="ml-2 block text-sm leading-5 text-gray-900 dark:text-gray-300">
                        English - Hilali & Mohsin Khan
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="hindi"
                        value="hindi"
                        checked={selectedTranslations.includes("hindi")}
                        onChange={handleTranslationChange}
                        className="form-checkbox h-4 w-4 text-teal-500 transition duration-150 ease-in-out"
                    />
                    <label htmlFor="hindi" className="ml-2 block text-sm leading-5 text-gray-900 dark:text-gray-300">
                        Hindi - Maulana Azizul Haque al-Umari
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TranslationSelector;
