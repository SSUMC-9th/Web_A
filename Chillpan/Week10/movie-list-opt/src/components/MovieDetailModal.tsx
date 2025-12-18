import type { Movie } from "../types/movie";

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetailModal = ({ movie, isOpen, onClose }: MovieDetailModalProps) => {
  if (!isOpen || !movie) return null;

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropBaseUrl = "https://image.tmdb.org/t/p/w1280";
  const fallbackImage = "http://via.placeholder.com/640x480";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleIMDbSearch = () => {
    window.open(`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-700 hover:text-gray-900 text-2xl font-bold bg-white bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-md"
        >
          ×
        </button>

        {/* Header Image */}
        {movie.backdrop_path && (
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={`${backdropBaseUrl}${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h2>
            {movie.original_title !== movie.title && (
              <p className="text-lg text-gray-600">{movie.original_title}</p>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Poster */}
            <div className="md:col-span-1">
              <img
                src={
                  movie.poster_path
                    ? `${imageBaseUrl}${movie.poster_path}`
                    : fallbackImage
                }
                alt={`${movie.title} 포스터`}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Details */}
            <div className="md:col-span-2 space-y-4">
              {/* Rating */}
              <div>
                <p className="text-gray-900 text-xl font-semibold mb-1">
                  {movie.vote_average.toFixed(1)} ({movie.vote_count} 평가)
                </p>
              </div>

              {/* Release Date */}
              <div>
                <p className="text-gray-600 mb-1">개봉일</p>
                <p className="text-gray-900">{formatDate(movie.release_date)}</p>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">줄거리</h3>
                <p className="text-gray-700 leading-relaxed">{movie.overview || "줄거리 정보가 없습니다."}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleIMDbSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              IMDb에서 검색
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;

