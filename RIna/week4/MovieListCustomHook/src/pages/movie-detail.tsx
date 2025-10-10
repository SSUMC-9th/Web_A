import { useParams } from "react-router-dom";
import type { MovieDetails, Credits } from '../types/movie';
import useCustomFetch from "../hooks/useCustomFetch";

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const token = import.meta.env.VITE_TMDB_TOKEN;

    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`;

    const {
        data: movie,
        isLoading: movieLoading,
        error: movieError,
    } = useCustomFetch<MovieDetails>(movieUrl, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const {
        data: credits,
        isLoading: creditsLoading,
        error: creditsError,
    } = useCustomFetch<Credits>(creditsUrl, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (movieLoading || creditsLoading)
        return (
        <div className="flex justify-center items-center my-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        );

    if (movieError || creditsError)
        return <p className="text-center text-red-500 font-semibold">영화 상세 페이지를 불러오는 중 오류 발생</p>;

    if (!movie) return null;

    return (
        <div className="p-4 bg-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
            <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 rounded-xl shadow-md"
            />
            <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-500 mb-2">개봉일: {movie.release_date}</p>
            <p className="text-gray-500 mb-2">평점: {movie.vote_average}</p>
            <p className="mb-4">{movie.overview}</p>
            <p className="text-sm text-gray-500">
                장르: {movie.genres.map((g) => g.name).join(", ")}
            </p>
            <p className="text-sm text-gray-500">상영시간: {movie.runtime}분</p>
            </div>
        </div>

        {credits && (
            <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">출연진</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="text-center">
                    {actor.profile_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full rounded-lg shadow-md mb-2"
                    />
                    )}
                    <p className="font-semibold">{actor.name}</p>
                    <p className="text-sm text-gray-500">{actor.character}</p>
                </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">제작진</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {credits.crew
                .filter((c) => ["Director", "Producer"].includes(c.job))
                .map((crew) => (
                    <div key={crew.id} className="text-center">
                    {crew.profile_path && (
                        <img
                        src={`https://image.tmdb.org/t/p/w200${crew.profile_path}`}
                        alt={crew.name}
                        className="w-full rounded-lg shadow-md mb-2"
                        />
                    )}
                    <p className="font-semibold">{crew.name}</p>
                    <p className="text-sm text-gray-500">{crew.job}</p>
                    </div>
                ))}
            </div>
            </div>
        )}
        </div>
    );
};

export default MovieDetailPage;
