import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detect from './pages/Detect';
import History from './pages/History';
import About from './pages/About';
import Resources from './pages/Resources';
import { ScanHistoryItem } from './types';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  // Global state for history to persist across pages during session
  // In a real app, this would use a context or Redux + LocalStorage
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    const saved = localStorage.getItem('veritas_history');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = (item: ScanHistoryItem) => {
    const newHistory = [item, ...history];
    setHistory(newHistory);
    localStorage.setItem('veritas_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('veritas_history');
  };

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen relative overflow-x-hidden text-gray-100 font-sans selection:bg-purple-500 selection:text-white">
        
        {/* Animated Background Elements */}
        <div className="fixed inset-0 z-[-1] bg-darker">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(107,70,193,0.15),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-purple-900/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <Navbar />

        <main className="container mx-auto px-4 py-8 pt-24 min-h-[calc(100vh-80px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect" element={<Detect addToHistory={addToHistory} />} />
            <Route path="/history" element={<History history={history} onClear={clearHistory} />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </main>

        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Veritas AI. Powered by Google Gemini.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;