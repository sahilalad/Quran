// src/components/dua/DuaCategories.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import duasData from './duas.json'; // Adjust the path if needed

// Helper function to create URL-friendly slugs
const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-');

const DuaCategories = () => {
  return (
    <div className="container mx-auto p-10 max-w-5xl">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Dua Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {duasData.main.map((category, index) => (
          <Link 
            key={index}
            to={`/duacategories/${slugify(category.category)}`}
            className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl shadow-md pb-2 hover:shadow-lg transition-shadow"
          >
            <img 
              src={category.image} 
              alt={category.category} 
              className="w-full h-30 object-cover rounded-t-l mb-4" 
            />
            <h2 className="text-l font-semibold text-center dark:text-white">{category.category}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DuaCategories;