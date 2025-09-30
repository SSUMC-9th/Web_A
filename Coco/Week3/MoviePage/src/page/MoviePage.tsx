import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Movie, MovieResponse } from '../types/movie'
import MovieCard from '../components/MovieCard'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            setError(null);

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
            } catch (err) {
                setError('영화 데이터를 불러오는데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchMovie();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-20">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">인기 영화</h1>

            {/* 영화 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {/* 페이지 버튼 */}
            <div className="flex justify-center items-center gap-4">
                <button 
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
                    disabled={page === 1} 
                    className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                >
                    이전
                </button>
                <span className="font-bold">{page} 페이지</span>
                <button 
                    onClick={() => setPage((prev) => prev + 1)} 
                    className="bg-gray-300 px-4 py-2 rounded"
                >
                    다음
                </button>
            </div>
        </div>
    );
}