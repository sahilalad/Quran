// src/components/AudioPlayer.js

import React, { useEffect, useRef } from 'react';
import { useAudioContext } from '../contexts/AudioContext';

function AudioPlayer({ surahId }) {
  const audioRef = useRef(null);
  const { recitationId } = useAudioContext();

  useEffect(() => {
    const fetchAudioSource = async () => {
      try {
        // Construct the API URL
        const audioUrl = `https://api.quran.com/api/v4/chapter_recitations/${recitationId}/${surahId}`;
        console.log('Fetching audio from:', audioUrl); // Debug log

        // Make the API request
        const response = await fetch(audioUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log

        // Ensure audio file exists in the response
        if (data.audio_file && data.audio_file.audio_url) {
          audioRef.current.src = data.audio_file.audio_url;
          console.log('Audio URL set to:', data.audio_file.audio_url); // Debug log
        } else {
          throw new Error('Audio file URL not found in the API response');
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    if (recitationId && surahId) {
      fetchAudioSource();
    }
  }, [surahId, recitationId]);

  return (
    <div className="sticky-audio-player w-full bg-gray-100 transition-opacity duration-300">
      <audio
        ref={audioRef}
        controls
        style={{ width: '100%' }}
        onError={() => console.error('Error loading audio file.')}
      />
    </div>
  );
}

export default AudioPlayer;
