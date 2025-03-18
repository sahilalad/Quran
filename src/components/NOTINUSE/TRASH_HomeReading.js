// src/components/HomeReading.js
import React, { useState, useEffect } from 'react';
import { axiosGet } from '../utils/api';
import { Link } from 'react-router-dom'; // Import useNavigate and useParams

function HomeReading() {
  const [surahs, setSurahs] = useState([]);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await axiosGet('/surahs'); // Fetch Surah data
        setSurahs(data.surahs);
      } catch (error) {
        console.error('Error fetching Surahs:', error);
      }
    };

    fetchSurahs();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* Grid layout */}
      {surahs.map((surah) => (
        <Link to={`/arabicreading/${surah.surah_id}`} key={surah.surah_id}> {/* Link to Reading page */}
          <div className="surah-box bg-white text-black rounded-3xl flex items-center p-2 border border-gray-500 cursor-pointer
                          hover:bg-teal-400 hover:text-black transition-transform duration-200"> {/* Tailwind classes for surah-box */}
            <div className="surah-details flex items-center w-full"> {/* Tailwind classes for surah-details */}
              <div className="surah-number bg-blue-500 text-white font-bold text-xl rounded-full flex items-center justify-center w-10 h-10 mr-3 shrink-0"> {/* Tailwind classes for surah-number */}
                {surah.surah_number}
              </div>
              <div className="surah-info flex-grow flex flex-col"> {/* Tailwind classes for surah-info */}
                <div className="surah-title text-lg font-bold mb-1"> {/* Tailwind classes for surah-title */}
                  {surah.name_english}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default HomeReading;