import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const fallbackImage = 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <button
      type="button"
      onClick={() => onClick?.(movie)}
      className="group w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left shadow-md transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
    >
      <div className="relative overflow-hidden">
        <img
          src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage}
          alt={`${movie.title} 포스터`}
          className="aspect-[2/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute right-2 top-2 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-xs font-bold text-white">
          {movie.vote_average.toFixed(1)}
        </div>
      </div>

      <div className="space-y-1 p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-white">{movie.title}</h3>
        <p className="text-xs text-neutral-400">
          {movie.release_date || '개봉일 미상'} · {movie.original_language.toUpperCase()}
        </p>
      </div>
    </button>
  );
};

export default MovieCard;
