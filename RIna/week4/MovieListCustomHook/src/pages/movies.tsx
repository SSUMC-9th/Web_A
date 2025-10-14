import { useState } from "react";
import { Link } from "react-router-dom";
import type { MovieResponse } from "../types/movie";
import useCustomFetch from "../hooks/useCustomFetch";

const MoviesPage = () => {
    const [page, setPage]=  useState(1);
    const token = import.meta.env.VITE_TMDB_TOKEN;
    const url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`

    const {data, isLoading, error} = useCustomFetch<MovieResponse>(url, {
        headers: {Authorization: `Bearer ${token}`},
    });

    return (
        <div className="p-4 bg-gray-100">
            <h1 className="text-3xl p-4 font-bold mb-4">인기 영화</h1>

            {isLoading && (
                <div className="flex justify-center items-center my-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            )}
            {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

            {!isLoading && !error && data && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        {data.results.map((movie) => (
                            <Link key={movie.id} to={`/movies/${movie.id}`}>
                                <div className="relative overflow-hidden rounded-xl shadow-md group">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-auto transition duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center text-white p-3 text-center">
                                        <h2 className="font-semibold text-lg">{movie.title}</h2>
                                        <p className="text-sm line-clamp-3">{movie.overview}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={() => setPage((prev) => prev - 1)}
                            disabled={page === 1}
                            className={`px-3 py-1 rounded ${page === 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                            &lt;
                        </button>
                        <span>{page} 페이지</span>
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-3 py-1 rounded bg-purple-300 hover:bg-purple-400"
                        >
                            &gt;
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MoviesPage;