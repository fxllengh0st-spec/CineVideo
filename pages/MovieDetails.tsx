import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, IMAGE_BASE_URL_ORIGINAL, IMAGE_BASE_URL_W500 } from '../services/api';
import { Movie } from '../types';
import { Star, Clock, Calendar, ArrowLeft } from 'lucide-react';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-zinc-500">Carregando detalhes...</div>;
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Filme não encontrado.</div>;
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL_ORIGINAL}${movie.backdrop_path}`
    : 'https://via.placeholder.com/1920x1080?text=No+Backdrop';

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL_W500}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Backdrop Header */}
      <div className="relative h-[60vh] sm:h-[70vh] w-full">
        <div className="absolute inset-0">
            <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        
        <Link to="/" className="absolute top-24 left-4 sm:left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-medium">Voltar</span>
        </Link>
      </div>

      {/* Main Content Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-60 sm:-mt-80 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0 w-64 sm:w-80 shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10 bg-zinc-900">
                <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 pt-4 md:pt-20 text-center md:text-left">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-300 mb-6">
                    <span className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {movie.release_date?.split('-')[0]}
                    </span>
                    {movie.runtime && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                        </span>
                    )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                    {movie.genres?.map(genre => (
                        <span key={genre.id} className="text-xs font-medium text-white/80 bg-white/10 border border-white/5 px-3 py-1 rounded-full">
                            {genre.name}
                        </span>
                    ))}
                </div>

                <div className="space-y-4 max-w-3xl">
                    <h3 className="text-xl font-semibold text-white">Sinopse</h3>
                    <p className="text-zinc-300 leading-relaxed text-lg">{movie.overview || "Nenhuma sinopse disponível."}</p>
                </div>
            </div>
        </div>

        {/* Cast Section */}
        <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-600 pl-3">Elenco Principal</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movie.credits?.cast.slice(0, 12).map((actor) => (
                    <div key={actor.id} className="bg-zinc-900 rounded-lg overflow-hidden group">
                        <div className="aspect-[2/3] overflow-hidden">
                            {actor.profile_path ? (
                                <img 
                                    src={`${IMAGE_BASE_URL_W500}${actor.profile_path}`} 
                                    alt={actor.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                    <span className="text-zinc-600 text-xs">Sem foto</span>
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <p className="text-white font-medium text-sm truncate">{actor.name}</p>
                            <p className="text-zinc-400 text-xs truncate">{actor.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;