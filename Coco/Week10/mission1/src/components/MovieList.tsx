import { Movie } from '../types/movie.types';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

function MovieList({ movies, onMovieClick }: MovieListProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
}

export default MovieList;