import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Movie, MovieResponse } from '../types/movie'
import MovieCard from '../components/MovieCard'
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            setError(false);

            try {
                const response = await axios.get<MovieResponse>(
                    "https://api.themoviedb.org/3/movie/popular",
                    {
                        params: {
                            language: "ko-KR",
                            page: page,
                        },
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setMovies(response.data.results);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [page]);

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <div className="text-red-500 text-xl">
                    에러가 발생했습니다. 잠시 후 다시 시도해주세요.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-10">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
                🎬 인기 영화
            </h1>

            {/* 페이지네이션 버튼 */}
            <div className="flex justify-center items-center mb-8 gap-4">
                <button 
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
                    disabled={page === 1} 
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500 transition"
                >
                    이전
                </button>
                <span className="text-white text-lg font-semibold">
                    페이지 {page}
                </span>
                <button 
                    onClick={() => setPage((prev) => prev + 1)} 
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    다음
                </button>
            </div>

            {/* 로딩 스피너 */}
            {loading && (
                <div className='flex justify-center items-center h-96'>
                    <LoadingSpinner />
                </div>
            )}

            {/* 영화 그리드 */}
            {!loading && (
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}