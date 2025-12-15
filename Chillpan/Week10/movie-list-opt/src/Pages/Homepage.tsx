import useFetch from "../Hooks/useFetch";
import type { MoveFilter, MovieResponse, Movie } from "../types/movie";
import MovieList from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";
import MovieDetailModal from "../components/MovieDetailModal";
import { useState, useMemo, useCallback } from "react";

const Homepage = () => {
  const [filters, setFilters] = useState<MoveFilter>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const axiosRequestConfig = useMemo(
    (): { params: MoveFilter } => ({
      params: filters,
    }),
    [filters]
  );

  const { data, error, loading } = useFetch<MovieResponse>(
    "/search/movie",
    axiosRequestConfig
  );
  //console.log(data);

  const handleMovieFilterChange = useCallback(
    // 최적화 핵심 렌더링 최적화
    (filters: MoveFilter) => {
      setFilters(filters);
    },
    [setFilters]
  );

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  }, []);

  if (error) return <div>Error: {error}</div>;
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <MovieFilter
        onChange={handleMovieFilterChange}
        initialFilters={filters}
      />
      {/* memo + useCallback이 사용되어야 한다. */}
      {loading ? (
        <div>로딩중...</div>
      ) : (
        <MovieList
          movies={data?.results || []}
          onMovieClick={handleMovieClick}
        />
      )}
      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Homepage;
