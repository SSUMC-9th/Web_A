import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { MovieDetailResponse } from "../types/movieDetail";
import { LoadingSpinner } from "../components/LoadingSpinner";

const MovieDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<MovieDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                setLoading(true);
                const response = await axios.get<MovieDetailResponse>(
                    `https://api.themoviedb.org/3/movie/${id}`,
                    {
                        params: {
                            language: "ko-KR",
                        },
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setMovie(response.data);
            } catch (err) {
                setError('영화 정보를 불러오는데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-20">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="text-center p-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={() => navigate('/movies')}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    영화 목록으로
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <button 
                onClick={() => navigate('/movies')}
                className="bg-gray-300 px-4 py-2 rounded mb-6"
            >
                ← 뒤로가기
            </button>

            <div className="border rounded p-6">
                <div className="md:flex gap-6">
                    <div className="md:w-1/3 mb-4 md:mb-0">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full rounded"
                        />
                    </div>

                    <div className="md:w-2/3">
                        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                        
                        {movie.tagline && (
                            <p className="text-gray-500 italic mb-4">"{movie.tagline}"</p>
                        )}
                        
                        <div className="mb-4">
                            <span className="bg-yellow-400 px-3 py-1 rounded mr-2">
                                ⭐ {movie.vote_average.toFixed(1)}
                            </span>
                            <span className="text-gray-600">{movie.release_date}</span>
                            <span className="text-gray-600 ml-2">{movie.runtime}분</span>
                        </div>

                        <div className="mb-4">
                            <h2 className="font-bold mb-2">장르</h2>
                            <div className="flex gap-2 flex-wrap">
                                {movie.genres.map((genre) => (
                                    <span 
                                        key={genre.id}
                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className="font-bold mb-2">줄거리</h2>
                            <p className="text-gray-700">{movie.overview || "줄거리 정보가 없습니다."}</p>
                        </div>

                        {movie.budget > 0 && (
                            <p className="text-sm text-gray-600 mb-2">
                                제작비: ${movie.budget.toLocaleString()}
                            </p>
                        )}

                        {movie.revenue > 0 && (
                            <p className="text-sm text-gray-600">
                                수익: ${movie.revenue.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetailPage;