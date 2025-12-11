import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Bell, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-zinc-950/90 backdrop-blur-md shadow-lg border-b border-white/5'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Film className="w-8 h-8 text-red-600 transition-transform group-hover:rotate-12" />
            <span className="text-2xl font-bold tracking-tighter text-white">
              Cine<span className="text-red-600">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav Links (Visual Only) */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span className="hover:text-white transition-colors cursor-pointer">Séries</span>
            <span className="hover:text-white transition-colors cursor-pointer">Filmes</span>
            <span className="hover:text-white transition-colors cursor-pointer">Bombando</span>
          </div>

          {/* Right Section: Search & Profile */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Títulos, gente, gêneros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all w-64"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex items-center gap-4 text-zinc-300">
              <button className="sm:hidden">
                 <Search className="w-5 h-5 hover:text-white" />
              </button>
              <Bell className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center text-white font-bold text-xs cursor-pointer border border-white/20">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;