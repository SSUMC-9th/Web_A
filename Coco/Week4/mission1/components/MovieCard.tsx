import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movies/${movie.id}`)}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="relative overflow-hidden">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Image'
          }
          alt={movie.title}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 평점 배지 */}
        <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <span>⭐</span>
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-base mb-2 line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-500 flex items-center justify-between">
          <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
          <span className="text-xs text-gray-400">
            {movie.vote_count.toLocaleString()} votes
          </span>
        </p>
      </div>
    </div>
  );
}