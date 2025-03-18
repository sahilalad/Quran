// src/components/loading.js
import React from 'react';

const LoadingSpinner = ({ variant = 'page' }) => {
  // Define styles based on the variant
  const spinnerStyles = variant === 'ayah'
    ? "w-4 h-4 border-2 border-t-transparent border-gray-900 dark:border-white rounded-full animate-spin"
    : "w-5 h-5 border-4 border-t-transparent border-gray-900 dark:border-white rounded-full animate-spin";

  const containerStyles = variant === 'ayah'
    ? "flex justify-center items-center min-h-1px"
    : "flex justify-center items-center min-h-screen";

  return (
    <div className={containerStyles}>
      <div
        className={spinnerStyles}
        aria-label="Loading"
      ></div>
    </div>
  );
};

export default LoadingSpinner;