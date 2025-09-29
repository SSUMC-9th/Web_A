import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner'; //LoadingSpinner 임포트


const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    //로딩과 에러 상태 추가
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    //페이지 상태 추가
    const [page, setPage] = useState(1);
    //useParams를 사용해서 URL의 카테고리값 가져옴
    const { category } = useParams<{ category: string }>();

    useEffect(() => {
        const fetchMovies = async (): Promise<void> => {
            setIsPending(true);
            setIsError(false);
            try {
                const movieCategory = category || 'popular'; //디폴트로 popular 뜨도록 함. 
                const response = await axios.get<MovieResponse>(
                    `https://api.themoviedb.org/3/movie/${movieCategory}?language=ko-KR&page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setMovies(response.data.results);
            } catch (error) {
                console.error('영화 데이터를 불러오는 데 실패했습니다:', error);
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };
        fetchMovies();
    }, [page, category]);

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className='text-red-500 text-2xl'> 에러가 발생했습니다. </span>
            </div>
        );
    }

    const categoryNames: { [key: string]: string } = {
        'popular': '인기 영화',
        'now_playing': '상영 중',
        'top_rated': '평점 높은',
        'upcoming': '개봉 예정'
    };

    const currentCategory = category || 'popular';

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4 text-white">
                {categoryNames[currentCategory]}
            </h1>

            <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
                {movies.slice(0, 15).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {/* 페이지네이션 버튼 */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded font-semibold ${page === 1
                        ? 'bg-red-500 text-black cursor-not-allowed'
                        : 'bg-green-600 text-black hover:bg-green-700'
                        }`}
                >
                    이전 페이지
                </button>

                <span className="px-4 py-2 bg-purple-600 text-black rounded font-bold">
                    페이지 {page}
                </span>

                <button
                    onClick={() => setPage(prev => prev + 1)}
                    className="px-4 py-2 bg-orange-600 text-black rounded font-semibold hover:bg-orange-700"
                >
                    다음 페이지
                </button>
            </div>
        </div>
    );
};

export default MoviesPage;