import { useState } from "react";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      //sm(보통 600px) 이상에서의 제어
      className="relative flex flex-col sm:flex-row gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded-lg transition-all duration-300 hover:shadow-lg"
      onMouseEnter={(): void => setIsHovered(true)}
      onMouseLeave={(): void => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지`}
        className="w-full sm:w-32 h-32 sm:h-48 object-cover rounded"
      />

      {isHovered && (
        //자식 요소들을 세로(수직) 방향으로 정렬하는 flexbox 컨테이너로
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">
            {movie.title}
          </h2>
          // 텍스트가 길어질 경우, 기본 2줄까지만 보여주고 줄이는 tailwind CSS
          class
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-4">
            {movie.overview}
          </p>
          <div className="mt-1 sm:mt-2 text-xs text-gray-500">
            <p>개봉일: {movie.release_date}</p>
            <p>평점: {movie.vote_average}/10</p>
          </div>
        </div>
      )}
    </div>
  );
}
