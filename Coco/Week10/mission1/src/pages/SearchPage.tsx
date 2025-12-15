import { useState, useCallback, useMemo } from 'react';
import { Movie, LanguageOption } from '../types/movie.types';
import { useMovieSearch } from '../hooks/useMovieSearch';
import MovieSearch from '../components/MovieSearch';
import MovieList from '../components/MovieList';
import MovieModal from '../components/MovieModal';

function SearchPage() {
  console.log('🟢 SearchPage 렌더링'); // 최적화 후 확인
  
  const { movies, loading, error, search } = useMovieSearch();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // ✅ useCallback: 함수 참조 고정
  const handleSearch = useCallback((
    query: string,
    includeAdult: boolean,
    language: LanguageOption
  ) => {
    search({ query, includeAdult, language });
  }, [search]);

  // ✅ useCallback: 함수 참조 고정
  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  // ✅ useCallback: 함수 참조 고정
  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // ✅ useMemo: 계산 비용이 큰 값 메모이제이션
  const movieCount = useMemo(() => {
    console.log('🔵 영화 개수 계산');
    return movies.length;
  }, [movies]);

  // ✅ useMemo: 평균 평점 계산 (비용이 큰 연산 예시)
  const averageRating = useMemo(() => {
    if (movies.length === 0) return 0;
    console.log('🔵 평균 평점 계산');
    const sum = movies.reduce((acc, movie) => acc + movie.vote_average, 0);
    return (sum / movies.length).toFixed(2);
  }, [movies]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">🎬 영화 검색</h1>

        <MovieSearch onSearch={handleSearch} loading={loading} />

        {/* 통계 정보 표시 (useMemo 활용) */}
        {movies.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4 flex justify-between">
            <span>총 {movieCount}개의 영화</span>
            <span>평균 평점: ⭐ {averageRating}</span>
          </div>
        )}

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
