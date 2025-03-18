// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import Home from './components/Home';
import SurahTrPage from './components/SurahTrPage';
import Bookmark from './components/Bookmark';
import ArabicReading from './components/ArabicReading'; // Import the ArabicReading component
import ScrollToTop from './components/ScrollToTop'; // Import the ScrollToTop component


function App() {
  console.log('App component rendered'); // Log when App component renders
  useEffect(() => {
    document.title = 'Quran';
  }, []);

  return (
    <Router>
      <div className="Quran"> 
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:surahId" element={<SurahTrPage />} />
          <Route path="/bookmarks" element={<Bookmark />} />
          <Route path="/ArabicReading/:surahId" element={<ArabicReading />} /> {/* Add the ArabicReading route */}
        </Routes>
                {/* Render the ScrollToTop component */}
                <ScrollToTop /> 
      </div>
    </Router>
  );
}

export default App;