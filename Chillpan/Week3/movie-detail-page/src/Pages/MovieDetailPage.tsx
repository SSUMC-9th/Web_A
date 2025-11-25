import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { MovieDetail, Credits } from "../types/movie";

export default function MovieDetailPage() {
  // URL에서 영화 ID 추출
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  // 상태 관리
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 영화 데이터 가져오기
  useEffect(() => {
    const fetchMovieData = async () => {
      if (!movieId) {
        setError("영화 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 영화 상세 정보와 출연진 정보를 동시에 가져올까까
        const [movieData, castData] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get(
            // 출연진 정보받아오는 거임!
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);

        setMovieDetail(movieData.data);
        setCredits(castData.data);
      } catch (err) {
        setError("영화 정보를 불러오는데 실패했습니다.");
        console.error("Error fetching movie data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
          <div className="text-white text-xl">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !movieDetail) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="text-red-400 text-xl mb-4">에러가 발생했습니다.</div>
        <div className="text-white text-lg mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  // 감독과 출연진 데이터 가공
  const director = credits?.crew.find((person) => person.job === "Director");
  const mainCast = credits?.cast.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* 네비게이션 */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
      >
        뒤로 가기
      </button>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 영화 포스터 가져오기임*/}
        <img
          src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
          alt={movieDetail.title}
          className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg"
        />

        {/* 영화 기본 정보 */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{movieDetail.title}</h1>

            <div className="flex gap-4 text-lg mb-4">
              <span className="text-yellow-400">
                ★ {movieDetail.vote_average.toFixed(1)}
              </span>
              <span>{new Date(movieDetail.release_date).getFullYear()}</span>
              <span>{movieDetail.runtime}분</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {movieDetail.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-purple-600 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* 줄거리 */}
          <div>
            <h2 className="text-xl font-bold mb-3">줄거리</h2>
            <p className="text-gray-300">
              {movieDetail.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>

          {/* 감독 정보 */}
          {director && (
            <div>
              <h2 className="text-xl font-bold mb-3">감독</h2>
              <div className="flex items-center gap-3">
                {director.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${director.profile_path}`}
                    alt={director.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    ?
                  </div>
                )}
                <span>{director.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 출연진 섹션 */}
      {mainCast.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">출연진</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {mainCast.map((actor) => (
              <div key={actor.id} className="text-center">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full aspect-[3/4] object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                    ?
                  </div>
                )}
                <p className="text-sm font-semibold">{actor.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
