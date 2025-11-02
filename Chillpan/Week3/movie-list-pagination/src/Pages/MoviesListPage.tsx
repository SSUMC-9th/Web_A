import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie } from "../types/movie";
import MovieCards from "../components/MovieCards";

interface MoviesListPageProps {
  category: string;
}

export default function MoviesListPage({ category }: MoviesListPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 초기값은 null(에러 X)

  // 비동기 함수로 영화 데이터를 가져옴
  const fetchMovies = async (page: number = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = "";
      switch (category) {
        case "popular":
          endpoint = "movie/popular";
          break;
        case "now_playing":
          endpoint = "movie/now_playing";
          break;
        case "top_rated":
          endpoint = "movie/top_rated";
          break;
        case "upcoming":
          endpoint = "movie/upcoming";
          break;
        default:
          endpoint = "movie/popular";
      }

      //endpoint에 따른 API 주소 호출
      const { data } = await axios(
        `https://api.themoviedb.org/3/${endpoint}?language=ko-KR&page=${page}`, // endpoint에 따른 API 주소 호출-> endpoint 와 page 넘버 받아옴
        {
          headers: {
            Authorization: `Bearer ${
              import.meta.env.VITE_TMDB_KEY || "발급받은 토큰을 입력해주세요"
            }`,
          },
        }
      );

      setMovies(data.results);
      setCurrentPage(data.page);
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (err) {
      setError("영화 데이터를 불러오는데 실패했습니다.");
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect((): void => {
    fetchMovies(1);
  }, [category]);

  const goPreviousPage = () => {
    if (currentPage > 1) {
      fetchMovies(currentPage - 1);
    }
  };

  const goNextPage = () => {
    if (currentPage < totalPages) {
      fetchMovies(currentPage + 1);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="text-red-400 text-xl mb-4">에러에러애러.</div>
        <div className="text-white text-lg mb-4">{error}</div>
        <button
          onClick={() => fetchMovies(1)}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  //로딩이 정상적으로 완료 됬다면..
  return (
    <>
      <div className="flex justify-center items-center py-6 space-x-4">
        <button
          onClick={goPreviousPage}
          disabled={currentPage === 1} // 첫 번쨰 페이지면 비활성화!
          className={`flex items-center px-4 py-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 text-white cursor-pointer"
          }`}
        >
          이전
        </button>

        <div className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-md font-medium">
          {currentPage}페이지
        </div>

        <button
          onClick={goNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
            currentPage === totalPages
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
          }`}
        >
          다음
        </button>
      </div>

      <div className="p-4">
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCards key={movie.id} movie={movie} /> // 여기서 영화 카드 컴포넌트 호출
          ))}
        </div>
      </div>
    </>
  );
}
