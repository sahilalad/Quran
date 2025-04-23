import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { axiosGet } from '../../utils/api';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pages = () => {
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [inputPage, setInputPage] = useState('');
  const navigate = useNavigate();

  const pageNumber = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const data = await axiosGet('/pages', { page: pageNumber });
        setPageData(data);
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [pageNumber]);

  const handlePageInput = (e) => {
    setInputPage(e.target.value);
  };

  const goToPage = () => {
    const targetPage = Number(inputPage);
    if (targetPage > 0) {
      navigate(`/pages?page=${targetPage}`);
    }
  };

  const navigateToPreviousPage = () => {
    if (pageNumber > 1) {
      navigate(`/pages?page=${pageNumber - 1}`);
    }
  };

  const navigateToNextPage = () => {
    navigate(`/pages?page=${pageNumber + 1}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If the first line is a surah name, extract it as the header.
  const headerData =
    pageData.length > 0 && pageData[0].line_type === 'surah_name'
      ? pageData[0]
      : null;
  const contentLines = headerData ? pageData.slice(1) : pageData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {headerData && (
        <h1 className="text-2xl font-bold font-SurahNames text-center mb-6 dark:text-gray-100">
          {headerData.surah_number}: {headerData.line_text}
        </h1>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        {contentLines.map((line) => (
          <div 
            key={line.line_number} 
            className={`font-arabic text-2xl my-2 ${line.is_centered ? 'text-center' : 'text-right'} dark:text-teal-400`}
          >
            {line.line_text}
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={navigateToPreviousPage}
          disabled={pageNumber <= 1}
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft className="mr-2" /> Previous
        </button>

        <div className="flex items-center">
          <input
            type="number"
            value={inputPage}
            onChange={handlePageInput}
            placeholder={`Page ${pageNumber}`}
            className="border border-gray-300 rounded-md px-3 py-2 w-24 text-center dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <button
            onClick={goToPage}
            className="ml-2 px-4 py-2 bg-teal-500 text-white rounded-md"
          >
            Go
          </button>
        </div>

        <button
          onClick={navigateToNextPage}
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md"
        >
          Next <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Pages;
