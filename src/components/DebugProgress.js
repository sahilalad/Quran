// src/components/DebugProgress.js
import React from 'react';
import { useReadingProgress } from '../contexts/ReadingProgressContext';

function DebugProgress() {
  const { readingProgress } = useReadingProgress();

  return (
    <div className="fixed bottom-4 left-4 bg-white p-2 rounded shadow-lg text-xs">
      <pre>{JSON.stringify(readingProgress, null, 2)}</pre>
    </div>
  );
}

export default DebugProgress; 