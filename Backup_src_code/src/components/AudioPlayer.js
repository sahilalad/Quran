// src/components/AudioPlayer.js

import React, { useEffect, useRef } from 'react';
import { useAudioContext } from '../context/AudioContext';

function AudioPlayer({ surahId }) {
  const audioRef = useRef(null);
  const { recitationId } = useAudioContext();

  useEffect(() => {
    const fetchAudioSource = async () => {
      try {
        const audioUrl = `https://api.quran.com/api/v4/chapter_recitations/${recitationId}/${surahId}`;
        const response = await fetch(audioUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (audioRef.current) {
          audioRef.current.src = data.audio_file.audio_url;
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    if (recitationId) {
      fetchAudioSource();
    }
  }, [surahId, recitationId]);

  return (
    <div className="sticky-audio-player w-full">
      <audio ref={audioRef} controls style={{ width: '100%' }} />
    </div>
  );
}

export default AudioPlayer;
