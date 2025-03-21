// src/contexts/AudioContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AudioContext = createContext();

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  // Existing state for audio player disabled flag
  const [isAudioPlayerDisabled, setIsAudioPlayerDisabled] = useState(() => {
    return localStorage.getItem('disableAudioPlayer') === 'true';
  });

  // Existing state for recitation ID
  const [recitationId, setRecitationId] = useState(() => {
    return localStorage.getItem('recitationId') || 7; // Default recitation ID
  });

  const [currentlyPlayingAyah, setCurrentlyPlayingAyah] = useState(null);
  const [currentlyPlayingSurah, setCurrentlyPlayingSurah] = useState(null);

  // New state for preloaded audios
  const [preloadedAudios, setPreloadedAudios] = useState({});

  // New: Global loop count state
  const [globalLoopCount, setGlobalLoopCount] = useState(() => {
    const stored = localStorage.getItem("ayahLoopCount");
    return stored ? (stored === "Infinity" ? Infinity : parseInt(stored)) : 1;
  });

  // New state for tracking played ayahs and total playback time
  const [playedAyahs, setPlayedAyahs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('playedAyahs')) || {};
    } catch (e) {
      return {};
    }
  });
  const [totalPlaybackTime, setTotalPlaybackTime] = useState(() => {
    return parseInt(localStorage.getItem('totalPlaybackTime')) || 0;
  });

  // Persist global loop count to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ayahLoopCount", globalLoopCount === Infinity ? "Infinity" : globalLoopCount);
  }, [globalLoopCount]);

  // Existing method to toggle the audio player
  const toggleAudioPlayer = (isDisabled) => {
    setIsAudioPlayerDisabled(isDisabled);
    localStorage.setItem('disableAudioPlayer', isDisabled);
  };

  // Existing method to change the recitation ID
  const changeRecitationId = (id) => {
    setRecitationId(id);
    localStorage.setItem('recitationId', id);
    // Clear preloaded audios when recitation changes
    setPreloadedAudios({});
  };

  // New methods for managing preloaded audios
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

  // Cleanup preloaded audios when the component unmounts
  useEffect(() => {
    return () => {
      Object.values(preloadedAudios).forEach(audio => {
        if (audio instanceof HTMLAudioElement) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Add a function to track when an ayah has been played
  const trackAyahPlayed = (ayahKey, playbackDuration) => {
    // Add the ayah to playedAyahs if it doesn't exist
    setPlayedAyahs(prev => {
      const newPlayedAyahs = { ...prev };
      if (!newPlayedAyahs[ayahKey]) {
        newPlayedAyahs[ayahKey] = { 
          count: 1, 
          lastPlayed: new Date().toISOString() 
        };
      } else {
        newPlayedAyahs[ayahKey] = { 
          count: newPlayedAyahs[ayahKey].count + 1, 
          lastPlayed: new Date().toISOString() 
        };
      }
      return newPlayedAyahs;
    });

    // Add the playback duration to totalPlaybackTime
    setTotalPlaybackTime(prev => prev + (playbackDuration || 0));
  };

  // Save to localStorage whenever these values change
  useEffect(() => {
    localStorage.setItem('playedAyahs', JSON.stringify(playedAyahs));
  }, [playedAyahs]);

  useEffect(() => {
    localStorage.setItem('totalPlaybackTime', totalPlaybackTime.toString());
  }, [totalPlaybackTime]);

  return (
    <AudioContext.Provider
      value={{
        isAudioPlayerDisabled,
        toggleAudioPlayer,
        recitationId,
        changeRecitationId,
        currentlyPlayingAyah,
        setCurrentlyPlayingAyah,
        currentlyPlayingSurah,
        setCurrentlyPlayingSurah,
        preloadedAudios,
        addPreloadedAudio,
        removePreloadedAudio,
        // Provide the global loop count and its setter
        globalLoopCount,
        setGlobalLoopCount,
        playedAyahs,
        totalPlaybackTime,
        trackAyahPlayed,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
