import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/api';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchMovies(query);
        setMovies(data.results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <motion.div 
      className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Resultados para <span className="text-red-500">"{query}"</span>
        </h1>
        <p className="text-zinc-400 mt-2">
            {movies.length > 0 
                ? `Encontramos ${movies.length} títulos correspondentes.` 
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
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
        >
          {movies.map((movie) => (
            <motion.div key={movie.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
               <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchResults;