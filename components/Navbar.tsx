import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScanEye, Home, History, Info, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={18} /> },
    { label: 'Detect', path: '/detect', icon: <ScanEye size={18} /> },
    { label: 'History', path: '/history', icon: <History size={18} /> },
    { label: 'Resources', path: '/resources', icon: <BookOpen size={18} /> },
    { label: 'About', path: '/about', icon: <Info size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-darker/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(107,70,193,0.5)] transition-shadow">
            <ScanEye className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-purple-300 group-hover:to-cyan-300 transition-all">
            Veritas AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-primary/20 text-cyan-300 border border-primary/30 shadow-[0_0_10px_rgba(107,70,193,0.2)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Nav Toggle (Simplified for this demo, usually would have a hamburger menu) */}
        <div className="md:hidden">
          <Link to="/detect" className="bg-primary text-white p-2 rounded-lg">
             <ScanEye size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;