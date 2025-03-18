// src/components/Tafsir.js
import React from "react";
import DOMPurify from "dompurify";
import { useTranslation } from "../contexts/TranslationContext.js";

function Tafsir({ ayah }) {
    const { selectedTranslations } = useTranslation();
    const { tafsir_gujarati, tafsir_english, tafsir_urdu, tafsir_hindi, tafsir_as_kalam_roman } = ayah;

    const formattedTafsirHindi = tafsir_hindi && typeof tafsir_hindi === "object"
    ? Object.entries(tafsir_hindi)
          .map(([key, value], index) => `[${index + 1}] ${value}`)
          .join("<br/>")
    : tafsir_hindi;

    // Function to properly format tafsir JSON and footnotes
    const sanitizeContent = (content) => {
        if (!content) return "";
        
        // Convert JSON tafsir to readable format
        if (typeof content === "object") {
            return DOMPurify.sanitize(
                Object.entries(content)
                    .map(([key, value], index) => `<b>${index + 1}:</b> ${value}`)
                    .join("<br/>")
            );
        }
        
        return DOMPurify.sanitize(content);
    };

    return (
        <div className="mt-2">
            {/* Show Gujarati Tafsir only if selected */}
            {selectedTranslations.includes("gujarati") && tafsir_gujarati && (
                <TafsirSection
                    title="તફસીર"
                    content={sanitizeContent(tafsir_gujarati)}
                    cssClass="gujarati-text font-gujarati text-black dark:text-white text-1xl"
                />
            )}
            {/* Show Ahsanul Kalaam Tafsir only if selected */}
            {selectedTranslations.includes("as_kalam_roman") && tafsir_as_kalam_roman && (
                <TafsirSection
                    title="Tafsir"
                    content={sanitizeContent(tafsir_as_kalam_roman)}
                    cssClass="english-text text-black dark:text-white text-1xl"
                />
            )}
            {/* Show English Tafsir only if selected */}
            {selectedTranslations.includes("english") && tafsir_english && (
                <TafsirSection
                    title="Interpretation"
                    content={sanitizeContent(tafsir_english)}
                    cssClass="english-text text-black dark:text-white text-1xl"
                />
            )}
            {/* Show Urdu Tafsir only if selected */}
            {selectedTranslations.includes("urdu") && tafsir_urdu && (
                <TafsirSection
                    title="تفسیر"
                    content={sanitizeContent(tafsir_urdu)}
                    cssClass="urdu-text text-black dark:text-white font-urdu text-2xl"
                    isRtl
                />
            )}
            {/* Show Hindi Tafsir only if selected */}
            {selectedTranslations.includes("hindi") && formattedTafsirHindi && (
    <TafsirSection
        title="तफ़सीर"
        content={formattedTafsirHindi}
        cssClass="hindi-text font-hindi text-black dark:text-white text-2xl"
    />
)}
        </div>
    );
}

// Reusable TafsirSection component remains the same
function TafsirSection({ title, content, cssClass, isRtl }) {
    return (
        <div
            className={`flex flex-col ${
                isRtl ? "flex-row-reverse space-x-reverse" : "space-x-4"
            } border-b border-gray-400 pb-4 mt-4 mb-2`}
            dir={isRtl ? "rtl" : "ltr"}
        >
            <p className={`${cssClass} font-bold`}>{title}:</p>
            <div
                className={`${cssClass} whitespace-normal`}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}

export default Tafsir;
