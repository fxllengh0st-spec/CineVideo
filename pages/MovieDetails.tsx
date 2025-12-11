import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, IMAGE_BASE_URL_ORIGINAL, IMAGE_BASE_URL_W500 } from '../services/api';
import { Movie } from '../types';
import { Star, Clock, Calendar, ArrowLeft, Share2, Check, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        document.title = `${data.title} | CineVerse`; // Título dinâmico
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    
    // Cleanup title on unmount
    return () => {
        document.title = 'CineVerse - Discover Your Next Story';
    };
  }, [id]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

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
    <motion.div 
      className="min-h-screen bg-zinc-950 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Player Modal Overlay */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <div className="w-full max-w-7xl aspect-video bg-black relative shadow-2xl rounded-xl overflow-hidden ring-1 ring-white/10">
              <button 
                onClick={() => setShowPlayer(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-600 rounded-full text-white transition-all transform hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe
                src={`https://vidsrc-embed.ru/embed/movie?tmdb=${movie.id}&autoplay=1`}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                title={`Player: ${movie.title}`}
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop Header */}
      <motion.div className="relative h-[60vh] sm:h-[70vh] w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <div className="absolute inset-0">
            <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        
        <Link to="/" className="absolute top-24 left-4 sm:left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-medium">Voltar</span>
        </Link>
      </motion.div>

      {/* Main Content Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-60 sm:-mt-80 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* Poster */}
            <motion.div 
              className="flex-shrink-0 mx-auto md:mx-0 w-64 sm:w-80 shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10 bg-zinc-900"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
                <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </motion.div>

            {/* Info */}
            <div className="flex-1 pt-4 md:pt-20 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">{movie.title}</motion.h1>
                </div>
                
                <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-300 mb-6 mt-2">
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
                </motion.div>

                {/* Genres */}
                <motion.div variants={itemVariants} className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                    {movie.genres?.map(genre => (
                        <span key={genre.id} className="text-xs font-medium text-white/80 bg-white/10 border border-white/5 px-3 py-1 rounded-full">
                            {genre.name}
                        </span>
                    ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-8">
                    <button 
                        onClick={() => setShowPlayer(true)}
                        className="flex items-center gap-3 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-all transform hover:scale-105 shadow-lg shadow-red-900/20 w-full sm:w-auto justify-center"
                    >
                        <Play className="w-5 h-5 fill-white" />
                        Assistir Filme
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md text-white font-medium transition-colors backdrop-blur-md w-full sm:w-auto justify-center"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                        {copied ? 'Link Copiado!' : 'Compartilhar'}
                    </button>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4 max-w-3xl">
                    <h3 className="text-xl font-semibold text-white">Sinopse</h3>
                    <p className="text-zinc-300 leading-relaxed text-lg">{movie.overview || "Nenhuma sinopse disponível."}</p>
                </motion.div>
            </div>
        </div>

        {/* Cast Section */}
        <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-600 pl-3">Elenco Principal</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movie.credits?.cast.slice(0, 12).map((actor, index) => (
                    <motion.div 
                      key={actor.id} 
                      className="bg-zinc-900 rounded-lg overflow-hidden group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
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
                    </motion.div>
                ))}
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MovieDetails;