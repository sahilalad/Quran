// src/contexts/TranslationContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
    const [selectedTranslations, setSelectedTranslations] = useState(() => {
        const storedTranslations = JSON.parse(localStorage.getItem("selectedTranslations")) || ["gujarati"];
        return Array.isArray(storedTranslations) && storedTranslations.length > 0
            ? storedTranslations
            : ["gujarati"]; // Ensure at least Gujarati is selected
    });

    useEffect(() => {
        if (selectedTranslations.length === 0) {
            setSelectedTranslations(["gujarati"]); // Prevent empty selection
        } else {
            localStorage.setItem("selectedTranslations", JSON.stringify(selectedTranslations));
        }
    }, [selectedTranslations]);

    return (
        <TranslationContext.Provider value={{ selectedTranslations, setSelectedTranslations }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => {
    return useContext(TranslationContext);
};
