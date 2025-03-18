import React, { useState, useEffect } from 'react';
import { axiosGet, axiosGetQuranApi } from '../utils/api';
import { FaSpinner } from "react-icons/fa"; // React Icons for LoadingSpinner

function RecitationList({ selectedRecitation, onRecitationChange }) {
  const [recitations, setRecitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecitations = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const response = await axiosGetQuranApi('/resources/recitations'); // Fetch the recitations
        console.log('Recitations:', response); // Debug API response

        // Filter out recitations with IDs 9, 10, 11, and 12
        const filteredRecitations = response.recitations.filter(
          (recitation) => ![9, 10, 11, 12].includes(recitation.id)
        );

        setRecitations(filteredRecitations); // Set the filtered recitations
      } catch (error) {
        console.error('Error fetching recitations:', error);
        setError('Failed to load recitations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecitations();
  }, []);

  return (
    <div className="recitation-list mb-4">
      <label htmlFor="recitation" className="block text-sm font-medium mb-2">
        Select Reciter:
      </label>

      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="flex justify-center items-center">  {/* Parent container */}
          <FaSpinner className="w-6 h-6 min-h-1px text-center animate-spin text-gray-500 dark:text-gray-400" />
        </div>
        </div>
      ) : error ? (
        <div className="text-red-500">
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              // Retry fetching recitations
              const fetchRecitations = async () => {
                try {
                  const response = await axiosGetQuranApi('/resources/recitations');
                  // Filter out recitations with IDs 9, 10, 11, and 12
                  const filteredRecitations = response.recitations.filter(
                    (recitation) => ![9, 10, 11, 12].includes(recitation.id)
                  );
                  setRecitations(filteredRecitations || []);
                } catch (err) {
                  setError('Failed to load recitations. Please try again.');
                } finally {
                  setLoading(false);
                }
              };
              fetchRecitations();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-3xl mt-2"
          >
            Retry
          </button>
        </div>
      ) : recitations.length === 0 ? (
        <p>No recitations available at the moment.</p>
      ) : (
        <select
          id="recitation"
          aria-label="Select a reciter"
          value={selectedRecitation || ''}
          onChange={(e) => onRecitationChange(Number(e.target.value))}
          className="w-full bg-black px-3 py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
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