import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Movie } from "../types/movie";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const navigateToMovieDetail = () => {
        navigate(`/movies/${movie.id}`);
    }

    return (
        <div
            onClick={navigateToMovieDetail}
            className="relative rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} 영화의 이미지`}
                className="w-full h-auto"
            />
            {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-md flex flex-col justify-center items-center text-white p-4">
                    <h2 className="text-lg font-bold text-center leading-snug mb-2">
                        {movie.title}
                    </h2>
                    <p className="text-sm text-gray-300 text-center leading-relaxed line-clamp-5">
                        {movie.overview || "줄거리 정보가 없습니다."}
                    </p>
                </div>
            )}
        </div>
    );
}