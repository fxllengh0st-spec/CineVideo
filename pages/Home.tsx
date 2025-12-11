import React, { useEffect, useState } from 'react';
import { getTrendingMovies, getTopRatedMovies, getUpcomingMovies, isApiKeyMissing } from '../services/api';
import { Movie } from '../types';
import HeroSection from '../components/HeroSection';
import SectionSlider from '../components/SectionSlider';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (isApiKeyMissing()) {
          throw new Error("API Key is missing. Please configure it in services/api.ts");
        }

        const [trendingData, topRatedData, upcomingData] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ]);

        setTrending(trendingData.results);
        setTopRated(topRatedData.results);
        setUpcoming(upcomingData.results);
      } catch (err: any) {
        console.error("Failed to fetch movies:", err);
        setError(err.message || "Something went wrong fetching movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <div className="h-[80vh] w-full bg-zinc-900 animate-pulse" />
        <div className="p-8 space-y-8">
            <div className="h-8 w-48 bg-zinc-900 rounded animate-pulse" />
            <div className="flex gap-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-64 w-40 bg-zinc-900 rounded animate-pulse" />)}
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center px-4">
        <h2 className="text-3xl font-bold text-red-600">Erro na conexão</h2>
        <p className="text-zinc-400 max-w-md">{error}</p>
      </div>
    );
  }

  // Pick a random movie from trending for the Hero
  const heroMovie = trending.length > 0 
    ? trending[Math.floor(Math.random() * Math.min(10, trending.length))] 
    : null;

  return (
    <motion.div 
      className="pb-20"
      {...({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5 }
      } as any)}
    >
      <HeroSection movie={heroMovie} />
      
      <div className="-mt-20 relative z-10 space-y-4 pb-10">
        <SectionSlider 
            title="Em Alta nesta Semana" 
            movies={trending} 
            categoryPath="/category/trending"
        />
        <SectionSlider 
            title="Aclamados pela Crítica" 
            movies={topRated} 
            categoryPath="/category/top_rated"
        />
        <SectionSlider 
            title="Chegando aos Cinemas" 
            movies={upcoming} 
            categoryPath="/category/upcoming"
        />
      </div>
    </motion.div>
  );
};

export default Home;