import React from 'react';

const Bookmarked = ({ className }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    className={`fill-current ${className}`}
  >
    {/* Filled Bookmark */}
    <path d="M6 2C4.89 2 4 2.89 4 4v16l8-4 8 4V4c0-1.11-.89-2-2-2H6z" fill="currentColor"/>

    {/* Checkmark Icon */}
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Bookmarked;
