import React, { useState, useRef, useEffect } from "react";
import { useAudioContext } from "../contexts/AudioContext";
import { axiosGetQuranApi } from "../utils/api";
import { FaPlay, FaPause, FaSpinner } from "react-icons/fa";

const AyahAudio = ({ ayahKey, nextAyahKey }) => {
  const {
    recitationId = 7,
    currentlyPlayingAyah,
    setCurrentlyPlayingAyah,
    currentlyPlayingSurah,
    setCurrentlyPlayingSurah,
    preloadedAudios,
    addPreloadedAudio,
    removePreloadedAudio
  } = useAudioContext();

  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());
  const nextAyahKeyRef = useRef(nextAyahKey);

  // Keep nextAyahKey ref updated
  useEffect(() => {
    nextAyahKeyRef.current = nextAyahKey;
  }, [nextAyahKey]);

  // Check for existing preloaded audio on mount
  useEffect(() => {
    const cacheKey = `${recitationId}-${ayahKey}`;
    const preloaded = preloadedAudios[cacheKey];
    
    if (preloaded) {
      setAudioSrc(preloaded.src);
      audioRef.current = preloaded;
      removePreloadedAudio(cacheKey); // Remove from preloads as it's now active
    }
  }, [ayahKey, recitationId, preloadedAudios, removePreloadedAudio]);

  // Cleanup effects
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      abortControllerRef.current.abort();
    };
  }, []);

  // Reset audio when recitationId changes
  useEffect(() => {
    setAudioSrc(null);
    audioRef.current?.pause();
    setIsPlaying(false);
  }, [recitationId]);

  const fetchAndPlayAudio = async () => {
    if (isFetching) return;
    setIsFetching(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await axiosGetQuranApi(
        `/recitations/${recitationId}/by_ayah/${ayahKey}`,
        { signal: abortControllerRef.current.signal }
      );
      const audioFileUrl = response.audio_files?.[0]?.url;

      if (!audioFileUrl) {
        console.error("No audio URL found for Ayah:", ayahKey);
        return;
      }

      const fullAudioUrl = `https://verses.quran.com/${audioFileUrl}`;
      setAudioSrc(fullAudioUrl);
      playAudio(fullAudioUrl);

      // Preload the next ayah (ayah-2 if ayah-1 is playing)
      if (nextAyahKey) {
        preloadNextAyahAudio(nextAyahKey);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching audio:", error);
      }
    } finally {
      setIsFetching(false);
    }
  };

  const preloadNextAyahAudio = async (nextAyah) => {
    const cacheKey = `${recitationId}-${nextAyah}`;
    
    try {
      // Check if already preloaded
      if (preloadedAudios[cacheKey]) return;

      const response = await axiosGetQuranApi(
        `/recitations/${recitationId}/by_ayah/${nextAyah}`,
        { signal: abortControllerRef.current.signal }
      );
      const nextAudioFileUrl = response.audio_files?.[0]?.url;
      
      if (!nextAudioFileUrl) return;
      
      const nextFullAudioUrl = `https://verses.quran.com/${nextAudioFileUrl}`;
      const nextAudio = new Audio(nextFullAudioUrl);
      nextAudio.preload = "auto";
      
      // Store in context
      addPreloadedAudio(cacheKey, nextAudio);

      // Log preloading for debugging
      console.log(`Preloaded audio for ayah: ${nextAyah}`);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error preloading next Ayah:", error);
      }
    }
  };

  const playAudio = (url) => {
    // Stop other audio tracks using context
    if (currentlyPlayingSurah) {
      currentlyPlayingSurah.pause();
      setCurrentlyPlayingSurah(null);
    }

    if (currentlyPlayingAyah && currentlyPlayingAyah.ayahKey !== ayahKey) {
      currentlyPlayingAyah.audioRef.pause();
      currentlyPlayingAyah.setIsPlaying(false);
    }

    // Create new audio instance if needed
    if (!audioRef.current || audioRef.current.src !== url) {
      audioRef.current = new Audio(url);
    }

    // Handle audio events
    const audioElement = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentlyPlayingAyah(null);
      
      const nextKey = nextAyahKeyRef.current;
      if (!nextKey) return;

      autoScrollToAyah(nextKey);
      
      // Check for preloaded audio in context
      const nextCacheKey = `${recitationId}-${nextKey}`;
      const preloaded = preloadedAudios[nextCacheKey];
      
      if (preloaded) {
        // Directly use preloaded audio
        const nextComponent = document.getElementById(`play-btn-${nextKey}`);
        if (nextComponent) {
          nextComponent.click();
        }
      } else {
        // Fallback to standard behavior
        setTimeout(() => {
          document.getElementById(`play-btn-${nextKey}`)?.click();
        }, 300);
      }
    };

    audioElement.removeEventListener('ended', handleEnded);
    audioElement.addEventListener('ended', handleEnded);

    // Play handling
    setIsBuffering(true);
    audioElement.play()
      .then(() => {
        setIsBuffering(false);
        setIsPlaying(true);
        setCurrentlyPlayingAyah({ 
          ayahKey, 
          audioRef: audioElement, 
          setIsPlaying 
        });

        // Preload the next ayah while the current one is playing
        if (nextAyahKey) {
          preloadNextAyahAudio(nextAyahKey);
        }
      })
      .catch(error => {
        setIsBuffering(false);
        console.error("Play error:", error);
      });
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setCurrentlyPlayingAyah(null);
    } else if (audioSrc) {
      playAudio(audioSrc);
    } else {
      fetchAndPlayAudio();
    }
  };

  const autoScrollToAyah = (ayahId) => {
    const element = document.getElementById(`ayah-${ayahId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <button
      id={`play-btn-${ayahKey}`}
      onClick={togglePlayPause}
      className="text-3xl text-black dark:text-gray-200 transition-all duration-200"
      disabled={isFetching || isBuffering}
    >
      {isFetching || isBuffering ? (
        <FaSpinner className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-400" />
      ) : isPlaying ? (
        <FaPause className="w-4 h-4 text-black dark:text-gray-200" />
      ) : (
        <FaPlay className="w-4 h-4 text-black dark:text-gray-200" />
      )}
    </button>
  );
};

export default AyahAudio;