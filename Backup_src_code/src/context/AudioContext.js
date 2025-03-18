// src/context/AudioContext.js

import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [isAudioPlayerDisabled, setIsAudioPlayerDisabled] = useState(() => {
    return localStorage.getItem('disableAudioPlayer') === 'true';
  });

  const [recitationId, setRecitationId] = useState(() => {
    return localStorage.getItem('recitationId') || 7; // Default recitation ID
  });

  const toggleAudioPlayer = (isDisabled) => {
    setIsAudioPlayerDisabled(isDisabled);
    localStorage.setItem('disableAudioPlayer', isDisabled);
  };

  const changeRecitationId = (id) => {
    setRecitationId(id);
    localStorage.setItem('recitationId', id);
  };

  return (
    <AudioContext.Provider
      value={{
        isAudioPlayerDisabled,
        toggleAudioPlayer,
        recitationId,
        changeRecitationId,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
