// src/components/dua/DuaPage.jsx
import React from 'react';
import duasData from './duas.json'; // adjust path as needed
import DuaCard from './DuaCard';

const DuaPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Duas</h1>
      {duasData.main.map((categoryItem, index) => (
        <div key={index} className="mb-10">
          <div className="flex items-center mb-4">
            <img
              src={categoryItem.image}
              alt={categoryItem.category}
              className="w-40 h-25 mr-4"
            />
            <h2 className="text-2xl font-semibold dark:text-white">
              {categoryItem.category}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {categoryItem.duas.map((dua, idx) => (
              <DuaCard key={idx} dua={dua} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DuaPage;
