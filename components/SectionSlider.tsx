import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { ChevronRight } from 'lucide-react';

// Swiper CSS is loaded in index.html via CDN to avoid bundler issues in this specific environment

interface SectionSliderProps {
  title: string;
  movies: Movie[];
}

const SectionSlider: React.FC<SectionSliderProps> = ({ title, movies }) => {
  return (
    <section className="py-8 pl-4 sm:pl-8 lg:pl-12 overflow-visible relative group/section">
      <div className="flex items-center gap-2 mb-4 group-hover/section:translate-x-1 transition-transform duration-300">
        <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-wide border-l-4 border-red-600 pl-3">
          {title}
        </h2>
        <ChevronRight className="w-5 h-5 text-red-600 opacity-0 group-hover/section:opacity-100 transition-opacity" />
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        slidesPerView={2.2}
        navigation
        breakpoints={{
          640: { slidesPerView: 3.2, spaceBetween: 16 },
          768: { slidesPerView: 4.2, spaceBetween: 16 },
          1024: { slidesPerView: 5.2, spaceBetween: 20 },
          1280: { slidesPerView: 6.2, spaceBetween: 24 },
        }}
        className="!pb-8 !px-1"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SectionSlider;