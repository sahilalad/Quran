// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import Home from './components/Home';
import SurahTrPage from './components/SurahTrPage';
import Bookmark from './components/Bookmark';
import ArabicReading from './components/ArabicReading'; // Import the ArabicReading component
import ScrollToTop from './components/ScrollToTop'; // Import the ScrollToTop component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReadingProgressProvider } from './contexts/ReadingProgressContext';
import ReadingProgress from './components/stats/ReadingProgress';
import { TranslationProvider } from './contexts/TranslationContext';
import DuaPage from './components/Dua/Duapage';
import DuaCategories from './components/Dua/DuaCategories';
import DuaCategory from './components/Dua/DuaCategory';
import ThirteenLinePage from './components/pages/ThirteenLinePage';


function App() {
  useEffect(() => {
    document.title = 'Quran';
  }, []);

  return (
    <TranslationProvider>
    <ReadingProgressProvider>
      <Router>
        <div className="Quran"> 
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surah/:surahId" element={<SurahTrPage />} />
            <Route path="/bookmarks" element={<Bookmark />} />
            <Route path="/arabicreading/:surahId" element={<ArabicReading />} /> {/* Add the ArabicReading route */}
            <Route path="/progress" element={<ReadingProgress />} />
            <Route path="/duas" element={<DuaPage/>} />
            <Route path="/duacategories" element={<DuaCategories />} />
            <Route path="/duacategories/:category" element={<DuaCategory />} />
            <Route path="/13linepage" element={<ThirteenLinePage />} />
            {/* Redirect route for 15line quran pages */}
            {/* <Route path="/15line" element={
              <Navigate to={`${process.env.PUBLIC_URL}/quranpages.html`} replace />
            } /> */}
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
          <ToastContainer position="top-right" autoClose={2000} />
          {/* Render the ScrollToTop component */}
          <ScrollToTop /> 
        </div>
      </Router>
    </ReadingProgressProvider>
    </TranslationProvider>
  );
}

export default App;