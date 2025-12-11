import axios from 'axios';

// -----------------------------------------------------------------------------
// CONFIGURATION
// -----------------------------------------------------------------------------
const API_KEY: string = "f73f3b8c0f5848633785c02154fd2a7c";

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';
export const IMAGE_BASE_URL_W500 = 'https://image.tmdb.org/t/p/w500';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
});

// Key is now hardcoded, so it's never missing in this context
export const isApiKeyMissing = () => false;

// -----------------------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------------------

export const getTrendingMovies = async (page: number = 1) => {
  const response = await api.get('/trending/movie/week', { params: { page } });
  return response.data;
};

export const getTopRatedMovies = async (page: number = 1) => {
  const response = await api.get('/movie/top_rated', { params: { page } });
  return response.data;
};

export const getUpcomingMovies = async (page: number = 1) => {
  const response = await api.get('/movie/upcoming', { params: { page } });
  return response.data;
};

export const getMovieDetails = async (id: string) => {
  const response = await api.get(`/movie/${id}`, {
    params: {
      append_to_response: 'credits,videos,images',
    },
  });
  return response.data;
};

export const searchMovies = async (query: string, page: number = 1) => {
  const response = await api.get('/search/movie', {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

export default api;