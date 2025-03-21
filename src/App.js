// src/App.js
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import { TranslationProvider } from './contexts/TranslationContext';
import DuaPage from './components/Dua/Duapage';
import DuaCategories from './components/Dua/DuaCategories';
import DuaCategory from './components/Dua/DuaCategory';
import { ReadingProgressProvider } from './contexts/ReadingProgressContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./components/Home'));
const SurahTrPage = lazy(() => import('./components/SurahTrPage'));
const Bookmark = lazy(() => import('./components/Bookmark'));
const ArabicReading = lazy(() => import('./components/ArabicReading'));
const ReadingProgress = lazy(() => import('./components/stats/ReadingProgress'));

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
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/surah/:surahId" element={<SurahTrPage />} />
                <Route path="/bookmarks" element={<Bookmark />} />
                <Route path="/arabicreading/:surahId" element={<ArabicReading />} />
                <Route path="/progress" element={<ReadingProgress />} />
                <Route path="/duas" element={<DuaPage />} />
                <Route path="/duacategories" element={<DuaCategories />} />
                <Route path="/duacategories/:category" element={<DuaCategory />} />
                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
            </Suspense>
            <ToastContainer position="top-right" autoClose={2000} />
            <ScrollToTop /> 
          </div>
        </Router>
      </ReadingProgressProvider>
    </TranslationProvider>
  );
}

export default App;