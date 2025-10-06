import { useState, useEffect } from 'react';
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import {LoadingSpinner} from '../components/LoadingSpinner';
import { useCustomFetch } from '../hooks/useCustomFetch';

export default function MoviePage() {
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useCustomFetch<MovieResponse>({
    url: 'https://api.themoviedb.org/3/movie/popular',
    params: {
      language: 'ko-KR',
      page: page,
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">영화를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">오류가 발생했습니다</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8 max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="text-5xl">🎬</span>
            인기 영화
          </h1>
          <p className="text-gray-600 text-lg">
            지금 가장 인기있는 영화를 만나보세요
          </p>
        </div>

        {/* 영화 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 min-w-[120px] border border-gray-200"
          >
            ← 이전
          </button>
          
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-md border border-gray-200">
            <span className="font-bold text-blue-600 text-lg">{page}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{Math.min(totalPages, 500)}</span>
          </div>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= Math.min(totalPages, 500)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 min-w-[120px]"
          >
            다음 →
          </button>
        </div>

        {/* 페이지 정보 */}
        <div className="text-center text-sm text-gray-500 mt-4">
          전체 {data?.total_results?.toLocaleString()}개의 영화
        </div>
      </div>
    </div>
  );
}