import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useCustomFetch from '../hooks/useCustomFetch';

const MoviesPage = () => {
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string }>();

    // 커스텀 훅으로 데이터 패칭
    const movieCategory = category || 'popular';
    const url = `https://api.themoviedb.org/3/movie/${movieCategory}?language=ko-KR&page=${page}`;
    const { data, isLoading, isError, error } = useCustomFetch<MovieResponse>(url, [page, category]);

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    // 에러 상태
    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-red-500 text-2xl mb-4">😢 에러가 발생했습니다</h2>
                    <p className="text-gray-400">{error || '데이터를 불러올 수 없습니다.'}</p>
                </div>
            </div>
        );
    }

    const categoryNames: { [key: string]: string } = {
        'popular': '인기 영화',
        'now_playing': '상영 중',
        'top_rated': '평점 높은',
        'upcoming': '개봉 예정'
    };

    const movies = data?.results || [];

    return (
        <div className="p-10 bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-white text-center">
                {categoryNames[movieCategory]}
                <span className="text-lg text-gray-400 ml-2">({movies.length}개)</span>
            </h1>

            <div className="grid grid-cols-5 gap-6 max-w-6xl mx-auto mb-8">
                {movies.slice(0, 15).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {/* 페이지네이션 버튼 */}
            <div className="flex justify-center items-center gap-4 mt-8">
                {page > 1 && (
                    <button
                        onClick={() => setPage(prev => prev - 1)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        ← 이전 페이지
                    </button>
                )}

                <span className="px-4 py-2 bg-gray-800 text-white rounded-lg font-bold">
                    페이지 {page}
                </span>

                <button
                    onClick={() => setPage(prev => prev + 1)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    다음 페이지 →
                </button>
            </div>
        </div>
    );
};

export default MoviesPage;