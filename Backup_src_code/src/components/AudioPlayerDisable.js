// src/components/AudioPlayerDisable.js

import React from 'react';
import { useAudioContext } from '../context/AudioContext';

function AudioPlayerDisable() {
  const { isAudioPlayerDisabled, toggleAudioPlayer } = useAudioContext();

  return (
    <div className="flex mb-4 font-medium items-center justify-between mt-4">
      <label className='text-sm'>Audio Player:</label>
      <button
        onClick={() => toggleAudioPlayer(!isAudioPlayerDisabled)}
        className={`text-sm px-4 py-2 rounded-3xl focus:outline-none ${
          isAudioPlayerDisabled ? 'bg-red-500 text-black' : 'bg-green-500 text-black'
        }`}
      >
        {isAudioPlayerDisabled ? 'OFF' : 'ON'}
      </button>
    </div>
  );
}

export default AudioPlayerDisable;
