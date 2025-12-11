import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionSliderProps {
  title: string;
  movies: Movie[];
  categoryPath: string;
}

const SectionSlider: React.FC<SectionSliderProps> = ({ title, movies, categoryPath }) => {
  // Se não houver filmes, não renderiza a seção
  if (!movies || movies.length === 0) return null;

  // Limita a 10 filmes
  const displayMovies = movies.slice(0, 10);

  return (
    <section className="py-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header da Seção */}
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide border-l-4 border-red-600 pl-3">
          {title}
        </h2>
        
        <Link 
          to={categoryPath}
          className="group flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Ver tudo
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid Layout (Substituindo o Carrossel) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
        {displayMovies.map((movie, index) => (
            <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
            >
                <MovieCard movie={movie} />
            </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SectionSlider;