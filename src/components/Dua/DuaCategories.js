// src/components/dua/DuaCategories.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import duasData from './duas.json'; // Adjust the path if needed

// Helper function to create URL-friendly slugs
const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-');

const DuaCategories = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Dua Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {duasData.main.map((category, index) => (
          <Link 
            key={index}
            to={`/duacategories/${slugify(category.category)}`}
            className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-3xl shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <img 
              src={category.image} 
              alt={category.category} 
              className="w-16 h-16 mb-4" 
            />
            <h2 className="text-xl font-semibold dark:text-white">{category.category}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DuaCategories;
