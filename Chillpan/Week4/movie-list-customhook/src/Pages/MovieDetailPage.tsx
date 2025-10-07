import { useParams, useNavigate } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  // 커스텀 훅 사용
  const {
    data: movieData,
    loading: movieLoading,
    error: movieError,
    refetch: refetchMovie, //-> 커스텀 훅에서 refetch 실행
  } = useCustomFetch(
    movieId
      ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
      : ""
  );

  const {
    data: creditsData,
    loading: creditsLoading,
    error: creditsError,
    refetch: refetchCredits, // -> 커스텀 훅에서 refetch 실행
  } = useCustomFetch(
    movieId
      ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
      : ""
  );
  //여기까지

  //커스텀 훅을 사용해 로딩 상태 관리
  const loading = movieLoading || creditsLoading; // 로딩도 커스텀 훅에서 가져옴
  const error =
    movieError || creditsError || (!movieId ? "영화 ID가 없습니다." : null);

  // refetch 함수
  const refetchAll = () => {
    refetchMovie(); //영화 상세 정보 API를 다시 호출
    refetchCredits(); //출연진 정보 API를 다시 호출
  };

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

  // 에러 발생
  if (error || !movieData) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="text-red-400 text-xl mb-4">에러가 발생했습니다.</div>
        <div className="text-white text-lg mb-4">{error}</div>
        <div className="flex gap-4">
          <button
            onClick={refetchAll} // 클릭하면 refetchAll 함수를 호출
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 있으면 깔끔하게 접근
  const movie = movieData;
  const credits = creditsData;

  // 감독 찾기 (깔끔한 방식)
  let director = null;
  if (credits && credits.crew) {
    director = credits.crew.find((person: any) => person.job === "Director");
  }

  // 출연진 (깔끔한 방식)
  let mainCast = [];
  if (credits && credits.cast) {
    mainCast = credits.cast.slice(0, 10);
  }

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
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path || ""}`}
          alt={movie.title || "영화 포스터"}
          className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg"
        />

        {/* 영화 기본 정보 */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">
              {movie.title || "영화 제목"}
            </h1>

            <div className="flex gap-4 text-lg mb-4">
              <span className="text-yellow-400">
                ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
              </span>
              <span>
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "연도 미상"}
              </span>
              <span>{movie.runtime || "?"}분</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres
                ? movie.genres.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-purple-600 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))
                : null}
            </div>
          </div>

          {/* 줄거리 */}
          <div>
            <h2 className="text-xl font-bold mb-3">줄거리</h2>
            <p className="text-gray-300">
              {movie.overview || "줄거리 정보가 없습니다."}
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
            {mainCast.map((actor: any) => (
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
