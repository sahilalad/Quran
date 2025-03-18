// src/context/AudioContext.js
import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  // Existing state
  const [isAudioPlayerDisabled, setIsAudioPlayerDisabled] = useState(() => {
    return localStorage.getItem('disableAudioPlayer') === 'true';
  });

  const [recitationId, setRecitationId] = useState(() => {
    return localStorage.getItem('recitationId') || 7; // Default recitation ID
  });

  const [currentlyPlayingAyah, setCurrentlyPlayingAyah] = useState(null);
  const [currentlyPlayingSurah, setCurrentlyPlayingSurah] = useState(null);

  // New state for preloaded audios
  const [preloadedAudios, setPreloadedAudios] = useState({});

  // Existing methods
  const toggleAudioPlayer = (isDisabled) => {
    setIsAudioPlayerDisabled(isDisabled);
    localStorage.setItem('disableAudioPlayer', isDisabled);
  };

  const changeRecitationId = (id) => {
    setRecitationId(id);
    localStorage.setItem('recitationId', id);
    // Clear preloaded audios when recitation changes
    setPreloadedAudios({});
  };

  // New methods for preloading
  const addPreloadedAudio = (key, audio) => {
    setPreloadedAudios(prev => ({ 
      ...prev, 
      [key]: audio 
    }));
  };

  const removePreloadedAudio = (key) => {
    setPreloadedAudios(prev => {
      const newPreloads = { ...prev };
      delete newPreloads[key];
      return newPreloads;
    });
  };

  // Cleanup preloaded audios when component unmounts
  React.useEffect(() => {
    return () => {
      // Cleanup all preloaded audio objects
      Object.values(preloadedAudios).forEach(audio => {
        if (audio instanceof HTMLAudioElement) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        // Existing values
        isAudioPlayerDisabled,
        toggleAudioPlayer,
        recitationId,
        changeRecitationId,
        currentlyPlayingAyah,
        setCurrentlyPlayingAyah,
        currentlyPlayingSurah,
        setCurrentlyPlayingSurah,
        
        // New values for preloading
        preloadedAudios,
        addPreloadedAudio,
        removePreloadedAudio
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};