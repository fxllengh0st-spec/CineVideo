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
  const [imageError, setImageError] = React.useState(false);

  const posterUrl = !imageError && movie.poster_path
    ? `${IMAGE_BASE_URL_W500}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/18181b/a1a1aa?text=Sem+Imagem';

  return (
    <Link to={`/movie/${movie.id}`} className="group block relative w-full h-full">
      <motion.div 
        className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900 shadow-lg ring-1 ring-white/10 relative"
        {...({
          whileHover: { scale: 1.05, y: -5, zIndex: 10 },
          transition: { duration: 0.3, ease: "easeOut" }
        } as any)}
      >
        <img
          src={posterUrl}
          alt={movie.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60"
          loading="lazy"
        />
        
        {/* Hover Overlay Info - Gradient mais suave */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 translate-y-4 group-hover:translate-y-0">
          <h3 className="text-white font-bold text-sm leading-tight mb-2 line-clamp-2">{movie.title}</h3>
          
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span className="flex items-center gap-1 text-yellow-500 font-medium bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <Star className="w-3 h-3 fill-yellow-500" />
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="font-medium">{movie.release_date?.split('-')[0] || 'TBA'}</span>
          </div>
          
          <div className="w-full mt-3 py-1.5 bg-red-600 text-white text-xs font-bold text-center rounded opacity-0 group-hover:opacity-100 transition-delay-100">
            Assistir Agora
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;