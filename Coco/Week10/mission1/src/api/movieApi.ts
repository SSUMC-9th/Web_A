import axios from 'axios';
import { Movie, SearchParams } from '../types/movie.types';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const searchMovies = async (params: SearchParams): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: params.query,
        include_adult: params.includeAdult,
        language: params.language,
        page: 1,
      },
    });
    
    return response.data.results;
  } catch (error) {
    console.error('영화 검색 에러:', error);
    throw error;
  }
};

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}/${size}${path}`;
};