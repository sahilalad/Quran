import React from 'react';

const BookmarkAdd = ({ className }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    className={`fill-current ${className}`}
  >
    {/* Outline Bookmark */}
    <path d="M6 2C4.89 2 4 2.89 4 4v16l8-4 8 4V4c0-1.11-.89-2-2-2H6z" fill="none" stroke="currentColor" strokeWidth="2"/>

    {/* Plus Icon */}
    <path d="M12 8v4m-2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default BookmarkAdd;
