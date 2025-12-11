import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { IMAGE_BASE_URL_W500 } from '../services/api';
import { Movie } from '../types';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const posterUrl = !imageError && movie.poster_path
    ? `${IMAGE_BASE_URL_W500}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/18181b/a1a1aa?text=Sem+Imagem';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once visible to save resources
          }
        });
      },
      {
        rootMargin: '100px', // Preload images 100px before they appear
        threshold: 0.01,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Link to={`/movie/${movie.id}`} className="group block relative w-full h-full">
      <motion.div 
        ref={cardRef}
        className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900 shadow-lg ring-1 ring-white/10 relative"
        {...({
          whileHover: { scale: 1.05, y: -5, zIndex: 10 },
          transition: { duration: 0.3, ease: "easeOut" }
        } as any)}
      >
        {/* Placeholder / Skeleton Loader */}
        <div 
            className={`absolute inset-0 bg-zinc-800 animate-pulse transition-opacity duration-500 z-0 ${
                isLoaded ? 'opacity-0' : 'opacity-100'
            }`} 
        />

        {isVisible && (
            <img
            src={posterUrl}
            alt={movie.title}
            onError={() => setImageError(true)}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-40 relative z-10 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            />
        )}
        
        {/* Hover Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 translate-y-4 group-hover:translate-y-0 z-20">
          <h3 className="text-white font-bold text-sm leading-tight mb-2 line-clamp-2 drop-shadow-md">{movie.title}</h3>
          
          <div className="flex items-center justify-between text-xs text-zinc-300 mb-3">
            <span className="flex items-center gap-1 text-yellow-500 font-medium bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
              <Star className="w-3 h-3 fill-yellow-500" />
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="font-medium bg-black/30 px-2 py-0.5 rounded border border-white/5">
                {movie.release_date?.split('-')[0] || 'TBA'}
            </span>
          </div>

          <p className="text-[11px] text-zinc-300 line-clamp-3 mb-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
            {movie.overview || "Sinopse não disponível."}
          </p>
          
          <div className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold text-center rounded transition-colors shadow-lg shadow-cyan-900/50">
            Assistir Agora
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;