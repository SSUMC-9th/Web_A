import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Movie } from '../types/movie.types';
import { getImageUrl } from '../api/movieApi';

function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_TMDB_BASE_URL}/movie/${movieId}`,
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              language: 'ko-KR',
            },
          }
        );
        setMovie(response.data);
      } catch (err) {
        setError('영화 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetail();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || '영화를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleIMDbSearch = () => {
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            ← 검색으로 돌아가기
          </button>
        </div>
      </div>

      {/* 배경 이미지 */}
      <div className="relative h-96">
        <img
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* 영화 정보 */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex gap-8">
          {/* 포스터 */}
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="w-64 rounded-lg shadow-2xl"
          />

          {/* 정보 */}
          <div className="flex-1 text-white">
            <h1 className="text-5xl font-bold mb-2">{movie.title}</h1>
            {movie.original_title !== movie.title && (
              <p className="text-2xl text-gray-300 mb-4">{movie.original_title}</p>
            )}

            <div className="flex items-center gap-6 mb-6">
              <span className="text-2xl">⭐ {movie.vote_average.toFixed(1)}</span>
              <span className="text-lg">📅 {movie.release_date}</span>
              <span className="text-lg">🗳️ {movie.vote_count.toLocaleString()} votes</span>
            </div>

            <button
              onClick={handleIMDbSearch}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              IMDb에서 검색하기
            </button>
          </div>
        </div>

        {/* 줄거리 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">줄거리</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;