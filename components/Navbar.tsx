import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Bell, User, X, Loader2 } from 'lucide-react';
import { searchMovies, IMAGE_BASE_URL_W500 } from '../services/api';
import { Movie } from '../types';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounce Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        setIsSearching(true);
        try {
          const data = await searchMovies(searchTerm);
          setSuggestions(data.results.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (movieId: number) => {
    setShowSuggestions(false);
    setSearchTerm('');
    setMobileSearchOpen(false);
    navigate(`/movie/${movieId}`);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled || mobileSearchOpen
          ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg border-b border-white/5'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Hide on mobile if search is open */}
          <Link to="/" className={`flex items-center gap-2 group ${mobileSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
            <Film className="w-8 h-8 text-red-600 transition-transform group-hover:rotate-12" />
            <span className="text-2xl font-bold tracking-tighter text-white">
              Cine<span className="text-red-600">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className={`hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300 ${mobileSearchOpen ? 'opacity-0' : 'opacity-100'}`}>
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span className="hover:text-white transition-colors cursor-pointer">Séries</span>
            <span className="hover:text-white transition-colors cursor-pointer">Filmes</span>
            <span className="hover:text-white transition-colors cursor-pointer">Bombando</span>
          </div>

          {/* Right Section: Search & Profile */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            
            {/* Search Container */}
            <div 
                ref={searchRef} 
                className={`${
                    mobileSearchOpen 
                    ? 'flex w-full absolute left-0 px-4 top-2 h-12 bg-zinc-900 z-50 items-center' 
                    : 'relative hidden sm:block'
                }`}
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Títulos, gente, gêneros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus={mobileSearchOpen}
                  className={`
                    bg-black/40 border border-white/10 rounded-full py-1.5 pl-10 pr-10 text-sm text-white placeholder-zinc-400 
                    focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all
                    ${mobileSearchOpen ? 'w-full py-2 bg-zinc-800' : 'w-64'}
                  `}
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                
                {/* Loading Indicator or Clear Button */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isSearching && <Loader2 className="w-3 h-3 text-red-500 animate-spin" />}
                    {mobileSearchOpen && (
                        <button type="button" onClick={() => setMobileSearchOpen(false)}>
                             <X className="w-5 h-5 text-zinc-400" />
                        </button>
                    )}
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className={`
                    absolute left-0 right-0 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden mt-2
                    ${mobileSearchOpen ? 'top-12 mx-4' : 'top-full w-72 -left-4'}
                `}>
                    <div className="max-h-[60vh] overflow-y-auto">
                        {suggestions.map((movie) => (
                            <div
                                key={movie.id}
                                onClick={() => handleSuggestionClick(movie.id)}
                                className="flex items-center gap-3 p-3 hover:bg-zinc-800 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                            >
                                <img 
                                    src={movie.poster_path ? `${IMAGE_BASE_URL_W500}${movie.poster_path}` : 'https://via.placeholder.com/45x68?text=NA'} 
                                    alt={movie.title}
                                    className="w-10 h-14 object-cover rounded bg-zinc-800"
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-white text-sm font-medium truncate">{movie.title}</span>
                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                        <span>{movie.release_date?.split('-')[0] || 'TBA'}</span>
                                        <span className="text-yellow-500 flex items-center gap-0.5">
                                            ★ {movie.vote_average.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={handleSearchSubmit}
                            className="w-full p-3 text-center text-xs font-bold text-red-500 hover:bg-zinc-800 uppercase tracking-wider transition-colors"
                        >
                            Ver todos os resultados
                        </button>
                    </div>
                </div>
              )}
            </div>

            {/* Mobile Search Toggle & Icons */}
            <div className={`flex items-center gap-4 text-zinc-300 ${mobileSearchOpen ? 'hidden' : 'flex'}`}>
              <button 
                className="sm:hidden p-2 -mr-2"
                onClick={() => setMobileSearchOpen(true)}
              >
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