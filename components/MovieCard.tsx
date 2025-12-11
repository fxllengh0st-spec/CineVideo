import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { IMAGE_BASE_URL_W500 } from '../services/api';
import { Movie } from '../types';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL_W500}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Link to={`/movie/${movie.id}`} className="group block relative">
      <motion.div 
        className="aspect-[2/3] w-full overflow-hidden rounded-md bg-zinc-800 shadow-xl ring-1 ring-white/5"
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          loading="lazy"
        />
        
        {/* Hover Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-sm leading-tight mb-1">{movie.title}</h3>
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span className="flex items-center gap-1 text-yellow-400">
              <Star className="w-3 h-3 fill-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </span>
            <span>{movie.release_date?.split('-')[0]}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;