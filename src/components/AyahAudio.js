// src/components/AyahAudio.js
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
    removePreloadedAudio,
    globalLoopCount,
    setGlobalLoopCount,
    trackAyahPlayed,
  } = useAudioContext();

  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // For progress bar display
  const [progress, setProgress] = useState(0);
  // For UI display of current loop iteration
  const [displayLoopIteration, setDisplayLoopIteration] = useState(0);

  // Available loop options (3, 5, 7, 10, or Infinity)
  const loopOptions = [1, 3, 5, 7, 10, Infinity];

  // Use a ref for the current loop iteration (synchronous updates)
  const iterationRef = useRef(0);
  // A ref to always hold the latest globalLoopCount
  const globalLoopCountRef = useRef(globalLoopCount);
  useEffect(() => {
    globalLoopCountRef.current = globalLoopCount;
  }, [globalLoopCount]);

  // A flag to ensure we trigger transition to the next ayah only once
  const transitionedRef = useRef(false);

  const audioRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());
  const nextAyahKeyRef = useRef(nextAyahKey);
  useEffect(() => {
    nextAyahKeyRef.current = nextAyahKey;
  }, [nextAyahKey]);

  // On mount, check if audio is already preloaded for this ayah
  useEffect(() => {
    const cacheKey = `${recitationId}-${ayahKey}`;
    const preloaded = preloadedAudios[cacheKey];
    if (preloaded) {
      setAudioSrc(preloaded.src);
      audioRef.current = preloaded;
      removePreloadedAudio(cacheKey);
    }
  }, [ayahKey, recitationId, preloadedAudios, removePreloadedAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      abortControllerRef.current.abort();
    };
  }, []);

  // Reset when recitationId changes
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
      if (nextAyahKey) {
        preloadNextAyahAudio(nextAyahKey);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching audio:", error);
      }
    } finally {
      setIsFetching(false);
    }
  };

  const preloadNextAyahAudio = async (nextAyah) => {
    const cacheKey = `${recitationId}-${nextAyah}`;
    try {
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
      addPreloadedAudio(cacheKey, nextAudio);
      console.log(`Preloaded audio for ayah: ${nextAyah}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error preloading next Ayah:", error);
      }
    }
  };

  const playAudio = (url) => {
    // Stop any other playing audio
    if (currentlyPlayingSurah) {
      currentlyPlayingSurah.pause();
      setCurrentlyPlayingSurah(null);
    }
    if (currentlyPlayingAyah && currentlyPlayingAyah.ayahKey !== ayahKey) {
      currentlyPlayingAyah.audioRef.pause();
      currentlyPlayingAyah.setIsPlaying(false);
    }

    // Reset iteration and transition flag
    iterationRef.current = 0;
    setDisplayLoopIteration(0);
    transitionedRef.current = false;

    if (!audioRef.current || audioRef.current.src !== url) {
      audioRef.current = new Audio(url);
    }
    const audioElement = audioRef.current;

    // Define our custom ended handler
    const handleEnded = () => {
      // Track the playback completion
      if (audioElement.duration) {
        trackAyahPlayed(ayahKey, audioElement.duration);
      }
      
      // Increment our iteration counter (synchronously)
      iterationRef.current += 1;
      setDisplayLoopIteration(iterationRef.current);
      // If we haven't reached the target loop count, restart the audio
      if (iterationRef.current < globalLoopCountRef.current) {
        audioElement.currentTime = 0;
        audioElement.play().catch((err) =>
          console.error("Error restarting audio:", err)
        );
      } else {
        // Target reached: ensure we only transition once.
        if (!transitionedRef.current) {
          transitionedRef.current = true;
          // Pause the current audio explicitly
          audioElement.pause();
          setIsPlaying(false);
          setCurrentlyPlayingAyah(null);
          // Transition to next ayah if it exists
          const nextKey = nextAyahKeyRef.current;
          if (nextKey) {
            autoScrollToAyah(nextKey);
            const nextCacheKey = `${recitationId}-${nextKey}`;
            const preloaded = preloadedAudios[nextCacheKey];
            if (preloaded) {
              const nextComponent = document.getElementById(`play-btn-${nextKey}`);
              if (nextComponent) nextComponent.click();
            } else {
              setTimeout(() => {
                document.getElementById(`play-btn-${nextKey}`)?.click();
              }, 300);
            }
          }
        }
      }
    };

    // Remove any previous ended handler and attach our new one
    audioElement.removeEventListener("ended", handleEnded);
    audioElement.addEventListener("ended", handleEnded);

    setIsBuffering(true);
    audioElement
      .play()
      .then(() => {
        setIsBuffering(false);
        setIsPlaying(true);
        setCurrentlyPlayingAyah({
          ayahKey,
          audioRef: audioElement,
          setIsPlaying,
        });
        if (nextAyahKey) {
          preloadNextAyahAudio(nextAyahKey);
        }
      })
      .catch((error) => {
        setIsBuffering(false);
        console.error("Play error:", error);
      });
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      // Pause current audio and reset iteration counter
      audioRef.current?.pause();
      setIsPlaying(false);
      setCurrentlyPlayingAyah(null);
      iterationRef.current = 0;
      setDisplayLoopIteration(0);
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

  // Cycle through global loop count options
  const cycleLoopCount = () => {
    const currentIndex = loopOptions.indexOf(globalLoopCount);
    const nextIndex = (currentIndex + 1) % loopOptions.length;
    const newLoopCount = loopOptions[nextIndex];
    setGlobalLoopCount(newLoopCount);
  };

  // Update progress bar while audio is playing
  useEffect(() => {
    let intervalId;
    if (isPlaying && audioRef.current) {
      intervalId = setInterval(() => {
        if (audioRef.current.duration) {
          setProgress(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          );
        }
      }, 250);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  return (
    <div className="flex items-center space-x-2">
      {/* PLAY/PAUSE BUTTON */}
      <button
        id={`play-btn-${ayahKey}`}
        onClick={togglePlayPause}
        className="text-3xl text-black dark:text-gray-200 transition-all duration-200"
        disabled={isFetching || isBuffering}
      >
        {isFetching || isBuffering ? (
          <FaSpinner className="w-6 h-6 animate-spin" />
        ) : isPlaying ? (
          <FaPause className="w-4 h-4" />
        ) : (
          <FaPlay className="w-4 h-4" />
        )}
      </button>
  
      {/* CLICKABLE CIRCLE FOR LOOP + PROGRESS */}
      <div
        className="relative w-10 h-10 cursor-pointer"
        onClick={cycleLoopCount} 
      >
        {/* Smaller viewBox for a 48x48 coordinate system */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 45 45">
          {/* Background circle */}
          <circle
            className="text-gray-300 dark:text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="18"
            cx="24"
            cy="24"
          />
          {/* Progress circle (arc) */}
          <circle
            className="text-teal-500"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="18"
            cx="24"
            cy="24"
            strokeDasharray={2 * Math.PI * 18} 
            strokeDashoffset={2 * Math.PI * 18 * (1 - progress / 100)}
          />
        </svg>
  
        {/* Center text: shows loop iteration if playing, else selected loop */}
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
          {isPlaying
            ? globalLoopCount === Infinity
              ? "∞"
              : `${displayLoopIteration + 1}/${globalLoopCount}`
            : globalLoopCount === Infinity
              ? "∞"
              : `${globalLoopCount}`}
        </div>
      </div>
    </div>
  );
  
};

export default AyahAudio;
