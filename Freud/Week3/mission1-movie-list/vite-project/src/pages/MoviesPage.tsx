import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';

const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get<MovieResponse>(
                    'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
                    {
                        headers: {
                            // .env 파일에서 API 키를 안전하게 불러옵니다.
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setMovies(response.data.results);
            } catch (error) {
                console.error('영화 데이터를 불러오는 데 실패했습니다:', error);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">인기 영화</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default MoviesPage;