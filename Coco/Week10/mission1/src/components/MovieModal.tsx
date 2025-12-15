import { Movie } from '../types/movie.types';
import { getImageUrl } from '../api/movieApi';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

function MovieModal({ movie, onClose }: MovieModalProps) {
  if (!movie) return null;

  const handleIMDbSearch = () => {
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* 포스터 */}
          <div className="relative">
            <img
              src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* 정보 */}
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
            {movie.original_title !== movie.title && (
              <p className="text-gray-600 mb-4">{movie.original_title}</p>
            )}

            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span>📅 {movie.release_date}</span>
              <span>🗳️ {movie.vote_count.toLocaleString()} votes</span>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">줄거리</h3>
              <p className="text-gray-700 leading-relaxed">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleIMDbSearch}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                IMDb에서 검색하기
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieModal;