import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { IMAGE_BASE_URL_ORIGINAL } from '../services/api';
import { Movie } from '../types';

interface HeroSectionProps {
  movie: Movie | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  if (!movie) {
    return (
      <div className="h-[80vh] w-full bg-zinc-900 animate-pulse flex items-center justify-center">
        <span className="text-zinc-700 font-bold text-2xl">Carregando Destaque...</span>
      </div>
    );
  }

  const backgroundUrl = movie.backdrop_path 
    ? `${IMAGE_BASE_URL_ORIGINAL}${movie.backdrop_path}` 
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop';

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent bottom-0 h-full" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <div className="max-w-2xl space-y-6 animate-fade-in-up">
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight drop-shadow-lg">
              {movie.title}
            </h1>
            
            <div className="flex items-center gap-3 text-sm font-medium text-green-400">
              <span className="border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded">
                {Math.round(movie.vote_average * 10)}% Relevância
              </span>
              <span className="text-zinc-300">{movie.release_date?.split('-')[0]}</span>
            </div>

            <p className="text-zinc-300 text-lg sm:text-xl line-clamp-3 leading-relaxed drop-shadow-md max-w-xl">
              {movie.overview}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Link 
                to={`/movie/${movie.id}`}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded font-bold hover:bg-zinc-200 transition-colors"
              >
                <Play className="w-5 h-5 fill-black" />
                Assistir
              </Link>
              <Link
                to={`/movie/${movie.id}`}
                className="flex items-center gap-2 bg-zinc-600/80 backdrop-blur-sm text-white px-6 py-3 rounded font-bold hover:bg-zinc-600 transition-colors"
              >
                <Info className="w-5 h-5" />
                Mais Informações
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;