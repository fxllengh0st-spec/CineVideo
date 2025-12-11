import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrendingMovies, getTopRatedMovies, getUpcomingMovies, getGenres } from '../services/api';
import { Movie, Genre } from '../types';
import MovieCard from '../components/MovieCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Filter, Calendar, X } from 'lucide-react';

// Move configuration outside component to ensure reference stability
const categoryConfig: Record<string, { title: string; fetcher: (page: number) => Promise<any> }> = {
  trending: {
      title: "Em Alta nesta Semana",
      fetcher: getTrendingMovies
  },
  top_rated: {
      title: "Aclamados pela Crítica",
      fetcher: getTopRatedMovies
  },
  upcoming: {
      title: "Chegando aos Cinemas",
      fetcher: getUpcomingMovies
  }
};

const CategoryPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filter States
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const currentCategory = type && categoryConfig[type] ? categoryConfig[type] : null;

  // Generate years list (Current year back to 1980)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsList = [];
    for (let i = currentYear; i >= 1980; i--) {
        yearsList.push(i);
    }
    return yearsList;
  }, []);

  useEffect(() => {
    // Reset page and filters when type changes
    setCurrentPage(1);
    setSelectedGenre('');
    setSelectedYear('');
  }, [type]);

  // Fetch Genres once
  useEffect(() => {
    const fetchGenres = async () => {
        try {
            const data = await getGenres();
            setGenres(data.genres);
        } catch (error) {
            console.error("Failed to fetch genres", error);
        }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentCategory) return;

      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      try {
        const data = await currentCategory.fetcher(currentPage);
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500));
      } catch (error) {
        console.error("Category fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, currentPage, currentCategory]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Filter Logic (Client Side for current page)
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
        // Filter by Genre
        const genreMatch = selectedGenre 
            ? movie.genre_ids?.includes(Number(selectedGenre)) 
            : true;
        
        // Filter by Year
        const yearMatch = selectedYear 
            ? movie.release_date?.startsWith(selectedYear) 
            : true;

        return genreMatch && yearMatch;
    });
  }, [movies, selectedGenre, selectedYear]);

  if (!currentCategory) {
      return (
          <div className="min-h-screen pt-24 flex items-center justify-center">
              <p className="text-zinc-500">Categoria não encontrada.</p>
          </div>
      );
  }

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
      <div className="mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-4 mb-2">
            <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-white/5"
                title="Voltar"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-white">
                {currentCategory.title}
            </h1>
        </div>
        <p className="text-zinc-400 pl-14">
            Catálogo completo • Página {currentPage} de {totalPages}
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900/50 rounded-lg border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-zinc-400 min-w-fit">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">Filtrar por:</span>
        </div>

        <div className="flex flex-1 flex-wrap gap-4">
            {/* Genre Select */}
            <div className="relative group">
                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="appearance-none bg-zinc-950 border border-zinc-700 text-zinc-200 text-sm rounded-md px-4 py-2 pr-8 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer min-w-[160px]"
                >
                    <option value="">Todos os Gêneros</option>
                    {genres.map(genre => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            {/* Year Select */}
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" />
                </div>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none bg-zinc-950 border border-zinc-700 text-zinc-200 text-sm rounded-md px-4 py-2 pl-9 pr-8 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer min-w-[140px]"
                >
                    <option value="">Todos os Anos</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            {/* Clear Filters */}
            {(selectedGenre || selectedYear) && (
                <button
                    onClick={() => { setSelectedGenre(''); setSelectedYear(''); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors"
                >
                    <X className="w-4 h-4" />
                    Limpar Filtros
                </button>
            )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
             {[1,2,3,4,5,6,7,8,9,10].map(i => (
                 <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-md animate-pulse"></div>
             ))}
        </div>
      ) : (
        <>
          {filteredMovies.length === 0 ? (
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
             >
                <div className="bg-zinc-900/50 p-6 rounded-full mb-4">
                    <Filter className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum filme encontrado</h3>
                <p className="text-zinc-400 max-w-md mx-auto">
                    Não encontramos filmes nesta página que correspondam aos filtros selecionados.
                    <br />
                    <span className="text-sm text-zinc-500 mt-2 block">(Tente navegar para outra página ou limpar os filtros)</span>
                </p>
                <button
                    onClick={() => { setSelectedGenre(''); setSelectedYear(''); }}
                    className="mt-6 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors font-medium"
                >
                    Limpar Filtros
                </button>
             </motion.div>
          ) : (
            <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                layout // Enables smooth layout transitions when items are filtered
            >
                <AnimatePresence>
                {filteredMovies.map((movie) => (
                <motion.div 
                    key={movie.id} 
                    {...({
                        layout: true,
                        initial: { opacity: 0, scale: 0.9 },
                        animate: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.9 },
                        transition: { duration: 0.3 }
                    } as any)}
                >
                    <MovieCard movie={movie} />
                </motion.div>
                ))}
                </AnimatePresence>
            </motion.div>
          )}

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
                Página <span className="text-white font-bold">{currentPage}</span>
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

export default CategoryPage;