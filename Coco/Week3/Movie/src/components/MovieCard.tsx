import React from "react";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({movie}: MovieCardProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
    <div
        className='relative rounded-xl shadow-md overflow-hidden cursor-pointer
        w-44 transition-transform duration-500 hover:scale-105' 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
    >
        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
        alt={`${movie.title} 영화의 이미지`} />

        {/* <h2>{movie.title}</h2>
        <p>{movie.overview}</p>
        <p>Release Date: {movie.release_date}</p>
        <p>Rating: {movie.vote_average} ({movie.vote_count} votes)</p> */}
    
        {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50
            transparent backdrop-blur-md flex flex-col justify-center 
            item-center text-white p-4">
                <h2 className="text-lg font-bold text-center leading-snug items-center">{movie.title}</h2>
                <p className="text-sm text-gray-300 leading-relaxed mt-2 
                line-clamp-5">
                    {movie.overview}</p>
                {/* <p className="text-sm mt-2">Release Date: {movie.release_date}</p>  
                <p className="text-sm">Rating: {movie.vote_average} ({movie.vote_count} votes)</p> */}
            </div>
        )}
    </div>
    );
}
