import { useState, useEffect } from "react";
import useCustomFetch from "../hooks/useCustomFetch";
import type { Movie } from "../types/movie";
import MovieCards from "../components/MovieCards";

interface MoviesListPageProps {
  category: string;
}

export default function MoviesListPage({ category }: MoviesListPageProps) {
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 카테고리에 따른 엔드포인트 결정
  const getEndpoint = (cat: string) => {
    switch (cat) {
      case "popular":
        return "movie/popular";
      case "now_playing":
        return "movie/now_playing";
      case "top_rated":
        return "movie/top_rated";
      case "upcoming":
        return "movie/upcoming";
      default:
        return "movie/popular";
    }
  };

  // 커스텀 훅으로 데이터 관리, 주소 하나로 쉽게 관리
  const { data, loading, error, refetch } = useCustomFetch(
    `https://api.themoviedb.org/3/${getEndpoint(
      category
    )}?language=ko-KR&page=${currentPage}`
  );

  // 데이터 업데이트를 위한 로컬 상태
  const [movies, setMovies] = useState<Movie[]>([]);

  // 데이터가 변경될 때마다 업데이트
  useEffect(() => {
    if (data) {
      const apiData = data as {
        results: Movie[];
        page: number;
        total_pages: number;
      };
      setMovies(apiData.results);
      setCurrentPage(apiData.page);
      setTotalPages(Math.min(apiData.total_pages, 500));
    }
  }, [data]);

  // 페이지네이션 함수들

  const goPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  //loading, error -> 커스텀 훅에서 가져옴
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
          onClick={() => refetch()} // 에러발생시 커스텀 훅에서 가져온 refetch 함수를 호출
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
        <div className="grid gap-4 grid-c<x>ols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCards key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
}
