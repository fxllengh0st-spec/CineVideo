import axios from 'axios';

// -----------------------------------------------------------------------------
// CONFIGURATION
// -----------------------------------------------------------------------------
// Replace the string below with your actual TMDB API Key.
// You can get one at https://www.themoviedb.org/settings/api
const API_KEY = "YOUR_TMDB_API_KEY_HERE"; 

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';
export const IMAGE_BASE_URL_W500 = 'https://image.tmdb.org/t/p/w500';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR', // Localized for better UX (or en-US)
  },
});

// Helper to check if key is missing
export const isApiKeyMissing = () => API_KEY === "YOUR_TMDB_API_KEY_HERE";

// -----------------------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------------------

export const getTrendingMovies = async () => {
  const response = await api.get('/trending/movie/week');
  return response.data;
};

export const getTopRatedMovies = async () => {
  const response = await api.get('/movie/top_rated');
  return response.data;
};

export const getUpcomingMovies = async () => {
  const response = await api.get('/movie/upcoming');
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

export const searchMovies = async (query: string) => {
  const response = await api.get('/search/movie', {
    params: {
      query,
    },
  });
  return response.data;
};

export default api;