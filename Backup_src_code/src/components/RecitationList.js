// src/components/RecitationList.js
import React, { useState, useEffect } from 'react';
import { axiosGet, axiosGetQuranApi } from '../utils/api';

function RecitationList({ selectedRecitation, onRecitationChange }) {
  const [recitations, setRecitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecitations = async () => {
      try {
        const response = await axiosGetQuranApi('/resources/recitations'); // Fetch the recitations
        console.log('Recitations:', response); // Debug API response
        setRecitations(response.recitations); // Set the recitations
      } catch (error) {
        console.error('Error fetching recitations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecitations();
  }, []);

  return (
    <div className="recitation-list">
      <label htmlFor="recitation" className="block text-sm font-medium mb-2">
        Select Reciter:
      </label>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <select
          id="recitation"
          value={selectedRecitation}
          onChange={(e) => onRecitationChange(Number(e.target.value))}
          className="w-full px-3 bg-black py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="" disabled>
            Choose a reciter
          </option>
          {recitations.map((recitation) => (
            <option key={recitation.id} value={recitation.id}>
              {recitation.reciter_name}
              {recitation.style ? ` - ${recitation.style}` : ''}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default RecitationList;
