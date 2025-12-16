import { useState, useCallback } from 'react';
import { Movie, LanguageOption } from '../types/movie.types';
import { useMovieSearch } from '../hooks/useMovieSearch';
import MovieSearch from '../components/MovieSearch';
import MovieList from '../components/MovieList';
import MovieModal from '../components/MovieModal';

function SearchPage() {
  const { movies, loading, error, search } = useMovieSearch();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = useCallback((
    query: string,
    includeAdult: boolean,
    language: LanguageOption
  ) => {
    search({ query, includeAdult, language });
  }, [search]);

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">🎬 영화 검색</h1>

        <MovieSearch onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">검색 중...</p>
          </div>
        ) : (
          <MovieList movies={movies} onMovieClick={handleMovieClick} />
        )}

        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      </div>
    </div>
  );
}

export default SearchPage;