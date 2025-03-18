// src/components/dua/DuaCategory.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import duasData from './duas.json';
import DuaCard from './DuaCard';

const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-');

const DuaCategory = () => {
  const { category } = useParams();

  // Find the category object by matching the slug
  const categoryData = duasData.main.find(cat => slugify(cat.category) === category);

  if (!categoryData) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold dark:text-white">Category not found</h2>
        <Link to="/duacategories" className="text-teal-500 hover:underline mt-4 inline-block">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mt-8">
        <Link to="/duacategories" className="text-teal-500 hover:underline">
          ← Back to Categories
        </Link>
      </div>
      <div className="flex items-center mb-6">
        <img 
          src={categoryData.image} 
          alt={categoryData.category} 
          className="w-12 h-12 mr-4" 
        />
        <h1 className="text-4xl font-bold dark:text-white">{categoryData.category}</h1>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {categoryData.duas.map((dua, index) => (
          <DuaCard key={index} dua={dua} />
        ))}
      </div>
    </div>
  );
};

export default DuaCategory;
