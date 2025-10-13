import { useParams, useNavigate } from "react-router-dom";
import type { MovieDetailResponse } from "../types/movieDetail";
import {LoadingSpinner} from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: movie, loading, error, refetch } = useCustomFetch<MovieDetailResponse>({
    url: `https://api.themoviedb.org/3/movie/${id}`,
    params: {
      language: 'ko-KR',
    },
    enabled: !!id,
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">영화 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">영화를 찾을 수 없습니다</h2>
          <p className="text-red-500 mb-6">{error || '영화 정보를 불러오는데 실패했습니다.'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={refetch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              다시 시도
            </button>
            <button
              onClick={() => navigate('/movies')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              영화 목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* 백드롭 배경 */}
      {movie.backdrop_path && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900" />
        </div>
      )}

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/movies')}
          className="group flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-lg mb-8 transition-all duration-200 border border-white/20"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span>뒤로가기</span>
        </button>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <div className="lg:flex">
            {/* 포스터 섹션 */}
            <div className="lg:w-2/5 p-8">
              <div className="relative group">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
            </div>

            {/* 정보 섹션 */}
            <div className="lg:w-3/5 p-8 text-white">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-gray-300 italic text-lg mb-6 border-l-4 border-blue-400 pl-4">
                  "{movie.tagline}"
                </p>
              )}

              {/* 평점 및 기본 정보 */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2 shadow-lg">
                  <span>⭐</span>
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  📅 {movie.release_date}
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  ⏱️ {movie.runtime}분
                </div>
                {movie.vote_count > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    👥 {movie.vote_count.toLocaleString()} votes
                  </div>
                )}
              </div>

              {/* 장르 */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span>🎭</span>
                  <span>장르</span>
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 줄거리 */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span>📖</span>
                  <span>줄거리</span>
                </h2>
                <p className="text-gray-300 leading-relaxed text-base bg-white/5 p-4 rounded-lg border border-white/10">
                  {movie.overview || '줄거리 정보가 없습니다.'}
                </p>
              </div>

              {/* 제작비 및 수익 */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {movie.budget > 0 && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">💰 제작비</div>
                      <div className="text-xl font-bold text-green-400">
                        ${movie.budget.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">💵 수익</div>
                      <div className="text-xl font-bold text-blue-400">
                        ${movie.revenue.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 추가 정보 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {movie.status && (
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-gray-400">상태:</span>
                    <span className="ml-2 font-medium">{movie.status}</span>
                  </div>
                )}
                {movie.original_language && (
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-gray-400">원어:</span>
                    <span className="ml-2 font-medium uppercase">{movie.original_language}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;