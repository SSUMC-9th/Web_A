import { useCallback, useMemo, useState } from 'react';
import MovieDetailModal from '../components/MovieDetailModal';
import MovieFilter from '../components/MovieFilter';
import MovieList from '../components/MovieList';
import useFetch from '../hooks/useFetch';
import type { Movie, MovieFilters, MoviesResponse } from '../types/movie';

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: '어벤져스',
    include_adult: false,
    language: 'ko-KR',
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const axiosRequestConfig = useMemo(
    (): { params: MovieFilters } => ({
      params: filters,
    }),
    [filters],
  );

  const { data, error, isloading } = useFetch<MoviesResponse>('/search/movie', axiosRequestConfig);

  const handleMovieFilters = useCallback(
    (filters: MovieFilters) => {
      setFilters(filters);
    },
    [setFilters],
  );

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            <span className="text-white">Dobby</span>
            <span className="text-indigo-400">Flix</span>
          </h1>
          <p className="text-sm text-neutral-300">TMDB 기반 영화 검색</p>
        </header>

        <section className="mb-10">
          <MovieFilter initialFilters={filters} onChange={handleMovieFilters} />
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">검색 결과</h2>
              <p className="text-sm text-neutral-400">
                키워드:{' '}
                <span className="font-semibold text-neutral-200">
                  {filters.query?.trim() ? filters.query : '—'}
                </span>
              </p>
            </div>
            <div className="text-sm text-neutral-400">
              {data?.results ? `${data.results.length}개` : ''}
            </div>
          </div>

          {isloading ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-neutral-300 backdrop-blur">
              로딩 중입니다...
            </div>
          ) : (
            <MovieList movies={data?.results || []} onMovieClick={handleMovieClick} />
          )}
        </section>
      </div>

      <MovieDetailModal
        isOpen={selectedMovie !== null}
        movie={selectedMovie}
        onClose={handleCloseModal}
      />
    </div>
  );
}

// 검색 필터
// 영화 무비
