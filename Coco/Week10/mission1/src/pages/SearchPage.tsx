import { useState, useCallback, useEffect } from 'react';
import { Movie, LanguageOption } from '../types/movie.types';
import { getPopularMovies, searchMovies } from '../api/movieApi';
import MovieSearch from '../components/MovieSearch';
import MovieList from '../components/MovieList';
import MovieModal from '../components/MovieModal';

function SearchPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // 초기 로드: 인기 영화
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch (err) {
        setError('영화를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // 검색
  const handleSearch = async (
    query: string,
    includeAdult: boolean,
    language: LanguageOption
  ) => {
    try {
      setLoading(true);
      setError(null);
      const results = await searchMovies({ query, includeAdult, language });
      setMovies(results);
    } catch (err) {
      setError('영화 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {movies.length > 0 ? `총 ${movies.length}개의 영화` : '검색 결과가 없습니다'}
            </h2>
            <MovieList movies={movies} onMovieClick={setSelectedMovie} />
          </>
        )}

        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      </div>
    </div>
  );
}

export default SearchPage;