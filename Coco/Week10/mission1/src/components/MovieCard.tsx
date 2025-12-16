import { memo } from 'react';
import { Movie } from '../types/movie.types';
import { getImageUrl } from '../api/movieApi';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      onClick={() => onClick(movie)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
    >
      <img
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        className="w-full h-96 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
          <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(MovieCard);