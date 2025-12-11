import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../services/api';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) return;
      setLoading(true);
      // Scroll to top when fetching new page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      try {
        const data = await searchMovies(query, currentPage);
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDB limits to 500 pages
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <motion.div 
      className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      {...({
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { duration: 0.4 }
      } as any)}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Resultados para <span className="text-cyan-400">"{query}"</span>
        </h1>
        <p className="text-zinc-400 mt-2">
            {movies.length > 0 
                ? `Página ${currentPage} de ${totalPages}.` 
                : loading ? 'Pesquisando...' : 'Nenhum filme encontrado.'}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
             {[1,2,3,4,5,6,7,8,9,10].map(i => (
                 <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-md animate-pulse"></div>
             ))}
        </div>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            {...({
              initial: "hidden",
              animate: "visible",
              variants: {
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
              }
            } as any)}
          >
            {movies.map((movie) => (
              <motion.div 
                key={movie.id} 
                {...({
                  variants: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
                } as any)}
              >
                 <MovieCard movie={movie} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-full bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors border border-white/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-zinc-400 font-medium text-sm">
                Página <span className="text-white font-bold">{currentPage}</span> de {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors border border-white/5"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default SearchResults;