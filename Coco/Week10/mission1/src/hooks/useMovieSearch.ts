import { useState } from 'react';
import { Movie, SearchParams } from '../types/movie.types';
import { searchMovies } from '../api/movieApi';

export const useMovieSearch = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (params: SearchParams) => {
    if (!params.query.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchMovies(params);
      setMovies(results);
    } catch (err) {
      setError('영화 검색 중 오류가 발생했습니다.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return { movies, loading, error, search };
};