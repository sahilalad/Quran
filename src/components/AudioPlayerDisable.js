// src/components/AudioPlayerDisable.js
import React from 'react';
import { useAudioContext } from '../contexts/AudioContext';

function AudioPlayerDisable() {
  const { isAudioPlayerDisabled, toggleAudioPlayer } = useAudioContext();

  return (
    <div className="flex mb-4 font-medium items-center justify-between mt-4">
      <label htmlFor="audio-player-toggle" className="text-sm">
        Audio Player:
      </label>
      <button
        id="audio-player-toggle"
        aria-pressed={!isAudioPlayerDisabled}
        onClick={() => toggleAudioPlayer(!isAudioPlayerDisabled)}
        className={`text-sm px-4 py-2 rounded-3xl focus:outline-none transition-all duration-300 ${
          isAudioPlayerDisabled
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-teal-400 text-white hover:bg-green-600'
        }`}
      >
        {isAudioPlayerDisabled ? 'OFF' : 'ON'}
      </button>
    </div>
  );
}

export default AudioPlayerDisable;
